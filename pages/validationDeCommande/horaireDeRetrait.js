import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { fire, functions } from '../../config/firebase-config';
import utilStyles from '../../styles/utils.module.scss'
import styles from '../../styles/page/gestionAgenda.module.scss'
import Layout from '../../components/layout';
import { StoreContext } from '../../context/useStore'; 
import { AuthContext } from '../../context/useAuth'

import dayjs from 'dayjs'
import updateLocale from 'dayjs/plugin/updateLocale'

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(timezone)
dayjs.extend(utc)

dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
    weekdays: [
      "dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"
    ]
})

export default function Agenda({parentCallback, props}) {
    const router = useRouter();
    const {user} = useContext(AuthContext);
    const {store} = useContext(StoreContext);
    console.log("CTRL STORE", user); 
   
    const [ daysCalendar, setDayscalendar ] = useState();
    const [ selectedDay, setSelectedDay ] = useState();

    const [ horaireCollect , setHoraireCollect ] = useState();

    const [waintingResponce, setWaitingResponse] = useState(false);

    useEffect(() => {

        fire
        .firestore()
        .collection('AgendaBoutique')
        .doc('paramHoraire')
        .onSnapshot((doc) => {
            let paramDB = {...doc.data()}; 
            // console.log('ctrl ParamDB', paramDB);

            let next10Days = []
            for (let i = 0; i < 20; i++) {
                let day = {
                    dateStamp : dayjs().tz("Europe/Paris").add(i, 'day').format('DD-MM-YYYY'),
                    dateTimestamp : dayjs(dayjs().tz("Europe/Paris").add(i, 'day').format('YYYY-MM-DD')).unix() + 7200,
                    date : dayjs().add(i, 'day').format('ddd D'),
                    dateFull : dayjs().add(i, 'day').tz("Europe/Paris").format('dddd DD/MM'),
                    name : dayjs().add(i, 'day').locale('fr').format('dddd'), 
                }
                console.log(day);

                let allHoraire = ['0h', '0h30', '1h', '1h30', '2h', '2h30', '3h', '3h30', '4h', '4h30', '5h', '5h30', '6h', '6h30', '7h', '7h30', '8h', '8h30', '9h', '9h30', '10h', '10h30', '11h', '11h30', '12h', '12h30', '13h', '13h30', '14h', '14h30', '15h', '15h30', '16h', '16h30', '17h', '17h30', '18h', '18h30', '19h', '19h30', '20h', '20h30', '21h', '21h30', '22h', '22h30', '23h', '23h30'];
                if(paramDB.hasOwnProperty(day.name)){
                    let horaireDay = [];
                    Object.keys(paramDB[day.name]).forEach( item => {
                        let indexStart = allHoraire.indexOf(paramDB[day.name][item][0]);
                        let indexEnd =  allHoraire.indexOf(paramDB[day.name][item][1]);
                        let trancheHoraire = allHoraire.slice(indexStart, indexEnd);
                        horaireDay.push(trancheHoraire);
                    })
                    horaireDay = horaireDay.flat();

                    let startValueHoraire = allHoraire.indexOf(horaireDay[0]);
                    let endValueHoraire = allHoraire.indexOf(horaireDay[horaireDay.length - 1]);

                    let allHoraireBoutique = [...allHoraire];
                    allHoraireBoutique = allHoraireBoutique.slice(startValueHoraire, endValueHoraire + 1);
                    day = {...day, horaire: horaireDay, indexCurrentHoraire: -1, allHoraireBoutique: allHoraireBoutique };
                    // console.log('CONTROLE DAY',day);
                }
                next10Days.push(day)
            }

            setDayscalendar(next10Days);

            let curHoraire = `${dayjs().hour() + paramDB.limiteHoraire}h${dayjs().minute() > 30 ? 30 : ""}`;
            console.log(' CONTROLE curHoraire', curHoraire);
            let indexHoraire = next10Days[0].allHoraireBoutique.indexOf(curHoraire);
            console.log('indexHoraire', indexHoraire);
            next10Days[0].indexCurrentHoraire = indexHoraire;
            setSelectedDay(next10Days[0]);

         })
    }, [])

    const selectHoraireCollect = (e, h, currentDay) => {
        e.preventDefault(); 
        console.log(h);
        console.log(currentDay); 

        let dayHoraireSeleted = {
            date : currentDay.date,
            dateFull: currentDay.dateFull, 
            name: currentDay.name, 
            horaireCollect : h
        }

        setHoraireCollect(dayHoraireSeleted); 

    }

    const validatedOrder = (e) => {
        let postData = {
            date : horaireCollect.dateFull, 
            horaire : horaireCollect.horaireCollect, 
            listeProduit : store.panier,
            userId : user.uid, 
            userName: user.name
        }

        const init = {
            method: 'POST',
            body: JSON.stringify(postData),
            json: true, 
        }

        // TODO créer un fonction de wainting en attendant le retour de la requete
        setWaitingResponse(true);
        
        fetch("https://europe-west1-rfcompagny.cloudfunctions.net/createOrder", init) 
        .then(response => response.json())
        .then(result => {
            // TODO function Clean le panier si la commande est enregitré
            router.push("/backoffice/dashboard/dashboard")
            setWaitingResponse(false);
        });
        
    }

    return(
        <Layout>
            <div>
                <h3>Horaire de collect</h3>
                <i>Selectionner votre horaire pour le retrait de votre commande!</i>
                <div >
                    <div className={styles.rowDay}>
                        {daysCalendar && selectedDay && daysCalendar.map( (dayCalendar, indexDay) =>
                            dayCalendar.hasOwnProperty('horaire') && 
                                <button key={indexDay} onClick={(e) => {e.preventDefault; setSelectedDay(dayCalendar)}} className={selectedDay.date === dayCalendar.date ? styles.BtnOngletGestionAction : styles.BtnOngletGestion}>
                                    {dayCalendar.date}
                                </button>  
                        )}
                    </div>
                    <div className={styles.blockHoraireAgenda}>
                        {daysCalendar && selectedDay && selectedDay.allHoraireBoutique.map((horaire, indexHoraire) =>
                            <button key={indexHoraire} disabled={indexHoraire < selectedDay.indexCurrentHoraire}  onClick={(e) => selectHoraireCollect(e, horaire, selectedDay)}  
                                    className={selectedDay.horaire.indexOf(horaire) === -1 ? 
                                                styles.btnCloseHoraire 
                                                : 
                                                indexHoraire < selectedDay.indexCurrentHoraire ? 
                                                    styles.btnDisable 
                                                    :
                                                    horaire === horaireCollect?.horaireCollect && selectedDay.date === horaireCollect.date  ?
                                                        styles.BtnOngletGestionAction
                                                        :
                                                        styles.BtnOngletGestion
                                                } 
                            >
                                {horaire}
                            </button>    
                        )}
                    </div>
                </div>
                <button disabled={!horaireCollect} className={!horaireCollect ? styles.BtnValidationHoraireDisable  : styles.BtnValidationHoraire} onClick={(e)=>validatedOrder(e)}>Valider</button>
            </div>
        </Layout>
    )

}