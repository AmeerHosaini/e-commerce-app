import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { listMyOrders } from "../actions/orderActions";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  // Check if user is not logged in. If user is not logged in, don't allow user to access the profile page
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userGoogleLogin = useSelector((state) => state.userGoogleLogin);
  const { userInfo: userGoogleInfo } = userGoogleLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

  // // Loop through each order
  // const orderName = orders.forEach((order) => {
  //   // Loop through the 'orderItems' array of each order
  //   order.orderItems.forEach((item) => {
  //     // Access the 'name' property of each item
  //     const itemName = item.name;
  //   });
  // });

  useEffect(() => {
    if (!userInfo || !userGoogleInfo) {
      navigate("/login");
    } else {
      // if we don't have user
      if (!user.name) {
        dispatch(getUserDetails("profile"));
        dispatch(listMyOrders());
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [dispatch, navigate, userInfo, user, userGoogleInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage(t("passwords-do-not-match"));
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
    }
  };

  // Define columns for the data grid
  const columns = [
    { field: "id", headerName: t("id"), width: 200 },
    { field: "orderItems", headerName: t("name"), width: 200 },
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
    orderItems: order.orderItems.map((item) => item.name).join(", "),
    createdAt: order.createdAt,
    totalPrice: order.totalPrice,
    isPaid: order.isPaid,
    paidAt: order.paidAt,
    isDelivered: order.isDelivered,
    deliveredAt: order.deliveredAt,
  }));

  return (
    <Row>
      <Col md={3}>
        <h2>{t("user-profile")}</h2>
        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {success && <Message variant="success">{t("profile-updated")}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>{t("name")}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t("enter-name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label className="mt-2">{t("email-address")}</Form.Label>
            <Form.Control
              type="email"
              placeholder={t("enter-email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label className="mt-2">{t("password")}</Form.Label>
            <Form.Control
              type="password"
              placeholder={t("enter-password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label className="mt-2">{t("confirm")}</Form.Label>
            <Form.Control
              type="password"
              placeholder={t("confirm-password")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button className="mt-3" type="submit" variant="info">
            {t("update-profile")}
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>{t("my-orders")}</h2>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant="danger">{errorOrders}</Message>
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
      </Col>
    </Row>
  );
};

export default ProfilePage;
