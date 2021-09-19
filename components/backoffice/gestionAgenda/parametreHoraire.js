import React, { useState, useEffect } from 'react';
import fire from '../../../config/firebase-config';

import styles from '../../../styles/page/gestionAgenda.module.scss';
import utilStyles from '../../../styles/utils.module.scss';


export default function ParamHoraire() {

    const [horaireOuverture , setHoraireOuverture] = useState({
        lundi: [], 
        mardi: [], 
        mercredi: [],
        jeudi: [], 
        vendredi: [],
        samedi: [], 
        dimanche: []
    })

    useEffect(() => {
        fire
        .firestore()
        .collection('AgendaBoutique')
        .doc('paramHoraire')
        .onSnapshot((doc) => {
            let jourParam = doc.data();
            let horaire = {...horaireOuverture};
            Object.keys(jourParam).forEach(id => {
                horaire[id] = Object.values(jourParam[id]);
            });
            setHoraireOuverture(horaire);
        })
    }, [])

    const addOpenHour = (e , jour) => {
        e.preventDefault();
        let newHoraire = {...horaireOuverture}; 
        newHoraire[jour].push(["",""]);
        setHoraireOuverture(newHoraire);
    }

    const changeHoraire = (jour, index, indexHoraire, e) => {
        let newHoraire = {...horaireOuverture}; 
        let changeHoraire = {...horaireOuverture}; 
        newHoraire[jour][index][indexHoraire] = e.target.value;
        changeHoraire[jour][index][indexHoraire] = e.target.value;
        
        console.log(newHoraire[jour][index]); 
        console.log(newHoraire[jour][index][indexHoraire]);
        console.log(newHoraire);
        
        if(changeHoraire[jour][index][0] !== "" && changeHoraire[jour][index][1] !== "" ){
            Object.keys(changeHoraire).forEach( id => {
                console.log(changeHoraire[id]);
                if(changeHoraire[id].length === 0 ){
                    delete changeHoraire[id];
                }else{
                    changeHoraire[id] = {...changeHoraire[id]}
                }
            });
            console.log('controle Horaire', changeHoraire);

            fire
            .firestore()
            .collection('AgendaBoutique')
            .doc('paramHoraire')
            .set({
                ...changeHoraire
            }, {merge: true})
            .then(() => {
                return setHoraireOuverture(newHoraire); 
            })
        }else{
            setHoraireOuverture(newHoraire);
        }
    }

    const deleteHoraire = ( e, jour, index ) => {
        e.preventDefault(); 
        console.log('jour', jour);
        console.log('index', index); 
        let newHoraire = {...horaireOuverture}; 
        newHoraire[jour].splice(index, 1);
        let changeHoraire = {...newHoraire};
        
        Object.keys(changeHoraire).forEach( id => {
            console.log(changeHoraire[id]);
            if(changeHoraire[id].length === 0 ){
                delete changeHoraire[id];
            }else{
                changeHoraire[id] = {...changeHoraire[id]}
            }
        });
        
        fire
        .firestore()
        .collection('AgendaBoutique')
        .doc('paramHoraire')
        .set({
            ...changeHoraire
        }, {merge: true})
        .then(() => {
            return setHoraireOuverture(newHoraire); 
        })
    }

    const optionHoraire = [
        {value: "4h"},
        {value: "4h30"},
        {value: "5h"},
        {value: "5h30"},
        {value: "6h"},
        {value: "6h30"},
        {value: "7h"},
        {value: "7h30"},
        {value: "8h"},
        {value: "8h30"},
        {value: "9h"},
        {value: "9h30"},
        {value: "10h"},
        {value: "10h30"},
        {value: "11h"},
        {value: "11h30"},
        {value: "12h"},
        {value: "12h30"},
        {value: "13h"},
        {value: "13h30"},
        {value: "14h"},
        {value: "14h30"},
        {value: "15h"},
        {value: "15h30"},
        {value: "16h"},
        {value: "16h30"},
        {value: "17h"},
        {value: "17h30"},
        {value: "18h"},
        {value: "18h30"},
        {value: "19h"},
        {value: "19h30"},
        {value: "20h"},
        {value: "20h30"},
        {value: "21h"},


    ]

    return(
        <div>
            <h3>Horraire d'ouverture pour le retrait des commandes.</h3>
            <div>

                {horaireOuverture && Object.keys(horaireOuverture).map( (jour, indexJour) => 
                    <div key={indexJour} className={styles.blockJour}>
                        <label className={styles.labelJour}>{jour}</label>
                        {horaireOuverture[jour].length === 0 && 
                            <div>
                                <p className={styles.labelClose}>Fermé</p>
                                <button onClick={(e) => addOpenHour(e, jour)} className={styles.BtnAddTh}>+ Ajouter une tranche horaire pour le {jour}</button>
                            </div>
                        }

                        {horaireOuverture[jour].length > 0 && 
                            <div>
                                {horaireOuverture[jour].map( (value, index) =>
                                
                                    <div key={index} className={styles.blockTancheHoraire}>
                                        <div className={styles.blockHoraire}>
                                            {horaireOuverture[jour][index].map( (horaire, indexHoraire) => 
                                                <div key={indexHoraire} >
                                                    {indexHoraire === 0 ? 
                                                        <div className={styles.blockSelect}>
                                                            <label>Ouverture</label>
                                                            <select value={horaire !== undefined ? horaire : ""} onChange={(e) => changeHoraire(jour, index, indexHoraire, e)}>
                                                                <option value="" >--Choisir un horaire--</option>
                                                                {optionHoraire.map( horaireOption => 
                                                                        <option key={horaireOption.value} value={horaireOption.value} >{horaireOption.value}</option>    
                                                                )}
                                                            </select>
                                                        </div>
                                                        :  
                                                        <div className={styles.blockSelect}>
                                                            <label>Fermeture</label>
                                                            <select value={horaire !== undefined ? horaire : ""} onChange={(e) => changeHoraire(jour, index, indexHoraire, e)}>
                                                                <option value="" >--Choisir un horaire--</option>
                                                                {optionHoraire.map( horaireOption => 
                                                                        <option key={horaireOption.value} value={horaireOption.value} >{horaireOption.value}</option>    
                                                                )}
                                                            </select>
                                                        </div>
                                                    }
                                                </div>    
                                            )}
                                        </div>
                                        <button onClick={(e) => deleteHoraire(e, jour, index)} className={styles.btnSupTH}><img src={'/images/delete_red.svg'}/></button>
                                    </div>
                                )}
                                <button onClick={(e) => addOpenHour(e, jour) } className={styles.BtnAddTh}>+ Ajouter une tranche horaire pour le {jour}</button>
                            </div>
                        }
                    </div>
                
                )}
            </div>
        </div>
    )
}