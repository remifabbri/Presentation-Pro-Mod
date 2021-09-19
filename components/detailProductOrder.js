
import React, { useState, useEffect, useRef, useContext } from 'react';
import { fire } from '../config/firebase-config';

import utilStyles from '../styles/utils.module.scss';
import styles from '../styles/component/detailProductOrder.module.scss'

export default function DetailProductOrder({order}) {
    console.log('order: ', order);

    const [product, setProduct] = useState(order.listeProduit);
    
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    useEffect( () => {
        console.log("product",order); 
    }, [])
    useEffect( () => {
        getTotalPriceProduct(product);
    }, [product])

    const getTotalPriceProduct = (product) => {
        let count = 0;
        let total = 0;
        Object.keys(product).forEach(key => {
            Object.keys(product[key]).forEach(keyRef => {
                count = count + product[key][keyRef].count;
                total = total + (product[key][keyRef].count * product[key][keyRef].prix);
                total = Math.round((total + Number.EPSILON) * 100) / 100;
            });
        });
        
        setTotalCount(count);
        setTotalPrice(total);
    }

    console.log('product: ', product);
    
    // TODO Finir l'ux de la section détail des produits de la commandes
    return(
        <div className={styles.blockDetailProduct}>
            {Object.keys(product).map(key => 
                Object.keys(product[key]).map( keyRef => 
                    <div key={keyRef} className={styles.item}>
                        <div className={styles.images}>
                            <img src={product[key][keyRef].images[0]}/>
                        </div>
                        <div className={styles.name}>
                            <p>{product[key][keyRef].name}</p>
                        </div>
                        <div className={styles.ref}>
                            <p>{product[key][keyRef].refPrice === "only" ? "Ø" : product[key][keyRef].refPrice }</p>
                        </div>
                        <div className={styles.count}>
                            <p>{product[key][keyRef].count}</p>
                        </div>
                        <div className={styles.price}>
                            <p>{product[key][keyRef].prix}€</p>
                        </div>
                    </div>
                )
            )}
            <div className={styles.rowtotal}>
                <div className={styles.images}>

                </div>          
                <div className={styles.espace}>

                </div>
                <div className={styles.totalCount}>
                    <p>{totalCount}</p>
                </div>
                <div className={styles.totalPrice}>
                    <p>{totalPrice}€</p>
                </div>
            </div>
        </div>
    )

}