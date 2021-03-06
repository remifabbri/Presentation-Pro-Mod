import { useState, useContext } from 'react'; 
import fire from '../../config/firebase-config';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context/useAuth'
import utilStyles from '../../styles/utils.module.scss'

const Register = () => {
  const router = useRouter();
  const {signUpWithGoogle, signUp} = useContext(AuthContext);
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passConf, setPassConf] = useState('');
  const [notification, setNotification] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password !== passConf) {
      setNotification(
       'Password and password confirmation does not   match'
      )
      setTimeout(() => {
        setNotification('')
      }, 2000)
      setPassword('');
      setPassConf('');
      return null;
    }

    signUp({ name, email, password })
    setname('');
    setEmail('');
    setPassword('');
    setPassConf('');
  }

  const signUpGoogle = (e) => {
    e.preventDefault(); 
    return signUpWithGoogle()
  }

  return (
    <div className={utilStyles.signSection}>
      <div className={utilStyles.bgSignSection}></div>
      <div className={utilStyles.signBlock}>
        <h1>Create your account</h1>
        {notification}
        <div className={utilStyles.styleHr}></div>
        <h3>Sign up with social média</h3>
        <button className={utilStyles.signGoogle} onClick={(e) => signUpGoogle(e)}></button>
        <div className={utilStyles.styleHr}></div>
        <h3>create a traditional account</h3>
        <form onSubmit={handleLogin} className={utilStyles.formDefault} >
          <div className={`${utilStyles.form__group} ${utilStyles.field}`}>
            <input type="input" className={utilStyles.form__field} placeholder="Name" value={name} 
              onChange={({target}) => setname(target.value)} required />
            <label className={utilStyles.form__label}>Name</label>
          </div>
          <div className={`${utilStyles.form__group} ${utilStyles.field}`}>
            <input type="input" className={utilStyles.form__field} placeholder="Email" value={email} 
              onChange= {({target}) => setEmail(target.value)} required />
            <label className={utilStyles.form__label}>Email</label>
          </div>
          <div className={`${utilStyles.form__group} ${utilStyles.field}`}>
            <input type="input" className={utilStyles.form__field} placeholder="Password" value={password} 
              onChange= {({target}) => setPassword(target.value)} required />
            <label className={utilStyles.form__label}>Password</label>
          </div>
          <div className={`${utilStyles.form__group} ${utilStyles.field}`}>
            <input type="input" className={utilStyles.form__field} placeholder="Password conf" value={passConf} 
              onChange= {({target}) => setPassConf(target.value)} required />
            <label className={utilStyles.form__label}>Password conf</label>
          </div>
          <button type="submit" className={utilStyles.ActionButton}>
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register

