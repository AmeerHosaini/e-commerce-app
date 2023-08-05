import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
  paidCashOnDelivery,
} from "../actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
  ORDER_DELIVER_PAY_RESET,
} from "../constants/orderConstant";

const OrderDetailsPage = () => {
  const [sdkReady, setSdkReady] = useState(false);
  const { t } = useTranslation();

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, order, error } = orderDetails;

  console.log(order);

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderPayCashOnDelivery = useSelector(
    (state) => state.orderPayCashOnDelivery
  );
  const { loading: loadingCashOnDelivery, success: successCashOnDelivery } =
    orderPayCashOnDelivery;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  if (!loading) {
    const addDecimals = (number) => {
      return (Math.round(number * 100) / 100).toFixed(2);
    };
    // Calculate Prices
    order.itemsPrice = addDecimals(
      order.orderItems.reduce(
        (acc, currentItem) => acc + currentItem.price * currentItem.quantity,
        0
      )
    ); // 0 is the start of the accumulator
  }

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    const addPaypalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!order || successPay || successDeliver || successCashOnDelivery) {
      // We dont want to run into a non-ending loop from this useEffect - Once you pay, it will keep refreshing if you dont dispatch this
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch({ type: ORDER_DELIVER_PAY_RESET });
      // This will load the order again but paid this time
      // Or load the order even when it's not paid
      // After payment is done successfully, orderPage will refresh and Paid message turns green
      dispatch(getOrderDetails(id));
    } else if (!order.isPaid && order?.paymentMethod === "PayPal") {
      if (!window.paypal) {
        addPaypalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [
    dispatch,
    id,
    successPay,
    order,
    successDeliver,
    userInfo,
    navigate,
    successCashOnDelivery,
  ]);

  // Success Payment Handler
  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    // This will update the database to paid
    dispatch(payOrder(id, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  const updateToPaidOnDelivery = () => {
    dispatch(paidCashOnDelivery(order));
  };

  // if it's loading, show loader. else if there is an error
  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>
        {t("order")} {order._id}
      </h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>{t("shipping")}</h2>
              <p>
                <strong>{t("shipping-name")} </strong> {order.user.name}
              </p>
              <p>
                <strong>{t("shipping-email")} </strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>{t("shipping-address")} </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  {t("shipping-delivered")} {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">{t("not-delivered")}</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>{t("payment-method")}</h2>
              <p>
                <strong>{t("method")}: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">
                  {t("paid-on")} {order.paidAt}
                </Message>
              ) : (
                <Message variant="danger">{t("not-paid")}</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>{t("order-items")}</h2>
              {order.orderItems.length === 0 ? (
                <Message>{t("empty-order")}</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((orderItem, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={orderItem.image}
                            alt={orderItem.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${orderItem.product}`}>
                            {orderItem.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {orderItem.quantity} x ${orderItem.price} = $
                          {orderItem.quantity * orderItem.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>{t("order-summary")}</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>{t("order-items_")}</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>{t("shipping")}</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>{t("tax")}</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>{t("total")}</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && order?.paymentMethod === "PayPal" && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      variant="info"
                      onClick={deliverHandler}
                    >
                      {t("mark-delivered")}
                    </Button>
                  </ListGroup.Item>
                )}
              {loadingCashOnDelivery && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                !order.isPaid &&
                order.paymentMethod === "cashOnDelivery" && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      variant="info"
                      className="btn btn-block"
                      onClick={updateToPaidOnDelivery}
                    >
                      Update to Paid
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderDetailsPage;
