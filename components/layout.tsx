import { useState, useContext, useEffect, useRef } from 'react';
import { fire } from "../config/firebase-config";
import Head from 'next/head'
import styles from '../styles/component/layout.module.scss'
import utilStyles from '../styles/utils.module.scss'
import Link from 'next/link'; 
import detectMobileOrDesktop from '../hooks/detectMobileOrDesktop.js'

import { AuthContext } from '../context/useAuth';
import { StoreContext } from "../context/useStore"; 

import ShoppingCartModal from './shoppingCartModal';


const logoName = 'logo RFCompagny'
export const siteTitle = 'RFCompagny'

export default function Layout({ 
        children, 
        home, 
        backOffice 
    }:{
        children: React.ReactNode, 
        home?: boolean, 
        backOffice?: boolean 
    }){

    const {user} = useContext(AuthContext);
    const {store} = useContext(StoreContext);
    const isMobile = detectMobileOrDesktop().isMobile();

    const [togglePanier, setTogglePanier] = useState(false);
    const [numberOfProduct, setNumberOfProduct] = useState(0);
    const [totalPriceOfProduct, setTotalPriceOfProduct] = useState(0);
    
    const btnShoopingCartRef = useRef(null);
    const modalShoppingCart = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (modalShoppingCart.current && 
                !modalShoppingCart.current.contains(event.target) &&
                btnShoopingCartRef.current &&
                !btnShoopingCartRef.current.contains(event.target) )  {
                    setTogglePanier(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if(store.panier !== null && Object.entries(store.panier).length > 0){
            getProductPanier();
        }
    }, [store]);

    const getProductPanier = () => {
        fire
        .firestore()
        .collection('Boutique')
        .onSnapshot((querySnapshot) => {
            let productDB = [];
            querySnapshot.forEach((doc) => {
                if(store.panier.hasOwnProperty(doc.id)){
                    Object.keys(store.panier[doc.id]).forEach( key => {
                        let data = {
                            ...doc.data(), 
                            id : doc.id,
                            count : store.panier[doc.id][key].count,
                            ref : key
                        }
                        productDB.push(data);
                    })
                }
            });
            let numberProduct = 0;
            let total = 0;
            productDB.forEach(element => {
                numberProduct = numberProduct + element.count;
                total = total + (element.count * element.listOptionsBuy[element.ref]*1);
                total = Math.round((total + Number.EPSILON) * 100) / 100;
            });
            setTotalPriceOfProduct(total);
            setNumberOfProduct(numberProduct);
        })
    }

    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <meta
                name="description"
                content="Learn how to build a personal website using Next.js"
                />
                <meta
                property="og:image"
                content={`https://og-image.now.sh/${encodeURI(
                    siteTitle
                )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
                />
                <meta name="og:title" content={siteTitle} />
                <meta name="twitter:card" content="summary_large_image" />
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,400;0,600;0,800;1,100;1,400&display=swap');
                </style>
            </Head>


                    
            <div className={styles.heigthMax}>  
                
               <div className={`${styles.navbarLayout}`}>
                    <div className={`${styles.navbarLeft}`}>
                        <Link href="/">
                            <div className={`${styles.row}`}>
                                <img
                                    src="/images/LogoNoName.svg"
                                    alt={logoName}
                                />
                                <div className={`${styles.title}`}>
                                    <h1>Nom de la boutique !</h1>
                                    <span>Bienvenue</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                    
                    <div className={`${styles.navbarRight}`}>
                        { !isMobile && (
                            <a className={`${styles.btnShoppingCart}`} type="button" ref={btnShoopingCartRef} href="#" onClick={() => setTogglePanier(!togglePanier)}>
                                <img src="/images/icons/shopping-cart.svg"></img>
                                {numberOfProduct > 0 && 
                                    <div>
                                        <p><span>{numberOfProduct}</span><span>{numberOfProduct > 1 ? "articles" : "article"}</span></p>
                                        <p><span>{totalPriceOfProduct}</span><span>€</span></p>
                                    </div>
                                }
                            </a>
                        )}
                        <div className={`${styles.row}`}>
                            <a type="button" href="https://www.google.com/maps/dir//4+Rue+Jean-Baptiste+Fayolle,+69290+Craponne" target="_blank">
                                <img className={`${styles.btnNavBar} ${styles.todo}`} src="/images/icons/pin.svg"></img>
                            </a>
                            <Link href="/backoffice/dashboard/dashboard">
                                <a type="button"  href="#">
                                    <img className={`${styles.btnNavBar}`} src="/images/icons/account.svg"></img>
                                </a>
                            </Link>
                        </div>
                    </div>
                </div> 

                { numberOfProduct > 0 && isMobile &&

                    <a className={`${styles.btnShoppingCart} ${styles.blockShoppingCart}`} type="button" ref={btnShoopingCartRef} href="#" onClick={() => setTogglePanier(!togglePanier)}>
                        <img src="/images/icons/shopping-cart.svg"></img>
                        <div>
                            <p><span>{numberOfProduct}</span><span>{numberOfProduct > 1 ? "articles" : "article"}</span></p>
                            <p><span>{totalPriceOfProduct}</span><span>€</span></p>
                        </div>
                        <p className={`${styles.text}`}>voir mon panier</p>
                    </a>
                } 





                {/* <div className={`${styles.navLayout}`}>
                    <div className={`${styles.navLeft}`}>
                        <div className={`${styles.navLogo}`}>
                            <Link href="/">
                                <a>
                                    <img
                                        src="/images/LogoNoName.svg"
                                        alt={logoName}
                                    />
                                </a>
                            </Link>
                        </div>
                        <div className={`${styles.blockActionToggle} ${styles.navMobile}`}>
                            <input type="checkbox" className={styles.actionToggle} />
                            <div className={styles.blockImgActionToggle}>
                                <div className={styles.imageActionToggle}></div>
                            </div>
                            <nav className={`${styles.navMenu}`}>
                                <ul className={`${styles.menuLayout}`}>
                                    <li>
                                    <Link href="/">
                                        <a>Accueil</a>
                                    </Link>
                                </li>
                                    <li>
                                        <Link href="/boutiqueClient/boutique">
                                            <a>Boutique</a>
                                        </Link>
                                    </li>
                                    
                                    <li><a href="#Contact">Contact</a></li>
                                
                                </ul>
                            </nav>
                        </div>

                        <nav className={`${styles.navDesktop}`}>
                            <ul>
                                <li>
                                    <Link href="/">
                                        <a>Accueil</a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/boutiqueClient/boutique">
                                        <a>Boutique</a>
                                    </Link>
                                </li>
                                <li><a href="#Contact">Contact</a></li>
                            </ul>
                        </nav>
                        
                    </div>
                    <div className={styles.navRight}>
                        {!user 
                            ?
                            <Link href="/backoffice/dashboard/dashboard">
                                    <a type="button"  href="#"><img className={`${utilStyles.svgWhite}`} src="/images/person.svg"></img></a>
                            </Link>
                            :
                            <Link href="/backoffice/dashboard/dashboard">
                                    <a type="button"  href="#"><img className={`${utilStyles.svgWhite}`} src="/images/person.svg"></img></a>
                            </Link>
                        }  
                        <a type="button" ref={btnShoopingCartRef} href="#" onClick={() => setTogglePanier(!togglePanier)}>
                            <img className={`${utilStyles.svgWhite}`} src="/images/shopping_bag.svg"></img>
                        </a>   
                    </div>
                </div> */}
                
                {backOffice && (
                    <main className={`${styles.container} ${styles.containerBO}`}>{children}</main>
                )}
                {!backOffice && (
                    <main className={styles.container}>{children}</main>
                )}

            
                {backOffice && user && (
                    <div className={styles.navBackOffice}>
                        {user.admin && (
                            <>
                                <Link href="/backoffice/category/gestionCategories">
                                    <div className={styles.itemsNav}>
                                        <img src="/images/icons/category-white.svg"/>
                                    </div>
                                    
                                </Link>
                                <Link href="/backoffice/boutique/gestionBoutique">
                                    <div className={styles.itemsNav}>
                                        <img src="/images/icons/store-white.svg"/>
                                    </div>
                                </Link>
                                <Link href="/backoffice/agenda/gestionAgenda">
                                    <div className={styles.itemsNav}>
                                        <img src="/images/icons/today-black.svg"/>
                                    </div>
                                </Link>
                            </>
                        )}
                        <Link href="/backoffice/order/orders">
                            <div className={styles.itemsNav}>
                                <img src="/images/icons/order-box.svg"/>
                            </div>
                        </Link>
                        <Link href="/backoffice/history/historyOrder">
                            <div className={styles.itemsNav}>
                                <img src="/images/icons/order-box-history.svg"/>
                            </div>
                        </Link>
                        <Link href="/users/profil">
                            <div className={styles.itemsNav}>
                                <img src="/images/icons/manage_accounts-black.svg"/>
                            </div>
                        </Link>
                        
                    </div>
                )}

                {togglePanier &&
                    <div ref={modalShoppingCart}>
                        <ShoppingCartModal/>
                    </div>
            
                }
            </div>
        </>
    )
}