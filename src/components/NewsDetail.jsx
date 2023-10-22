import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "../../styles/NewsDetail.module.css";

const NewsDetail = () => {
  const router = useRouter();
  const { id } = router.query; // Usamos query.id en lugar de query.newsId
  const [news, setNews] = useState(null);

  useEffect(() => {
    if (id) {
      fetchNewsDetail(id); // Usamos id en lugar de newsId
    }
  }, [id]);

  const fetchNewsDetail = async (id) => {
    try {
      const response = await axios.get(`https://mercadocarnes-backend.onrender.com/api/news/${id}`);
      setNews(response.data);
    } catch (error) {
      console.error("Error fetching news detail:", error);
    }
  };

  if (!news) {
    return <div>Cargando...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{news.title}</h1>
      <p className={styles.subtitle}>{news.subtitle}</p>
      <p className={styles.content}>{news.content}</p>
      {news.imageUrl && (
        <img src={news.imageUrl} alt={news.title} className={styles.image} />
      )}
    </div>
  );
};

export default NewsDetail;
