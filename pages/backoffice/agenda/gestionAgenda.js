import React, { useState, useEffect } from 'react';
import fire from '../../../config/firebase-config';
import Layout from '../../../components/layout'; 
import Head from 'next/head'; 
import Link from 'next/link';

import styles from '../../../styles/page/gestionAgenda.module.scss';
import utilStyles from '../../../styles/utils.module.scss';

import Agenda from '../../../components/backoffice/gestionAgenda/agenda'
import ParamHoraire from '../../../components/backoffice/gestionAgenda/parametreHoraire'
import OptionHoraire from '../../../components/backoffice/gestionAgenda/optionHoraire'

export default function GestionAgenda() {

    const [ongletAgenda, setOngletAgenda] = useState(true);
    const [ongletParam, setOngletParam] = useState(false);
    const [ongletOption, setOngletOption] = useState(false);

    return(
        <Layout backOffice>
            <Head>
                <title>Agenda Boutique</title>
            </Head>

            <h2 className={utilStyles.titleCenter}>Gestion de l'agenda de votre boutique</h2>
            <div className={styles.menuGestionAgenda}>
                <button onClick={(e) => {e.preventDefault(); setOngletAgenda(true); setOngletParam(false); setOngletOption(false)}} className={ongletAgenda ? styles.BtnOngletGestionAction : styles.BtnOngletGestion}>Agenda</button>
                <button onClick={(e) => {e.preventDefault(); setOngletAgenda(false); setOngletParam(true); setOngletOption(false)}} className={ongletParam ? styles.BtnOngletGestionAction : styles.BtnOngletGestion}>Horaire D'ouverture</button>
                <button onClick={(e) => {e.preventDefault(); setOngletAgenda(false); setOngletParam(false); setOngletOption(true)}} className={ongletOption ? styles.BtnOngletGestionAction : styles.BtnOngletGestion}>Option D'ouverture</button>
            </div>
            
            {ongletAgenda && 
                <Agenda/>
            }
            {ongletParam && 
                <ParamHoraire/>
            }
            {ongletOption && 
                <OptionHoraire/>
            }

        </Layout>
    )
}