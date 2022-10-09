import { Link, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  ListGroupItem,
} from "react-bootstrap";
import Rating from "../components/Rating";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listProductDetails } from "../actions/productAction";
import Loader from "../components/Loader";
import Message from "../components/Message";

const Products = () => {
  // console.log(params.id);
  // We will fetch it from the backend
  // const product = products.find((product) => product._id === params.id);
  // const [product, setProduct] = useState({});

  const dispatch = useDispatch();
  const params = useParams();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  useEffect(() => {
    dispatch(listProductDetails(params.productID));
  }, [dispatch, params.productID]);

  return (
    <>
      <Link className="btn btn-dark my-3 rounded" to="/">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroupItem>
                <h3>{product.name}</h3>
              </ListGroupItem>
              <ListGroupItem>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </ListGroupItem>
              <ListGroupItem>Price: ${product.price}</ListGroupItem>
              <ListGroupItem>Description: {product.description}</ListGroupItem>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroupItem>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroupItem>
                <ListGroupItem>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                    </Col>
                  </Row>
                </ListGroupItem>
                <ListGroupItem>
                  <Row>
                    <Button
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                    >
                      Add To Cart
                    </Button>
                  </Row>
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};
export default Products;