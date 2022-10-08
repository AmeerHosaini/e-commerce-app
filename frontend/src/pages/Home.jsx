import { Col, Row } from "react-bootstrap";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productAction";
import ProductPage from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";

const Home = () => {
  /* const [products, setProducts] = useState([]);

  // With this syntax we get a 404 error, because axios is looking at localhost:3000/api/products
  // If we had specified the localhost route, we would have gotten across domain error
  // We must set up proxy to look for localhost:5000 in the package.json
  // http:127.0.0.1 is the loopback (localhost)
  // const getProducts = async () => {
  //   const { data } = await axios.get("/api/products");
  //   setProducts(data);
  // };

  // useEffect(() => {
  //   // const getProducts = async () => {
  //   //   const { data } = await axios.get("/api/products");
  //   //   setProducts(data);
  //   // }
  //   getProducts();
  // }, []);
  */

  // We are gonna make the get request through our action -- useSelector(uses a part of a state)
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  return (
    <>
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <ProductPage product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default Home;
