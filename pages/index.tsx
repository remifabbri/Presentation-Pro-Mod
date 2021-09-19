import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.scss'
import WelcomShop from "../components/frontoffice/welcomShop/welcomShop-comp"; 

export default function Home() {

  

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
        <section className={utilStyles.headingMd}>
          <h2>Présentation</h2>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin et mollis erat. Morbi vel mi vel tellus ullamcorper rhoncus sed vel augue. Duis leo lectus, tempus luctus hendrerit non, condimentum in odio. Nullam dignissim eu est eget bibendum. Nulla facilisi. Nam euismod felis sit amet ex mollis pretium. 
          </p>
        </section>

        <section className={utilStyles.headingMd}>
          <h2>Notre boutique</h2>

          <WelcomShop/>

        </section>
    </Layout>
  )
}