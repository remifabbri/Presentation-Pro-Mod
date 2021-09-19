import fire from '../../../config/firebase-config';

const getArchivingOrdersAdmin = async() => {
    return new Promise ((resolve, reject) => {
        fire
        .firestore()
        .collection('Archives')
        .onSnapshot((querySnapshot) => {
            let ordersLoad = [];
            querySnapshot.forEach((doc) => {
                let dataOrder = {
                    ...doc.data(),
                    id : doc.id
                }
                ordersLoad.push(dataOrder);
            });
            resolve(ordersLoad);
        })
    }).then((value) => { 
        return value
    })
}

const getArchivingOrdersClient = async(userId) => { 
    return new Promise ((resolve, reject) => {
        fire
        .firestore()
        .collection('Archives')
        .where("userId", "==", userId)
        .onSnapshot((querySnapshot) => {
            let ordersLoad = [];
            querySnapshot.forEach((doc) => {
                let dataOrder = {
                    ...doc.data(),
                    id : doc.id
                }
                ordersLoad.push(dataOrder);
            });
            console.log("ordersLoad",ordersLoad);
            resolve(ordersLoad);
        })
    }).then((value) => { 
        return value
    })
}

export { getArchivingOrdersAdmin, getArchivingOrdersClient }