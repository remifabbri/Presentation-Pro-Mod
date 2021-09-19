import React, { useState, useEffect, useContext } from 'react';
import fire from '../../../config/firebase-config';
import { AuthContext } from '../../../context/useAuth'
import Link from 'next/link';
import styles from '../../../styles/component/orderSection.module.scss';
import utilStyles from '../../../styles/utils.module.scss';


export default function OrderSectionClient() {
    const {user} = useContext(AuthContext);
    const [orders, setOrder] = useState([]);

    useEffect(() => {
        if(user){
            fire
            .firestore()
            .collection('Order')
            .where("userId", "==", user.uid)
            .onSnapshot((querySnapshot) => {
                let ordersLoad = [];
                querySnapshot.forEach((doc) => {
                    let dataOrder = {
                        ...doc.data(),
                        id : doc.id
                    }
                    ordersLoad.push(dataOrder);
                });
                console.log(ordersLoad);
                setOrder(ordersLoad)
            })
        }
    }, [user])


    return (
        <div>
            
            { orders.length === 0 && (
                <div>Aucune commande en cours</div>
            )}
            { orders.length >= 1 && (
                orders.map( O => 
                    <div key={O.id}>
                       
                            <div className={O.status === "En préparation" ? `${styles.blockOrderSection} ${styles.preparation}` : `${styles.blockOrderSection} ${styles.prete}`}>
                            <div className={styles.headerStatus}>
                                <div className={O.status === "En préparation" ? styles.statusEnregistre : styles.statusPrete} >
                                    <div className={styles.circle}></div> 
                                    <span>{O.status}</span>
                                </div>
                            </div>
                                <div className={styles.detailOrder}>
                                    <div className={styles.prix}>{O.prix} €</div>
                                    <div className={styles.verticalSeparation}></div>
                                    <div className={styles.infos}>
                                        <p>Commande N° <strong>{O.orderNumber}</strong></p>
                                        <p>Retrait prévu le <strong>{O.date}</strong> à <strong>{O.horaire}</strong></p>
                                        <p>{Object.keys(O.listeProduit).length} Produit(s)</p>
                                    </div>
                                </div>
                                <div className={styles.rowLinkAction}>
                                    <Link href={{
                                        pathname: '/backoffice/order/order',
                                        query: {orderId : O.id, openSection: "produit"}
                                    }}>
                                        <a className={styles.btnActionDetailProduit}>
                                            <div className={styles.icon}></div>
                                            <span>Détail</span> 
                                        </a>
                                    </Link>
                                    <Link href={{
                                        pathname: '/backoffice/order/order',
                                        query: {orderId : O.id, openSection: "discussion"}
                                    }}>
                                        <a className={styles.btnActionDiscussion}>
                                            <div className={styles.icon}></div>
                                            <span>Discussion</span> 
                                        </a>
                                    </Link>
                                </div>
                            </div>
                     
                    </div>  
                )
            )}

        </div>
    )
}