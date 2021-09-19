import React, { useState, useEffect, useContext } from 'react';
import fire from '../../config/firebase-config';
import Layout from '../../components/layout';
import Head from 'next/head';
import Link from 'next/link'
import styles from '../../styles/page/boutiqueClient.module.scss';
import FilterCategories from '../../hooks/filterCategories';

import { StoreContext } from '../../context/useStore'; 

export default function BoutiqueClient() {

  const {addProduct} = useContext(StoreContext);

  const [boutique, setBoutique] = useState([]);

  const [filterCategories, setFilterCategories] = useState ([]); 

  const [notification, setNotification] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => { 
      fire
      .firestore()
      .collection('Boutique')
      .onSnapshot(snap => {
          const produitBoutique = snap.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
          }));
          setBoutique(produitBoutique); 
      });
  }, []);

  useEffect(() => {
      if(filterCategories.length > 0){
          fire
          .firestore()
          .collection('Boutique')
          .where('categories', 'array-contains-any', filterCategories)
          .get()
          .then((querySnapshot) => {
              const produitBoutique = querySnapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data()
              }));
              setBoutique(produitBoutique); 
          })
      }else{
          fire
          .firestore()
          .collection('Boutique')
          .onSnapshot(snap => {
              const produitBoutique = snap.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data()
              }));
              setBoutique(produitBoutique); 
          }); 
      }

  }, [filterCategories]);

  const callbackFilter = (filterArr) => {
      setFilterCategories(filterArr);
  }

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

  console.log("controle filterArr", filterCategories );

  if(!boutique){
      return (
          <div>
              Loading...
          </div>
      )
  }

  return (
    <Layout>
      <Head>
        <title>Ma Boutique</title>
      </Head>
      
      {notification}
      <div className={styles.rowTitleButton}>
          <h2>Boutique</h2>
      </div>
      
      <FilterCategories CallbackFilter={callbackFilter} props={filterCategories}/>
      
      <div className={styles.blockProduitBoutiqueClient}>
            {boutique.map( B => 
            <Link key={B.id} href="/boutiqueClient/[product]" as={'/boutiqueClient/' + B.id}>
              <div key={B.id} className={styles.cardProduct}>
                <div className={styles.blockImg}>
                  <img src={B.images[0]}/> 
                </div>
                <div className={styles.blockInfo}>
                  <p className={styles.titre}>{B.name}</p>
                  {showLowPriceWhenProductHaveOptionsBuy(B)}
                </div>
              </div>
            </Link>
            
            )}
      </div>
    </Layout>
  )
}