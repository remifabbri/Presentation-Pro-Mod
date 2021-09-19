import { useContext } from 'react';
import Link from 'next/link'
import { AuthContext } from '../../context/useAuth'
import utilStyles from '../../styles/utils.module.scss'
import Layout from '../../components/layout';
import NeedLog from '../../components/needLog'

const profil = () => {

    const {user, signOut} = useContext(AuthContext);
    // console.log("profil User", user);

    return (
      <Layout backOffice>
        <h1> Votre Profil</h1>
        
        {!user
          ? <NeedLog/>
          :  <>
              <h3>Nom</h3>
              <p>{user.name}</p>
              <h3>Email</h3>
              <p>{user.email}</p>
              <h2>Option de gestion</h2>
              <Link href="/users/resetpassword">
                <a>Changé le mot de passe de son compte</a>
              </Link>
              <button className={`${utilStyles.ButtonAhref}`} onClick={(e) => { e.preventDefault(); signOut()}}>Logout</button>
            </>
        }
      </Layout>
    )
}

export default profil