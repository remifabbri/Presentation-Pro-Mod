
import React, { useState, useEffect, useRef, useContext } from 'react';
import { fire } from '../config/firebase-config';
import { AuthContext } from '../context/useAuth';
import utilStyles from '../styles/utils.module.scss';
import styles from '../styles/component/messageOrder.module.scss'

export default function MessageOrder({orderId, collection}) {
    const {user} = useContext(AuthContext);

    const blockConv = useRef(null);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect( () => {
        const unsubscribeMessage = 
            fire
            .firestore()
            .collection(collection)
            .doc(orderId)
            .collection('Messages')
            .orderBy('sentAt')
            .onSnapshot((querySnapshot) => {
                const arrMessages = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    data.id = doc.id
                    arrMessages.push(data);
                })
                setMessages(arrMessages);
            })
            console.log("mount");

            return () => {
                console.log("unmount");
                unsubscribeMessage()
            };
    }, [])

    useEffect( () => {
        if( blockConv.current !== null){
            blockConv.current.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest"})
        }
    });

    const sendMessage = (e) => {
        e.preventDefault();
        if(newMessage !== ""){
            fire
            .firestore()
            .collection('Order')
            .doc(orderId)
            .collection('Messages')
            .add({
                messageText: newMessage,
                sentAt: fire.firestore.Timestamp.fromDate(new Date()),
                sentBy: user.uid,
                userName : user.name 

            })
            .then(() => {
                setNewMessage('');
            }); 
        }

    }

    return(
        <div className={styles.blockMessageConv}>
            <div ref={blockConv} className={styles.blockMessage}>
                {messages && messages.map((m,index) => 
                    <div key={index}>
                    {m.sentBy === user.uid ? 
                        <div  className={styles.messageUser}>
                            <p>{m.messageText}</p>
                        </div>
                        :
                        <div className={styles.message}>
                            <img src={m.userPP}></img>
                            <p>{m.userName && <span className={styles.displayName}>{m.userName}</span>}<span>{m.messageText}</span></p>
                        </div>
                    }
                    </div>
                )}
            </div>
                <div className={styles.rowActionButton}>
                    <div className={styles.limiteBlock}>
                        <textarea type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}/>
                        <button onClick={(e) => sendMessage(e)} className={utilStyles.ActionButtonAdd}><img src="/images/icons/send-white.svg"/></button>
                    </div>
                </div>
        </div>
    )

}