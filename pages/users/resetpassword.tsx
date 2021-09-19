import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context/useAuth'
import utilStyles from '../../styles/utils.module.scss'

const ResetPasswordForm = () => {
    const {sendPasswordResetEmail} = useContext(AuthContext);
    
    const [email, setEmail] = useState('');
    const [notify, setNotification] = useState('');
    
    const onSubmit = (e) => {
        e.preventDefault();
        sendPasswordResetEmail(email)
    };

    return (
        <div className={utilStyles.signSection}>
            <div className={utilStyles.bgSignSection}></div>
            <div className={utilStyles.signBlock}>
                <h1>Reset Password</h1>
                {notify}
                <form onSubmit={(e) => onSubmit(e)} className={utilStyles.formDefault} >
                    <div className={`${utilStyles.form__group} ${utilStyles.field}`}>
                        <input type="input" className={utilStyles.form__field} placeholder="Email" value={email} 
                        onChange={({target}) => setEmail(target.value)} required />
                        <label className={utilStyles.form__label}>Your Email</label>
                    </div>
                    <button type="submit" className={utilStyles.ActionButton}>Send Email</button>
                </form>
            </div>
        </div>
    );
};
export default ResetPasswordForm;