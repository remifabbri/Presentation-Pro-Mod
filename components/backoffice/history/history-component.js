import React, { useState, useEffect, useContext } from 'react';
import fire from '../../../config/firebase-config';
import { AuthContext } from '../../../context/useAuth'
import Link from 'next/link';
import styles from '../../../styles/component/orderSection.module.scss';
import utilStyles from '../../../styles/utils.module.scss';
import {getArchivingOrdersAdmin, 
        getArchivingOrdersClient } from "./history-provider";


export default function OrdersHistory() {
    const {user} = useContext(AuthContext);
    const [orders, setOrder] = useState([]);


    useEffect(() => {
        
        (async() => {
            if(user && user.uid !== ""){
                const dataorder = await getDataOrderArchiving();
                setOrder(dataorder);
            }
        })();

    }, [user])

    const getDataOrderArchiving = async() => {
        if(user.admin){
            return await getArchivingOrdersAdmin();
        }else{
            return await getArchivingOrdersClient(user.uid);         
        }
    }

    return (
        <div>
            
            { orders.length === 0 && (
                <div>Aucune commande archivée</div>
            )}
            { orders.length >= 1 && (
                orders.map( O => 
                    <div key={O.id}>
                        <div className={`${styles.blockOrderSection} ${styles.deliver}`}>
                            <div className={styles.headerStatus}>
                                <div className={ styles.statusDeliver} >
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
                                    pathname: '/backoffice/history/history',
                                    query: {orderId : O.id, openSection: "produit"}
                                }}>
                                    <a className={styles.btnActionDetailProduit}>
                                        <div className={styles.icon}></div>
                                        <span>Détail</span> 
                                    </a>
                                </Link>
                                <Link href={{
                                    pathname: '/backoffice/history/history',
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