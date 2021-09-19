import React, { useContext } from 'react';
import { AuthContext } from '../../../context/useAuth'
import Link from 'next/link';
import styles from '../../../styles/component/profilSection.module.scss';
import utilStyles from '../../../styles/utils.module.scss';


export default function ProfilSection() {
    const {user} = useContext(AuthContext);

    return (
        <div>
            <h3>Votre Profil</h3>
            <Link href="/users/profil">
                <div className={`${styles.blockprofilSection} ${styles.blockLink}`}>
                    <div>
                        <p>Nom</p>
                        <p>{user.name}</p>
                    </div>
                    <div>
                        <p>Email</p>
                        <p>{user.email}</p>
                    </div>
                    <div className={styles.roundIcon}><img src="/images/icons/manage_accounts-black.svg"/></div>
                </div>
            </Link>
        </div>
    )
}