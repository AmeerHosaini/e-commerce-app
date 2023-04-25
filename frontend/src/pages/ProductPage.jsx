import { useTranslation } from "react-i18next";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  ListGroupItem,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listProductDetails, createReview } from "../actions/productAction";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";

const Products = () => {
  // console.log(params.id);
  // We will fetch it from the backend
  // const product = products.find((product) => product._id === params.id);
  // const [product, setProduct] = useState({});

  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const inStock = `${t("in-stock")}`;
  const outOfStock = `${t("out-stock")}`;
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productCreateReview = useSelector((state) => state.productCreateReview);
  const { success: successProductReview, error: errorProductReview } =
    productCreateReview;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userGoogleLogin = useSelector((state) => state.userGoogleLogin);
  const { userInfo: userGoogleInfo } = userGoogleLogin;

  const changeLang = useSelector((state) => state.changeLang);
  const { lang } = changeLang;

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (successProductReview) {
      alert("Review Submitted");
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(id));
  }, [dispatch, id, successProductReview]);

  console.log(...Array(product.countInStock).keys());

  const addToCartHandler = () => {
    // we want to go to the cart page
    // We want to have some parameters - id, quantity as a query string
    navigate(`/cart/${id}?quantity=${quantity}`);
  };

  // submit a review
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createReview(id, { rating, comment }));
  };

  return (
    <>
      <Link className="btn btn-dark my-3 rounded" to="/">
        {t("go-back")}
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush" className="card">
                <ListGroupItem>
                  <h3>{lang === "en" ? product.name : product.name_fa}</h3>
                </ListGroupItem>
                <ListGroupItem>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} ${t("reviews")}`}
                  />
                </ListGroupItem>
                <ListGroupItem>
                  {t("price_")}: ${product.price}
                </ListGroupItem>
                <ListGroupItem>
                  {t("description")}: {""}
                  <br />
                  {lang === "en" ? product.description : product.description_fa}
                </ListGroupItem>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroupItem>
                    <Row>
                      <Col>{t("price_")}:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem>
                    <Row>
                      <Col>{t("status")}:</Col>
                      <Col>
                        {product.countInStock > 0 ? inStock : outOfStock}
                      </Col>
                    </Row>
                  </ListGroupItem>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col className="my-2">{t("qty")}:</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (key) => (
                                <option key={key + 1} value={key + 1}>
                                  {key + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroupItem>
                    <Row>
                      <Button
                        onClick={addToCartHandler}
                        className="btn-block"
                        type="button"
                        disabled={product.countInStock === 0}
                      >
                        {t("add-to-cart")}
                      </Button>
                    </Row>
                  </ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mt-3">
              <h2>{t("reviews")}</h2>
              {product.reviews.length === 0 && (
                <Message>{t("no-reviews")}</Message>
              )}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>{t("post-review")}</h2>
                  {errorProductReview && (
                    <Message variant="danger">{errorProductReview}</Message>
                  )}
                  {userInfo || userGoogleInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>{t("rating")}</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">{t("select")}</option>
                          <option value="1">{t("poor")}</option>
                          <option value="2">{t("fair")}</option>
                          <option value="3">{t("good")}</option>
                          <option value="4">{t("very-good")}</option>
                          <option value="5">{t("excellent")}</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment" className="my-3">
                        <Form.Label>{t("comment")}</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button type="submit" variant="primary">
                        {t("post")}
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      {t("please")}{" "}
                      <Link className="login-link" to="/login">
                        {t("sign-in_")}
                      </Link>{" "}
                      {t("to-post-review")}
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
export default Products;
