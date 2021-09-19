import React, { useState, useEffect, useContext } from "react";
import { fire } from "../../config/firebase-config";
import Link from "next/link"
import styles from "../../styles/component/shoppingCartModal.module.scss"
import Layout from "../../components/layout";

import { StoreContext } from "../../context/useStore"; 

export default function DetailPanier() {

    const {store, changeProductQuantity, deleteProduct} = useContext(StoreContext);

    // .where(firebase.firestore.FieldPath.documentId(), "in", listOfReferences)

    const [produitPanier, setProduitPanier] = useState<any | null>(null);
    const [prixTotal, setPrixTotal] = useState(0);

    useEffect(() => {
        console.log(store);
        if(store.panier !== null){
            getProductPanier();
        }
    }, [store])

    const getProductPanier = () => {
        fire
        .firestore()
        .collection('Boutique')
        .onSnapshot((querySnapshot) => {
            let productDB = [];
            querySnapshot.forEach((doc) => {
                console.log('doc.id', doc.id);
                console.log(store);

                console.log(store.panier);
                if(store.panier.hasOwnProperty(doc.id)){
                    Object.keys(store.panier[doc.id]).forEach( key => {
                        let data = {
                            ...doc.data(), 
                            id : doc.id,
                            count : store.panier[doc.id][key].count,
                            ref : key
                        }
                        productDB.push(data);
                    })
                }
            });
            if(productDB.length > 0){
                setProduitPanier(productDB);
            }
            let total = 0;
            productDB.forEach(element => {
                total = total + (element.count * element.listOptionsBuy[element.ref]*1);
                total = Math.round((total + Number.EPSILON) * 100) / 100;
            });
            setPrixTotal(total);
        })
    }

    console.log(produitPanier); 

    return(
        <Layout>
            <div >
                <h3>Votre Panier</h3>
                <div className={styles.actionShoppingCart}>
                    <span>sous-total: <span>{prixTotal}€</span></span>
                    <Link href="/validationDeCommande/horaireDeRetrait">
                        <button className={styles.btnActionPrincipale}>Passer commande</button>
                    </Link>
                </div>
                {produitPanier && produitPanier.map(P => 
                    <div key={P.id} className={styles.itemShoppingCart}>
                        <Link href="/boutiqueClient/[product]" as={'/boutiqueClient/' + P.id}>
                            <div className={styles.linkItem}>
                                <img src={P.images}/>
                                <p className={styles.name}>{P.name}</p>
                                <p className={styles.ref}>{P.ref === "only" ? "Ø" : P.ref}</p>
                            </div>
                        </Link>
                        <div className={styles.incremItem}>
                            <button onClick={(e) => {e.preventDefault(); changeProductQuantity(P.id, -1, P.ref)}}>-</button>
                            <span>{P.count}</span>
                            <button onClick={(e) => {e.preventDefault(); changeProductQuantity(P.id, 1, P.ref)}}>+</button>
                        </div>
                        <button onClick={(e) => {e.preventDefault(); deleteProduct(P.id, P.ref)}}>sup</button>
                    </div>    
                )}
                
            </div>
        </Layout>
    )
}