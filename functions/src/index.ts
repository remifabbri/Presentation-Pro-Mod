import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";
const corsHandler = cors({origin: true});
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const createOrder = functions
.region("europe-west1")
.https.onRequest((request, response) => {
  corsHandler(request, response, () => {
    const dataOrder = JSON.parse(request.body);

    admin
    .firestore()
    .collection("Boutique")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (dataOrder.listeProduit.hasOwnProperty(doc.id)) {
          Object.keys(dataOrder.listeProduit[doc.id]).forEach( keyRef =>{
            dataOrder.listeProduit[doc.id][keyRef] = {
              ...dataOrder.listeProduit[doc.id][keyRef],
              name: doc.data().name,
              images: doc.data().images,
              prix: doc.data().listOptionsBuy[keyRef],
            }
          })
        }
      });

      let total = 0;
      Object.keys(dataOrder.listeProduit).forEach((id : any) => {
        Object.keys(dataOrder.listeProduit[id]).forEach((idRef: any) => {
          total = total + (dataOrder.listeProduit[id][idRef].count * dataOrder.listeProduit[id][idRef].prix);
          total = Math.round((total + Number.EPSILON) * 100) / 100;
        })
      });
      dataOrder.prix = total;
      dataOrder.orderNumber = getRandomInt(1000, 10000);
      dataOrder.status = "En préparation",

      console.log(dataOrder);
      admin
      .firestore()
      .collection("Order")
      .add(dataOrder)
      .then((docRef) => {
        admin
        .firestore()
        .collection("Order")
        .doc(docRef.id)
        .collection("Messages")
        .add({
          messageText : `Bonjour ${dataOrder.userName}, votre commande a bien été prise en compte par notre boutique.`,
          userName: "Message système",
          sentBy: "systeme",
          sentAt: admin.firestore.Timestamp.fromDate(new Date())
        })
        .then(() => {
          // TODO envoyé des request pour décrémenter le stock
          response.send({data: "Commande Validé"});
        })
        .catch((error) => {
          response.send({
            data: "Un problème est survenue : problème de création de messagerie",
            error: error
          })
        })
      })
      .catch((error) => {
        response.send({
          data: "Un problème est survenue : problème création de commande",
          error: error
        })
      })
    });

    /**
      * Add two numbers.
      * @param {number} min Minimum for random number.
      * @param {number} max Maximum for random number.
      * @return {number} The random num.
      */
    function getRandomInt(min: number, max: number) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }
  });
});

export const nextStapeOrder = functions
.region("europe-west1")
.https.onRequest((request, response) => {
  corsHandler(request, response, () => {
    const orderData = JSON.parse(request.body);

    definedProcessForStape();
    
    async function definedProcessForStape(){
      switch(orderData.status){
        case "En préparation":
          await nextStapeReady()
          response.send({data: "Commande prête"});
          break;
        case "Prête":
          await nextStapeArchiving();
          response.send({data: "Commande archivée"});
          break; 
      }
    }

    async function nextStapeArchiving() {
      try {
        await archivingTheOrder();
        const snpashotMessagesOrders = await getMessageOrder();
        await archivingTheOrderMessages(snpashotMessagesOrders);
        await deleteMessageOrder();
        await deleteOrder();
      } catch (error) {
        console.error(error);
        sendError(error);
      }
    }

    async function archivingTheOrder() {
      const archive = {
        ...orderData, 
        status: "Livrée"
      }

      await admin
      .firestore()
      .collection("Archives")
      .doc(archive.id)
      .set(archive);
    }

    async function getMessageOrder(){
      const orderId = orderData.id;
      const snapshot = await admin
      .firestore()
      .collection("Order")
      .doc(orderId)
      .collection("Messages")
      .get()

      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      } 

      return snapshot
    }

    async function archivingTheOrderMessages(allMessages : any) {
      const orderId = orderData.id;
      
      allMessages.forEach((doc : any) => {
        admin
        .firestore()
        .collection("Archives")
        .doc(orderId)
        .collection("Messages")
        .doc(doc.id)
        .set(doc.data())
      });
    }

    async function deleteMessageOrder() {
      const orderId = orderData.id;
      const db = admin.firestore(); 
      const collectionPath  = `Order/${orderId}/Messages`;

      await deleteCollection(db, collectionPath, 50);

      async function deleteCollection(db : any, collectionPath : string, batchSize : number) {
        const collectionRef = db.collection(collectionPath);
        const query = collectionRef.limit(batchSize);
      
        return new Promise((resolve, reject) => {
          deleteQueryBatch(db, query, resolve).catch(reject);
        });
      }
      
      async function deleteQueryBatch(db : any, query : any, resolve : any) {
        const snapshot = await query.get();
        const batchSize = snapshot.size;
        
        if (batchSize === 0) {
          resolve();
          return;
        }

        const batch = db.batch();
        snapshot.docs.forEach((doc : any) => {
          console.log("delete Doc", doc.ref, "batch");
          batch.delete(doc.ref);
        });
        await batch.commit();
      
        process.nextTick(() => {
          deleteQueryBatch(db, query, resolve);
        });
      }
    }

    async function deleteOrder() {
      const orderId = orderData.id;
      await admin
      .firestore()
      .collection("Order")
      .doc(orderId)
      .delete()
    }

    async function nextStapeReady() {
      try{
        await setStatusOrder();
        await setMessageSystemToDiscussionOrder();
      }
      catch(error){
        console.error(error);
        sendError(error);
      }
    }

    async function setStatusOrder() {
      const orderId = orderData.id;
      await admin
      .firestore()
      .collection("Order")
      .doc(orderId)
      .set({status : "Prête"}, {merge: true})
    }

    async function setMessageSystemToDiscussionOrder(){
      const orderId = orderData.id;
      await admin
      .firestore()
      .collection("Order")
      .doc(orderId)
      .collection("Messages")
      .add({
        messageText : `${orderData.userName}, votre commande est prête :D`,
        userName: "Message système",
        sentBy: "systeme",
        sentAt: admin.firestore.Timestamp.fromDate(new Date())
      })
    }

    function sendError(error : any) {
      response.send({
        data: "Un problème est survenue !",
        error: error
      })
    }

  });
}); 
