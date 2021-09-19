import { useEffect } from 'react';
import '../styles/global.scss'
import { AppProps } from 'next/app';
import { AuthProvider } from '../context/useAuth';
import { StoreProvider } from '../context/useStore';
import { analytics } from '../config/firebase-config';

export default function App({ Component, pageProps } : AppProps) {

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      analytics();
    }
  }, [])

  return(
      <AuthProvider>
        <StoreProvider>
          <Component {...pageProps} />
        </StoreProvider>
      </AuthProvider>
    ) 
  }
    
