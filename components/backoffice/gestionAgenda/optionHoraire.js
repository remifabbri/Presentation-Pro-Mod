import React, { useState, useEffect } from 'react';
import fire from '../../../config/firebase-config';

import styles from '../../../styles/page/gestionAgenda.module.scss';
import utilStyles from '../../../styles/utils.module.scss';


export default function OptionHoraire() {

    const [whithdrawalLimite, setWithdrawalLimite] = useState(undefined);

    useEffect(() => {
        fire
        .firestore()
        .collection('AgendaBoutique')
        .doc('paramHoraire')
        .onSnapshot((doc) => {
            setWithdrawalLimite(doc.data().limiteHoraire);
        })
    }, [])

    const changeWhitdrawalLimite = (e) => {
        console.log(e.target.value);
        fire
        .firestore()
        .collection('AgendaBoutique')
        .doc('paramHoraire')
        .set({
            limiteHoraire: e.target.value*1
        }, {merge:true })
        
        setWithdrawalLimite(e.target.value);
    }

    return (
        <div>
            <h3>Délait Minimum de retrait des commandes</h3>
            <p>Définissez une limites de temps entre la validation de la commande et sont retrait.</p>
            <div>
                <select value={whithdrawalLimite !== undefined ? whithdrawalLimite : ""} onChange={(e) => changeWhitdrawalLimite(e)}>
                    <option value="" >--Choisir une limite de retrait--</option>
                    <option value="0">pas de limite</option>
                    <option value='1'>1 heure</option>
                    <option value='2'>2 heures</option>
                    <option value='3'>3 heures</option>
                </select>
            </div>
        </div>
    )
}