import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Row, Col, ListGroup, Image, Button, Form } from "react-bootstrap";
import { addToCart, removeFromCart } from "../actions/cartAction";

const CartPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const quantity = currentLocation.search
    ? Number(currentLocation.search.split("=")[1])
    : 1;

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  useEffect(() => {
    if (id) {
      dispatch(addToCart(id, quantity));
    }
  }, [dispatch, id, quantity]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    // if user wants to go to shipping and not logged in, redirect him to login page first
    navigate(`/login?redirect=shipping`);
  };

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your Cart is Empty{" "}
            <Link className="login-link" to="/">
              Go Back
            </Link>
          </Message>
        ) : (
          <ListGroup variant="flush" className="card">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}> ${item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.quantity}
                      onChange={(e) =>
                        dispatch(
                          addToCart(item.product, Number(e.target.value))
                        )
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((key) => (
                        <option key={key + 1} value={key + 1}>
                          {key + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <ListGroup variant="flush" className="card mt-5">
          <ListGroup.Item>
            <h2>
              Subtotal (
              {cartItems.reduce(
                (acc, currentItem) => acc + currentItem.quantity,
                0
              )}
              ) items
            </h2>
            $
            {cartItems
              .reduce(
                (acc, currentItem) =>
                  acc + currentItem.quantity * currentItem.price,
                0
              )
              .toFixed(2)}
          </ListGroup.Item>
          <ListGroup.Item>
            <Button
              type="button"
              className="btn-block"
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed To Checkout
            </Button>
          </ListGroup.Item>
        </ListGroup>
      </Col>
    </Row>
  );
};

export default CartPage;
