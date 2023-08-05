import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listOrders } from "../actions/orderActions";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import OrderPDF from "../components/OrderPDF";

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

  // Define columns for the data grid
  const columns = [
    { field: "id", headerName: t("id"), width: 200 },
    {
      field: "user",
      headerName: t("user_"),
      width: 200,
      valueGetter: (params) => params.row.user?.name || "",
    },
    {
      field: "date",
      headerName: t("date"),
      width: 150,
      valueGetter: (params) => params.row.createdAt?.substring(0, 10) || "",
    },
    {
      field: "total",
      headerName: t("total"),
      width: 150,
      valueGetter: (params) => `$${params.row.totalPrice || ""}`,
    },
    {
      field: "paid",
      headerName: t("paid"),
      width: 150,
      valueGetter: (params) =>
        params.row.isPaid
          ? params.row.paidAt?.substring(0, 10) || ""
          : t("not-paid"),
      align: "center",
    },
    {
      field: "delivered",
      headerName: t("delivered"),
      width: 150,
      valueGetter: (params) =>
        params.row.isDelivered
          ? params.row.deliveredAt?.substring(0, 10) || ""
          : t("not-delivered"),
      align: "center",
    },
    {
      field: "details",
      headerName: t("details"),
      width: 150,
      renderCell: (params) => (
        <LinkContainer to={`/order/${params.row.id}`}>
          <Button variant="info" size="small">
            {t("details")}
          </Button>
        </LinkContainer>
      ),
    },
  ];

  // Create rows data for the data grid
  const rows = orders?.map((order) => ({
    id: order._id,
    user: order.user,
    createdAt: order.createdAt,
    totalPrice: order.totalPrice,
    isPaid: order.isPaid,
    paidAt: order.paidAt,
    isDelivered: order.isDelivered,
    deliveredAt: order.deliveredAt,
  }));

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
      <Row className="my-2">
        <Col md={4}>
          <OrderPDF orders={orders} />
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            autoHeight
            disableColumnFilter={false}
            disableColumnMenu={false}
            disableColumnSelector={false}
            density="standard"
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </div>
      )}
    </>
  );
};

export default OrderListPage;
