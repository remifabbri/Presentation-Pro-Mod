import { useEffect, useState, useContext } from 'react';
import fire from '../../../config/firebase-config';
import Layout from '../../../components/layout';
import Head from 'next/head';
import Link from 'next/link'; 
import { AuthContext } from '../../../context/useAuth';
import styles from '../../../styles/page/order.module.scss';
import utilStyles from '../../../styles/utils.module.scss';
import MessageOrder from '../../../components/messageOrder';
import DetailProductOrder from "../../../components/detailProductOrder";
import { useRouter } from 'next/router';

const Order = (props) => {
  const router = useRouter();
  const {user} = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [waitingResponseNextStape, setWaitingResponseNextStape] = useState(false);
  const [toggleSectionMessage, setToggleSectionMessage] = useState(false);
  const [toggleSectionDetailOrder, setToggleSectionDetailOrder] = useState(false);
  
  useEffect(() => {
    fire.firestore()
    .collection('Order')
    .doc(props.orderId)
    .onSnapshot((doc) => {
      if(doc.data() === undefined){
        return router.push("/backoffice/dashboard/dashboard");
      }
      let dataOrder = {
        ...doc.data(), 
        id: props.orderId
      }
      setOrder(dataOrder)
    })

    callSection(props); 
  }, []);

  const callSection = (props) => {
    console.log(props);
    if(props.openSection === "discussion"){
      setToggleSectionMessage(true);
      setToggleSectionDetailOrder(false); 
    }
    if(props.openSection === "produit"){
      setToggleSectionMessage(false);
      setToggleSectionDetailOrder(true); 
    }
  }

  const toggleSection = (section) => {
    if(section === "discussion"){
        setToggleSectionMessage(true);
        setToggleSectionDetailOrder(false); 
      }
      if(section === "produit"){
        setToggleSectionMessage(false);
        setToggleSectionDetailOrder(true); 
      }
  }

  const nextStapeOrder = (e, Order) => {
    e.preventDefault();

    const init = {
        method: 'POST',
        body: JSON.stringify(Order),
        json: true, 
    }

    setWaitingResponseNextStape(true);
    
    fetch("https://europe-west1-rfcompagny.cloudfunctions.net/nextStapeOrder", init) 
    .then(response => response.json())
    .then(result => {
        // TODO redirection vers le résumé de la commande
        router.push("/backoffice/dashboard/dashboard"); 
        console.log(result.data);
        setWaitingResponseNextStape(false);
    });
  } 


  return (
    <Layout backOffice>
      <Head>
        <title>Commande</title>
      </Head>
      {order &&
        <div className={styles.container}>
            <div className={order.status === "En préparation" ? `${styles.blockOrderSection} ${styles.preparation}` : `${styles.blockOrderSection} ${styles.prete}`}>
                <div className={styles.gridOrders}>
                    <div className={styles.headerStatus}>
                        <div className={order.status === "En préparation" ? styles.statusEnregistre : styles.statusPrete} >
                            <div className={styles.circle}></div> 
                            <span>{order.status}</span>
                        </div>
                        {user.admin && 
                            <div>
                                <button disable={waitingResponseNextStape? "true": ""} onClick={(e)=>nextStapeOrder(e, order)} className={styles.btnActionEtapeSuivant} >
                                    <div className={styles.icon}></div>
                                    <span>étape suivante</span>
                                </button>
                            </div>
                        }
                    </div>

                    <div className={styles.detailOrder}>
                        <div className={styles.prix}>{order.prix} €</div>
                        <div className={styles.verticalSeparation}></div>
                        <div className={styles.infos}>
                            <p>Commande N° <strong>{order.orderNumber}</strong></p>
                            <p>Retrait prévu le <strong>{order.date}</strong> à <strong>{order.horaire}</strong></p>
                            <p>{Object.keys(order.listeProduit).length} Produit(s)</p>
                        </div>
                    </div>
                    <div className={styles.rowLinkAction}>
                    
                    <a className={styles.btnActionDetailProduit} onClick={() => toggleSection("produit")}>
                        <div className={styles.icon}></div>
                        <span>Détail</span> 
                    </a>
                    <a className={styles.btnActionDiscussion}  onClick={() => toggleSection("discussion")}>
                        <div className={styles.icon}></div>
                        <span>Discussion</span> 
                    </a>
                    
                    </div>
                </div>
                <div className={styles.gridMessages}>
                  {toggleSectionDetailOrder && 
                    <DetailProductOrder order={order}/>
                  }
                  {toggleSectionMessage && 
                    <MessageOrder orderId={props.orderId} collection={"Order"}/>
                  }     
                </div>
        
            </div>
        </div>
      }
    </Layout>
  )
}

export const getServerSideProps = async ({ query }) => {
    const content = {}
    console.log(query.orderId);
    return {
      props: {
        orderId: query.orderId,
        openSection: query.openSection
      }
    }
  }


export default Order