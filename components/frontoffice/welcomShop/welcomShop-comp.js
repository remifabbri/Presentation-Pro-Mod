
import { useState, useEffect, useContext } from 'react';
import fire from '../../../config/firebase-config';
import Link from 'next/link';
import utilStyles from '../../../styles/utils.module.scss'
import styles from './welcomShop.module.scss';
import { StoreContext } from '../../../context/useStore';
import {getProductWelcomShop } from "./welcomShop-provider";

export default function WelcomShop() {
    const {addProduct} = useContext(StoreContext);
    const [Boutique, setBoutique] = useState({});

    useEffect(() => {

        (async() => {
            const Productdata = await getProductWelcomShop();
            setBoutique(Productdata);
        })();

    }, []);

    const showLowPriceWhenProductHaveOptionsBuy = (product) => {
        console.log(product);
        let prix; 
        Object.keys(product.listOptionsBuy).forEach(key => {
            console.log(prix > product.listOptionsBuy[key]);
            if(prix === undefined || prix*1 > product.listOptionsBuy[key]*1){
                prix = product.listOptionsBuy[key];
            }
        })

        return(
            <div>
                <p>{prix} €</p>
            </div>
        )
    } 

    console.log("ctrl boutique", Boutique);
    
    // TODO Envoyé la catégorie à la page Boutique pour préselectionné un filtre

    return (
        <div className={styles.blockProduitAccueil}>
            {Boutique && Object.keys(Boutique).map(category => 
                <div key={category} className={styles.blockCategory}>
                    <div className={styles.titleCategory}>
                        <p>{category}</p>
                        <button onClick={(e) => goToCategory(e, category)}>Voir tous les produits</button>
                    </div>
                    <div className={styles.blockProductCategory}>
                        {Object.keys(Boutique[category]).map(keyItem => 
                            <Link key={Boutique[category][keyItem].id} href="/boutiqueClient/[product]" as={'/boutiqueClient/' + Boutique[category][keyItem].id}>
                                <div key={Boutique[category][keyItem].id} className={styles.cardProduct}> 
                                    <div className={styles.blockImg}>
                                        <img src={Boutique[category][keyItem].images[0]}/>
                                    </div>
                                    <div className={styles.blockInfo}>
                                        <p className={styles.titre}>{Boutique[category][keyItem].name}</p>
                                        {Boutique[category][keyItem].optionsBuy ? 
                                            showLowPriceWhenProductHaveOptionsBuy(Boutique[category][keyItem])
                                            :
                                            <div>
                                                <span>{Boutique[category][keyItem].listOptionsBuy.only} €</span>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>    
            )}
        </div>     
    )
}