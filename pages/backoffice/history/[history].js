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

const History = (props) => {
  const {user} = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [waitingResponseNextStape, setWaitingResponseNextStape] = useState(false);
  const [toggleSectionMessage, setToggleSectionMessage] = useState(false);
  const [toggleSectionDetailOrder, setToggleSectionDetailOrder] = useState(false);
  
  useEffect(() => {
    fire.firestore()
    .collection('Archives')
    .doc(props.orderId)
    .get()
    .then(result => {
      setOrder(result.data())
    })

    callSection(props); 
  }, []);

  const callSection = (props) => {
    actionToggle(props.openSection);
  }

  const toggleSection = (section) => {
    actionToggle(section); 
  }

  const actionToggle = (callName) => {
    if(callName === "discussion"){
        setToggleSectionMessage(true);
        setToggleSectionDetailOrder(false); 
    }
    if(callName === "produit"){
        setToggleSectionMessage(false);
        setToggleSectionDetailOrder(true); 
    }
  }


  return (
    <Layout backOffice>
      <Head>
        <title>Commande</title>
      </Head>
      {order &&
        <div className={styles.container}>
            <div className={`${styles.blockOrderSection} ${styles.deliver}`}>
                <div className={styles.gridOrders}>
                    <div className={styles.headerStatus}>
                        <div className={ styles.statusDeliver} >
                            <div className={styles.circle}></div> 
                            <span>{order.status}</span>
                        </div>
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
                    <MessageOrder orderId={props.orderId} collection={"Archives"}/>
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


export default History