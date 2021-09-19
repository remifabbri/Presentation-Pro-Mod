import React, { useState, useEffect } from 'react';
import { fire} from '../../../config/firebase-config';
import utilStyles from '../../../styles/utils.module.scss'
import styles from '../../../styles/page/gestionAgenda.module.scss'

import dayjs from 'dayjs'
import updateLocale from 'dayjs/plugin/updateLocale'

dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
    weekdays: [
      "dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"
    ]
})

export default function Agenda({parentCallback, props}) {
   
    const [ daysCalendar, setDayscalendar ] = useState();
    const [ selectedDay, setSelectedDay ] = useState();

    useEffect(() => {

        fire
        .firestore()
        .collection('AgendaBoutique')
        .doc('paramHoraire')
        .onSnapshot((doc) => {
            // console.log(doc.data());
            let paramDB = {...doc.data()}; 
            // console.log('ctrl ParamDB', paramDB);

            let next10Days = []
            for (let i = 0; i < 20; i++) {
                let day = {
                    date : dayjs().add(i, 'day').locale('fr').format('ddd D'),
                    name : dayjs().add(i, 'day').locale('fr').format('dddd'),
                }

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

    console.log('CONTROLE SELECTED DAY', selectedDay)

    return(
        <div>
            <h3>Agenda des retraits des commandes</h3>
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
                    <button key={indexHoraire} disabled={indexHoraire > selectedDay.indexCurrentHoraire}  className={selectedDay.horaire.indexOf(horaire) === -1 ? styles.btnCloseHoraire : indexHoraire > selectedDay.indexCurrentHoraire ? styles.BtnOngletGestion : styles.btnDisable }>
                        {horaire}
                    </button>    
                )}
            </div>
        </div>
    )
}