import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Head from "next/head";
import Featured from "../components/Featured";
import ProductList from "../components/ProductList";
import AddButton from "../components/AddButton";
import Add from "../components/Add";
import styles from "../../styles/Home.module.css";
import Cookies from 'js-cookie'; // Importa la librería de cookies

export default function Home({ productList }) {
  const router = useRouter();
  const [close, setClose] = useState(true);

  // Verifica si el token está presente en las cookies
  const authToken = Cookies.get('authToken');

  return (
    <div className={styles.container}>
      <Head>
        <title>Mercado de carnes premium </title>
        <meta name="description" content="La mejor carne de la ciudad." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Featured />
      {authToken && <AddButton setClose={setClose} />} {/* Muestra el botón solo si el token está presente en las cookies */}
      <ProductList productList={productList} />
      {!close && <Add setClose={setClose} />}
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const myCookie = ctx.req?.cookies || {};

  try {
    const res = await axios.get("https://mercadocarnes-backend.onrender.com/api/products");
    return {
      props: {
        productList: res.data,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/?initialLoadFailed=true",
        permanent: false,
      },
    };
  }
};
