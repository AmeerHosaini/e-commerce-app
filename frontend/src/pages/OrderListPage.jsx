import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listOrders } from "../actions/orderActions";

const OrderListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  // create an array that meets these specifications
  const numOfPaidOrders = orders?.filter((order) => order.isPaid).length;
  const numOfNotPaidOrders = orders?.filter((order) => !order.isPaid).length;
  const numOfOrdersDelivered = orders?.filter(
    (order) => order.isDelivered
  ).length;
  const numOfOrdersNotDelivered = orders?.filter(
    (order) => !order.isDelivered
  ).length;
  const totalPaidPrice = orders
    ?.filter((order) => order.isPaid)
    .reduce((total, order) => total + order.totalPrice, 0);
  const totalUnpaidPrice = orders
    ?.filter((order) => !order.isPaid)
    .reduce((total, order) => total + order.totalPrice, 0);

  /* Security Check - When we log out as admin, we will see the users list and if we reload, we get token null
    2. When we login as a user and manually hit /admin/userlist route, we will get a not an admin custom error
    we don't want even want the user to access that page
  */
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    // if logged in and the logged in account is the admin
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      navigate("/login");
    }
    // When admin deletes a user, we want the page to refresh and show the remaining users
  }, [dispatch, navigate, userInfo]);

  return (
    <>
      <h1>{t("orders")}</h1>
      <Row className="mb-4">
        <Col md={2}>
          <Card>
            <Card.Body>
              <Card.Title>{t("orders")}</Card.Title>
              <Card.Text>{orders?.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card>
            <Card.Body>
              <Card.Title>{t("orders-not-paid")}</Card.Title>
              <Card.Text>{numOfNotPaidOrders}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card>
            <Card.Body>
              <Card.Title>{t("orders-paid")}</Card.Title>
              <Card.Text>{numOfPaidOrders}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card>
            <Card.Body>
              <Card.Title>{t("orders-not-delivered")}</Card.Title>
              <Card.Text>{numOfOrdersNotDelivered}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card>
            <Card.Body>
              <Card.Title>{t("orders-delivered")}</Card.Title>
              <Card.Text>{numOfOrdersDelivered}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card>
            <Card.Body>
              <Card.Title>{t("paid-total")}</Card.Title>
              <Card.Text>${totalPaidPrice}</Card.Text>
              <Card.Title>{t("not-paid-total")}</Card.Title>
              <Card.Text>${totalUnpaidPrice}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>{t("id")}</th>
              <th>{t("user_")}</th>
              <th>{t("date")}</th>
              <th>{t("total")}</th>
              <th>{t("paid")}</th>
              <th>{t("delivered")}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="primary" className="btn-sm">
                      {t("details")}
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListPage;
