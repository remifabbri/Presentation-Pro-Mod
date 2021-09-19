import { useState, useEffect, useContext, createContext, FC} from 'react';
import fire from '../config/firebase-config';

import { AuthContext } from './useAuth';


export type StoreContextState = {
    store : {
        panier: {}
    }; 
    addProduct : (product: any, refProduct: any) => void;
    changeProductQuantity : (idproduit: string, one: number, ref: string ) => void;
    deleteProduct : (idproduit: string, ref: string) => void;
}

const contextDefaultValues: StoreContextState = {
    store: {
        panier: {}
    },
    addProduct: () => {},
    changeProductQuantity: () => {},
    deleteProduct: () => {}
}

export const StoreContext = createContext<StoreContextState>( 
    contextDefaultValues
);


export const StoreProvider: FC = ({ children })  => {
    const {user} = useContext(AuthContext);

    const [store, setStore] = useState(contextDefaultValues.store);

    useEffect(() => {
        if(user?.uid){
            fire
            .firestore()
            .collection('Panier')
            .doc(user.uid)
            .onSnapshot((doc) => {
                console.log("snap StorePanier", doc.data());
                if( doc.data() !== undefined ){
                    setStore({...store, panier: doc.data().listeRefProduit });
                }
            })
        }
    }, [user])

    
    const addProduct = (product: any, refPrice : any) => {
        let newObjPanier = {};
        console.log("product", product);
        
        checkIfPanierIsNull()

        function checkIfPanierIsNull(){
            let panierIsNull = store.panier === null;
            if(panierIsNull){
                addProductToPanier()
            }else{
                checkIfPanierHasThisProduct()
            }
        }

        function checkIfPanierHasThisProduct(){
            let panierHasThisProduct = store.panier.hasOwnProperty(product.id);
            if(panierHasThisProduct){
                checkIfProductHasThisRef()
            }else{
                addProductToPanier()
            }
        }

        function checkIfProductHasThisRef(){
            let productHasThisRef = store.panier[product.id].hasOwnProperty(refPrice);
            if(productHasThisRef){
                incrementRefOfProduct(); 
            }else{
                addRefToProduct();
            }
        }

        function addProductToPanier() {
            newObjPanier = {
                ...store.panier, 
                [product.id] : {
                    [refPrice] : {id : product.id, count : 1, refPrice : refPrice}
                }
            };
        }

        function addRefToProduct() {
            newObjPanier = {...store.panier};
            newObjPanier[product.id][refPrice] = {id : product.id, count : 1, refPrice : refPrice}
        }

        function incrementRefOfProduct() {
            newObjPanier = {...store.panier};
            newObjPanier[product.id][refPrice].count = newObjPanier[product.id][refPrice].count + 1
        }

        console.log("newObjPanier", newObjPanier);

        fire
        .firestore()
        .collection('Panier')
        .doc(user.uid)
        .set({
            listeRefProduit: newObjPanier
        }, {merge: true})
        .then(() => {
            setStore({...store, panier: newObjPanier });
        })
        .catch((error) => {
            console.log('Error add RefProduct to Doc in collection Panier', error);
        })
    };

    const changeProductQuantity = (idProduit, one, ref) => {
        // console.log('store.panier', store.panier);
        let newObjPanier = {...store.panier};
        let ctrlQuantity = newObjPanier[idProduit][ref].count;

        if(newObjPanier[idProduit][ref].count > 1){

            newObjPanier[idProduit][ref].count = newObjPanier[idProduit][ref].count + one
        }else if(one > 0){
            newObjPanier[idProduit][ref].count = newObjPanier[idProduit][ref].count + one
        }
        
        if(ctrlQuantity !==  newObjPanier[idProduit][ref].count){
            fire
            .firestore()
            .collection('Panier')
            .doc(user.uid)
            .set({
                listeRefProduit: newObjPanier
            }, {merge: true})
            .then(() => {
                setStore({...store, panier: newObjPanier });
            })
            .catch((error) => {
                console.log('Error add RefProduct to Doc in collection Panier', error);
            })
        }
    };
    const deleteProduct = (idProduit: string, ref: string) => {
        let newObjPanier = {...store.panier};
        delete newObjPanier[idProduit][ref];
        checkIfProductIsEmpty();

        function checkIfProductIsEmpty(){
            if(Object.entries(newObjPanier[idProduit]).length === 0){
                delete newObjPanier[idProduit];
            }
        }

        fire
        .firestore()
        .collection('Panier')
        .doc(user.uid)
        .set({
            listeRefProduit: newObjPanier
        })
        .then(() => {
            setStore({...store, panier: newObjPanier });
        })
        .catch((error) => {
            console.log('Error add RefProduct to Doc in collection Panier', error);
        })
    };

    // const store = useStoreProvider();
    return( 
        <StoreContext.Provider 
            value={{
                store,
                addProduct,
                changeProductQuantity,
                deleteProduct
            }}
        >
            {children}
        </StoreContext.Provider>
    );
}







// export const useStore = () => {
//     return useContext(storeContext);
// };   

// const useStoreProvider = () => {
//     const auth = useAuth();
//     const user = auth.user; 

//     const [store, setStore] = useState({
//         panier : null,
//     });

//     useEffect(() => {

//         if(user !== null){
//             fire
//             .firestore()
//             .collection('Panier')
//             .doc(user.uid)
//             .onSnapshot((doc) => {
//                 if(doc.data() !== undefined){
//                     let listeProduit = doc.data().listeRefProduit;
//                     setStore({...store, panier : listeProduit});
//                 }
//             })
//         }
//     }, [user]);
    

//     const addproduct = (idProduit) => {
//         // console.log('store.panier', store.panier);
//         let newObjPanier = {};
//         if(store.panier === null){
//             newObjPanier = {[idProduit] : {id : idProduit, count : 1}};
//         }else{
//             if(store.panier.hasOwnProperty(idProduit)){
//                 newObjPanier = {...store.panier}; 
//                 newObjPanier[idProduit].count = newObjPanier[idProduit].count + 1
//             }else{
//                 newObjPanier = {...store.panier, [idProduit] : {id : idProduit, count : 1}};
//             }
//         }

//         fire
//         .firestore()
//         .collection('Panier')
//         .doc(user.uid)
//         .set({
//             listeRefProduit: newObjPanier
//         }, {merge: true})
//         .then(() => {
//             setStore({...store, panier: newObjPanier });
//         })
//         .catch((error) => {
//             console.log('Error add RefProduct to Doc in collection Panier', error);
//         })
//     };

//     const removeProduct = (idProduit, one) => {
//         // console.log('store.panier', store.panier);
//         let newObjPanier = {...store.panier};
//         let ctrlQuantity = newObjPanier[idProduit].count;

//         if(newObjPanier[idProduit].count > 1){

//             newObjPanier[idProduit].count = newObjPanier[idProduit].count + one
//         }else if(one > 0){
//             newObjPanier[idProduit].count = newObjPanier[idProduit].count + one
//         }

        
//         if(ctrlQuantity !==  newObjPanier[idProduit].count){
//             fire
//             .firestore()
//             .collection('Panier')
//             .doc(user.uid)
//             .set({
//                 listeRefProduit: newObjPanier
//             }, {merge: true})
//             .then(() => {
//                 setStore({...store, panier: newObjPanier });
//             })
//             .catch((error) => {
//                 console.log('Error add RefProduct to Doc in collection Panier', error);
//             })
//         }
//     };

//     const deleteProduitToShopcart = (idProduit) => {
//         // console.log('store.panier', store.panier);
//         let newObjPanier = {...store.panier};
//         delete newObjPanier[idProduit];

//         fire
//         .firestore()
//         .collection('Panier')
//         .doc(user.uid)
//         .set({
//             listeRefProduit: newObjPanier
//         })
//         .then(() => {
//             setStore({...store, panier: newObjPanier });
//         })
//         .catch((error) => {
//             console.log('Error add RefProduct to Doc in collection Panier', error);
//         })
//     };



//     return {
//         store,
//         addProduitToShopcart,
//         changeNumberProduitToShopcart,
//         deleteProduitToShopcart
//     };
// };