import { useState, useEffect, createContext, FC} from 'react';
import { fire, auth, db } from '../config/firebase-config';
import { useRouter } from 'next/router';

export type AuthContextState = {
    user : {
        uid: string,
        email: string,
        name: string,
        admin: Boolean
    };
    signUp: ({}) => void;
    signIn: ({}) => void; 
    signOut: () => void;
    signUpWithGoogle: () => void;
    signInWithGoogle: () => void;
    sendPasswordResetEmail: (email: string) => void;
}

const contextDefaultValues: AuthContextState = {
    user: {
        uid: "",
        email: "",
        name: "",
        admin: false
    },
    signUp: () => {},
    signIn: () => {},
    signOut: () => {},
    signUpWithGoogle: () => {},
    signInWithGoogle: () => {},
    sendPasswordResetEmail: () => {}
}

export const AuthContext = createContext<AuthContextState>(
    contextDefaultValues
);

export const AuthProvider : FC = ({ children }) => {
    const router = useRouter();
    
    const [user, setUser] = useState(contextDefaultValues.user);

    const handleAuthStateChanged = (user) => {
        setUser(user);
        if (user) {
            getUserAdditionalData(user);
        }
    };

    useEffect(() => {
        const unsub = auth.onAuthStateChanged(handleAuthStateChanged);
        return () => unsub();
    }, []);

    useEffect(() => {
        if (user?.uid) {
          // Subscribe to user document on mount
          const unsubscribe = db
            .collection('users')
            .doc(user.uid)
            .onSnapshot((doc) => {
                setUser({
                    name: doc.data().name,
                    email: doc.data().email,
                    uid: doc.data().uid,
                    admin: doc.data().admin
                });
            });
            
          return () => unsubscribe();
        }
      }, []);

    //   useEffect(() => {
    //     // if (user?.uid) {
    //     //     // Subscribe to user document on mount
    //     //     router.push("/backoffice/dashboard")
    //     // }else{
    //     //     router.push("/");
    //     // };
    //     router.push("/backoffice/dashboard");
    //   }, [contextDefaultValues.user]);


    const createUser = (user) => {
        return db
            .collection('users')
            .doc(user.uid)
            .set(user)
            .then(() => {
                setUser(user);
                router.push("/")
                return user;
            })
            .catch((error) => {
                return { error };
            });
    };

    const getUserAdditionalData = (user) => {
        return db
         .collection('users')
         .doc(user.uid)
         .get()
         .then((userData) => {
            if (userData.data()) {
                setUser({
                    name: userData.data().name,
                    email: userData.data().email,
                    uid: userData.data().uid,
                    admin: userData.data().admin
                });
            }
         });
    };

    const signUp = ({ name, email, password }) => {
        return auth
        .createUserWithEmailAndPassword(email, password)
        .then((response) => {
            auth.currentUser.sendEmailVerification();
            return createUser({ uid: response.user.uid, email, name });
        })
        .catch((error) => {
            return { error };
        });
    };

    const signIn = ({ email, password }) => {
        return auth
        .signInWithEmailAndPassword(email, password)
        .then((response) => {
            router.push("/backoffice/dashboard/dashboard");
            setUser({
                name: response.user.displayName,
                email: response.user.email,
                uid: response.user.uid,
                admin: false
            });
            getUserAdditionalData(user);
            router.push("/");
            return response.user;
         })
         .catch((error) => {
            return { error };
        });
    };

    const signInWithGoogle = () => {
        return auth
          .signInWithPopup(new fire.auth.GoogleAuthProvider())
          .then((response) => {
            setUser({
                name: response.user.displayName,
                email: response.user.email,
                uid: response.user.uid,
                admin: false
            })
            getUserAdditionalData(user);
            return response.user;
           })
           .catch((error) => {
                return { error };
        });
    };

    const signUpWithGoogle = () => {
        return auth
          .signInWithPopup(new fire.auth.GoogleAuthProvider())
          .then((response) => {
              setUser({
                name: response.user.displayName,
                email: response.user.email,
                uid: response.user.uid,
                admin: false
            });
              return createUser({ uid: response.user.uid, email :response.user.email, name: response.user.displayName });
        });
    };

    const signOut = () => {
        return auth
        .signOut()
        .then(() => {
            setUser({
                uid: "",
                email: "",
                name: "",
                admin: false
            })
            router.push("/")
            return
        });
    }

    const sendPasswordResetEmail = (email) => {
        return auth.sendPasswordResetEmail(email).then((response) => {
            router.push('/users/login');
            return response;
        });
    };

    return (
        <AuthContext.Provider 
            value={{
                user,
                signUp, 
                signIn, 
                signOut,
                signUpWithGoogle, 
                signInWithGoogle,
                sendPasswordResetEmail
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}