import React, { useState, useEffect } from 'react';
import fire from '../../../config/firebase-config';
import Layout from '../../../components/layout'; 
import Head from 'next/head'; 
import Link from 'next/link';
import styles from '../../../styles/page/Scss_boutique.module.scss';
import utilStyles from '../../../styles/utils.module.scss';
import Orders from "../../../components/backoffice/order/order-component";


export default function OrdersPage() {

    return(
        <Layout backOffice>
            <h2>Vos commandes en cours</h2>
            <Orders/>
        </Layout>
    )
}