import React, { useState, useEffect } from 'react';
import fire from '../../../config/firebase-config';
import Layout from '../../../components/layout'; 
import Head from 'next/head'; 
import Link from 'next/link';
import styles from '../../../styles/page/Scss_boutique.module.scss';
import utilStyles from '../../../styles/utils.module.scss';
import OrdersHistory from "../../../components/backoffice/history/history-component";


export default function History() {

    return(
        <Layout backOffice>
            <h2>Historique de vos commandes</h2>
            <OrdersHistory/>
        </Layout>
    )
}