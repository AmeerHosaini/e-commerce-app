import { Col, Row } from "react-bootstrap";
import Product from "../components/Product";
import { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState([]);

  // With this syntax we get a 404 error, because axios is looking at localhost:3000/api/products
  // If we had specified the localhost route, we would have gotten across domain error
  // We must set up proxy to look for localhost:5000 in the package.json
  // http:127.0.0.1 is the loopback (localhost)
  const getProducts = async () => {
    const { data } = await axios.get("/api/products");
    setProducts(data);
  };

  useEffect(() => {
    // const getProducts = async () => {
    //   const { data } = await axios.get("/api/products");
    //   setProducts(data);
    // }
    getProducts();
  }, []);

  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Home;
