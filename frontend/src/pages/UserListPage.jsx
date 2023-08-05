import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listUsers, deleteUser } from "../actions/userActions";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import * as React from "react";

const UserListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const numOfAdmins = users?.reduce(
    (count, user) => (user.isAdmin ? count + 1 : count),
    0
  );
  /* Security Check - When we log out as admin, we will see the users list and if we reload, we get token null
    2. When we login as a user and manually hit /admin/userlist route, we will get a not an admin custom error
    we don't want even want the user to access that page
  */
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  useEffect(() => {
    // if logged in and the logged in account is the admin
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers());
    } else {
      navigate("/login");
    }
    // When admin deletes a user, we want the page to refresh and show the remaining users
  }, [dispatch, navigate, userInfo, successDelete]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteUser(id));
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      renderCell: (params) => (
        <a href={`mailto:${params.value}`}>{params.value}</a>
      ),
    },
    {
      field: "isAdmin",
      headerName: "Admin",
      flex: 1,
      renderCell: (params) => (
        <React.Fragment>
          {params.value ? (
            <i className="fas fa-check" style={{ color: "green" }} />
          ) : (
            <i className="fas fa-times" style={{ color: "red" }} />
          )}
        </React.Fragment>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <React.Fragment>
          <LinkContainer to={`/admin/user/${params.row.id}/edit`}>
            <Button variant="info" size="small">
              <i className="fas fa-edit" />
            </Button>
          </LinkContainer>
          <Button
            variant="danger"
            size="small"
            onClick={() => deleteHandler(params.row.id)}
          >
            <i className="fas fa-trash" />
          </Button>
        </React.Fragment>
      ),
    },
  ];

  console.log(users);

  const rows = users?.map((user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  }));

  return (
    <>
      <h1>{t("users")}</h1>
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>{t("users")}</Card.Title>
              <Card.Text>{users?.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>{t("admins")}</Card.Title>
              <Card.Text>{numOfAdmins}</Card.Text>
            </Card.Body>
          </Card>
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

export default UserListPage;
