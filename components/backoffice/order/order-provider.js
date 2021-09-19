import fire from '../../../config/firebase-config';

const getOrdersAdmin = async() => {
    return new Promise ((resolve, reject) => {
        fire
        .firestore()
        .collection('Order')
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
        console.log('value: ', value); 
        return value
    })
}

const getOrdersClient = async(userId) => { 
    return new Promise ((resolve, reject) => {
        fire
        .firestore()
        .collection('Order')
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

export { getOrdersAdmin, getOrdersClient }