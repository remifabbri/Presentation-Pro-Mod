import fire from '../../../config/firebase-config';


const getProductWelcomShop = async() => {
    return new Promise ((resolve, reject) => {
        fire.firestore()
        .collection('Boutique')
        .onSnapshot(snap => {
            let  ordersLoad = {};

            snap.forEach((doc) => {
                const dataOrder = {
                    ...doc.data(),
                    id : doc.id
                }

                let categoryProduct = extractCategorie(doc.data());
                
                if(referenceCategoryIsFind(categoryProduct, ordersLoad)){
                    ordersLoad[categoryProduct] = {
                        ...ordersLoad[categoryProduct], 
                        [dataOrder.id] : dataOrder
                    }
                }else{
                    ordersLoad = {
                        ...ordersLoad, 
                        [categoryProduct] : {
                            [dataOrder.id]: dataOrder
                        }
                    }
                }
            });
            resolve(ordersLoad);
        })
    }).then((value) => { 
        return value
    })


    function extractCategorie(document) {
        console.log(document);
        console.log(document.categories[0]);
        return document.categories[0];
    }

    function referenceCategoryIsFind(category, orders){
        if(orders.hasOwnProperty(category)){
            return true
        }else{
            return false
        }
    }

    
}

export { getProductWelcomShop }

