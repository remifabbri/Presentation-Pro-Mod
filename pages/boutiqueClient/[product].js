import { useEffect, useState, useContext } from 'react';
import fire from '../../config/firebase-config';
import Layout from '../../components/layout';
import Head from 'next/head';
import Link from 'next/link'
import styles from '../../styles/page/product.module.scss';
import { StoreContext } from '../../context/useStore'; 
import WelcomShop from "../../components/frontoffice/welcomShop/welcomShop-comp"; 


const Product = (props) => {
  const {addProduct} = useContext(StoreContext);

  const [choise, setChoise] = useState("default");
  console.log('choise: ', choise);


  const choiseOptionProduct = (list) => {
    console.log(list);
    return(
      <div className={styles.choise}>
        {Object.keys(list).map( ref => 
          ref !== "only" &&
            <button onClick={() => setChoise(ref)}>{ref}</button>
        )}
      </div>
    )
  }

  const choiseAndBtnAddtoCart = (product) => {
    console.log("list", product.listOptionsBuy);
    const list = product.listOptionsBuy;
    
      return(
        <div>
          {choise === "default" && 
            defaultProduct(product)
          }
          {choise !== "default" && 
            Object.keys(list).map( ref => 
              <div>
                {choise === ref && (
                  <div className={styles.blockRefPrixBtnAddCart}>
                    <div className={styles.rowRefprice}>
                      {ref !== "only" && 
                        <label>{ref}</label>
                      }
                      <p>{list[ref]} €</p>
                    </div>
                    <button onClick={(e) =>{ e.preventDefault() ,addProduct(product, ref)}}>Ajouter au panier</button>
                  </div>
                )}
              </div>
            )
          }
        </div>
      )
  }

  const defaultProduct = (product) => {
    let productDefault;
    const list = product.listOptionsBuy;
    Object.keys(list).forEach(key => {
      if(productDefault === undefined || productDefault[key]*1 > list[key]*1){
        productDefault = {[key] : list[key]};
      }
    });
    
    return(
      productDefault && Object.keys(productDefault).map( ref => 
        <div className={styles.blockRefPrixBtnAddCart}>
          <div className={styles.rowRefprice}>
            {ref !== "only" && 
              <label>{ref}</label>
            }
            <p>{productDefault[ref]} €</p>
          </div>
          <button onClick={(e) =>{ e.preventDefault() ,addProduct(product, ref)}}>Ajouter au panier</button>
        </div>
      )
    )
  }

  
  return (
    <Layout>
      <Head>
        <title>Boutique</title>
      </Head>
      <div>
        <div className={styles.headerProduct}>
          <div className={styles.blockImg}>
            <img src={props.images}/>
          </div>
          <div className={styles.blockAction}>
            <h1>{props.name}</h1>
            <p>{props.description}</p>
            {choiseOptionProduct(props.listOptionsBuy)}
            {choiseAndBtnAddtoCart(props)}
          </div>
        </div>
        <div>
          <h2>Info Produit</h2>
          {props.mainAttributs && Object.keys(props.mainAttributs).map( key => 
            <div className={styles.blockAttribute}>  
              <label>{key}</label>
              <p>{props.mainAttributs[key]}</p>
            </div>
          )}
          {props.secondaryAttributs && Object.keys(props.secondaryAttributs).map( key => 
            <div className={styles.blockAttribute}>  
              <label>{key}</label>
              <p>{props.secondaryAttributs[key]}</p>
            </div>
          )}
        </div>
        <div>
          <h2 className={styles.titleProduitMoment}>Nos produits du moment.</h2>
          <WelcomShop/>
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps = async ({ query }) => {
    const content = {}
    console.log(query.product); 
    await fire.firestore()
      .collection('Boutique')
      .doc(query.product)
      .get()
      .then(result => {
        content['id'] = result.id !== "false" ? result.id : false 
        content['name'] = result.data()?.name ? result.data().name : ""
        content['description'] = result.data()?.description ? result.data().description : ""
        content['optionsBuy'] = result.data()?.optionsBuy ? result.data().optionsBuy : false
        content['listOptionsBuy'] = result.data()?.listOptionsBuy ? result.data().listOptionsBuy : {}
        content['stock'] = result.data()?.stock ? result.data().stock : null
        content['publish'] = result.data()?.publish ? result.data().publish : false
        content['images'] = result.data()?.images ? result.data().images : []
        content['categories'] = result.data()?.categories ? result.data().categories : []
        content['mainAttributs'] = result.data()?.mainAttributs ? result.data().mainAttributs : {}
        content['secondaryAttributs'] = result.data()?.secondaryAttributs ? result.data().secondaryAttributs : {}

      });
    return {
      props: {
        id: content.id,
        name: content.name,
        description: content.description,
        optionsBuy : content.optionsBuy,
        listOptionsBuy: content.listOptionsBuy,
        stock: content.stock,
        publish: content.publish,
        images: content.images,
        categories: content.categories,
        mainAttributs : content.mainAttributs,
        secondaryAttributs : content.secondaryAttributs
      }
    }
  }


export default Product