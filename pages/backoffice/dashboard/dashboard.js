import { useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '../../../context/useAuth';
import utilStyles from '../../../styles/utils.module.scss';
import Layout from '../../../components/layout';
import NeedLog from '../../../components/needLog';
import OrderSectionClient from "../../../components/backoffice/dashboard/orderSectionClient";
import OrderSectionAdmin from "../../../components/backoffice/dashboard/orderSectionAdmin";
import ProfilSection from "../../../components/backoffice/dashboard/profilSection";

const Dashboard = () => {

    const {user} = useContext(AuthContext);
    // console.log("profil User", user);

    return (
      <Layout backOffice>
        <h1>Votre Compte</h1>
        
        {!user
          ? <NeedLog/>
          : 
          <>  
            {user.admin ?
                <>
                    <h3>Commandes Clients</h3>
                    <OrderSectionAdmin/>
                </>
                :
                <>
                    <h3>Résumé de vos commandes</h3>
                    <OrderSectionClient/>
                </>
            }
            <ProfilSection/> 
          </>
        }
      </Layout>
    )
}

export default Dashboard