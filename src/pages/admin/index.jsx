import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import Image from "next/image";
import styles from "../../../styles/Admin.module.css";
import EditProduct from "../../components/EditProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faEdit,
  faTrash,
  faArrowRight,
  faMapMarker,
  faExternalLinkAlt,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

const Index = ({ orders, products }) => {
  const [productList, setProductList] = useState(products);
  const [orderList, setOrderList] = useState(orders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProducts, setShowProducts] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // Nuevo estado de carga
  const status = ["En preparación", "En camino", "Entregado", "Finalizado"];
  const router = useRouter();

  useEffect(() => {
    // Verifica si el token está presente en las cookies
    const authToken = Cookies.get('authToken');

    if (!authToken) {
      // Si no hay token, redirige al usuario a la página de inicio de sesión
      router.push('/admin/login');
    } else {
      // Cuando haya un token, establece isLoading en falso
      setIsLoading(false);
    }
  }, []);
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        "https://mercadocarnes-backend.onrender.com/api/products/" + id
      );
      setProductList(productList.filter((product) => product._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      const response = await axios.delete(`https://mercadocarnes-backend.onrender.com/api/orders/${id}`);
    
      // Verificar si la solicitud DELETE fue exitosa
      if (response.status === 200) {
        // Filtrar la lista de pedidos para eliminar el pedido con el ID especificado
        const updatedOrderList = orderList.filter((order) => order._id !== id);
    
        setOrderList(updatedOrderList);
      } else {
        // Manejar posibles errores
        console.error('Error al eliminar el pedido:', response.data);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud DELETE:', error);
    }
  };
  
  

  const handleStatus = async (id) => {
    const item = orderList.find((order) => order._id === id);
    const currentStatus = item.status;

    try {
      const res = await axios.put(`https://mercadocarnes-backend.onrender.com/api/orders/${id}`, {
        
        status: currentStatus + 1,
      });
      setOrderList((prevOrderList) => {
        const updatedOrderList = prevOrderList.map((order) =>
          order._id === id ? res.data : order
        );
        return updatedOrderList;
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container1}>
      <div className={styles.buttons}>
        <button
          className={`${styles.button} ${showProducts ? styles.active : ""}`}
          onClick={() => setShowProducts(true)}
        >
          Ver Productos
        </button>
        <button
          className={`${styles.button} ${!showProducts ? styles.active : ""}`}
          onClick={() => setShowProducts(false)}
        >
          Ver Ordenes
        </button>
      </div>
      <div className={styles.container}>
        {showProducts ? (
          <div className={styles.item}>
            {/* <h1 className={styles.title}>Products</h1> */}
            <table className={styles.table}>
              <tbody>
                <tr className={styles.trTitle}>
                  <th>Imagen</th>
                  <th>Id</th>
                  <th>Título</th>
                  <th>Precio</th>
                  <th>Acción</th>
                </tr>
              </tbody>
              {productList.map((product) => (
                <tbody key={product._id}>
                  <tr className={styles.trTitle}>
                    <td>
                      <Image
                        src={product.img}
                        width={50}
                        height={50}
                        objectFit="cover"
                        alt=""
                      />
                    </td>
                    <td> {product._id.slice(-12)} </td>
                    <td>{product.title}</td>
                    <td>${product.price}</td>
                    <td>
                      <button
                        className={styles.button}
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsModalOpen(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} /> Editar
                      </button>
                      <button
                        className={styles.button2}
                        onClick={() => handleDelete(product._id)}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Borrar
                      </button>
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        ) : (
          <div className={styles.item}>
            {/* <h1 className={styles.title}>Orders</h1> */}
            <table className={styles.table}>
              <tbody>
                <tr className={styles.trTitle}>
                  <th>Id</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Pago</th>
                  <th>Instrucciones</th>
                  <th>Dirección</th>
                  <th>Número de tel.</th>
                  <th>Entrega Estimada</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </tbody>
              {orderList.map((order) => (
                <tbody key={order._id}>
                  <tr className={styles.trTitle}>
                    <td> {order._id.slice(-5)} </td>
                    <td>{order.customer}</td>
                    <td>${order.total}</td>
                    <td>
                      {order.method === 0 ? (
                        <span>cash</span>
                      ) : (
                        <span>paid</span>
                      )}
                    </td>
                    <td>{order.instructions}</td>
                    <td>
                      <a
                        href={`https://www.google.com/maps/search/${encodeURIComponent(
                          order.address
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {order.address}{" "}
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                      </a>
                    </td>
                    <td>
                      {" "}
                      {order.phoneNumber}{" "}
                      <a
                        href={`https://api.whatsapp.com/send?phone=${order.phoneNumber}&text=¡Gracias por tu compra!`}
                        target="_blank"
                      >
                        <FontAwesomeIcon icon={faEnvelope} />{" "}
                      </a>
                      <a href={`tel:${order.phoneNumber}`}>
                        <FontAwesomeIcon icon={faPhone} />
                      </a>
                    </td>
                    <td>
                      {order.deliveryTime
                        ? new Date(order.deliveryTime).toLocaleTimeString(
                            "es-AR",
                            {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            }
                          )
                        : ""}
                    </td>
                    <td>{status[order.status]}</td>
                    <td>
                      <button
                        className={styles.buttonntx}
                        onClick={() => handleStatus(order._id)}
                      >
                        <FontAwesomeIcon icon={faArrowRight} /> {/*Avanzar*/} 
                      </button>
                      <button
                        className={styles.button1}
                        onClick={() => handleDeleteOrder(order._id)}
                      >
                         <FontAwesomeIcon icon={faTrash} /> {/*Borrar */}
                      </button>
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        )}

        {isModalOpen && (
          <EditProduct
            product={selectedProduct}
            onClose={() => setIsModalOpen(false)}
            onUpdate={(updatedProduct) => {
              const updatedProductIndex = productList.findIndex(
                (product) => product._id === updatedProduct._id
              );

              if (updatedProductIndex !== -1) {
                const updatedProductList = [...productList];
                updatedProductList[updatedProductIndex] = updatedProduct;
                setProductList(updatedProductList);
              }

              setIsModalOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const myCookie = ctx.req?.cookies || "";
  console.log("Token en getServerSideProps:", myCookie.token);

  if (myCookie.token !== process.env.TOKEN) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  const productRes = await axios.get("https://mercadocarnes-backend.onrender.com/api/products");
  const orderRes = await axios.get("https://mercadocarnes-backend.onrender.com/api/orders");

  return {
    props: {
      orders: orderRes.data,
      products: productRes.data,
    },
  };
};

export default Index;
