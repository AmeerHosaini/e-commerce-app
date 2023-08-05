import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/paginate";
import {
  listProducts,
  deleteProduct,
  createProduct,
} from "../actions/productAction";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const ProductListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pageNumber } = useParams() || 1;

  const { t } = useTranslation();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, pages, page } = productList;

  console.log(page);

  // const totalValue = products
  //   ?.filter((product) => product.price)
  //   .reduce((total, product) => total + product.price, 0);
  const totalValue = products
    ?.filter((product) => product.countInStock > 0) // Filter products with countInStock greater than 0
    .reduce(
      (total, product) => total + product.price * product.countInStock,
      0
    );

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  /* Security Check - When we log out as admin, we will see the users list and if we reload, we get token null
    2. When we login as a user and manually hit /admin/userlist route, we will get a not an admin custom error
    we don't want even want the user to access that page
  */
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    // // if logged in and the logged in account is the admin
    // if (userInfo && userInfo.isAdmin) {
    //   dispatch(listProducts());
    // } else {
    //   navigate("/login");
    // }
    // When admin deletes a user, we want the page to refresh and show the remaining users
    if (!userInfo.isAdmin) {
      navigate("/login");
    }

    if (successCreate) {
      navigate(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts("", pageNumber));
    }
  }, [
    dispatch,
    navigate,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  const columns = [
    { field: "id", headerName: t("id"), width: 150 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "name_fa", headerName: "نام", width: 200 },
    { field: "price", headerName: t("price"), width: 150 },
    { field: "countInStock", headerName: t("count-in-stock"), width: 150 },
    { field: "category", headerName: "Category", width: 200 },
    { field: "category_fa", headerName: "کتگوری", width: 200 },
    { field: "brand", headerName: "Brand", width: 200 },
    { field: "brand_fa", headerName: "نام تجاری", width: 200 },
    {
      field: "actions",
      headerName: t("action"),
      width: 200,
      renderCell: (params) => (
        <>
          <LinkContainer to={`/admin/product/${params.row.id}/edit`}>
            <Button variant="info" className="w-100 btn-sm">
              <i className="fas fa-edit"></i>
            </Button>
          </LinkContainer>
          <Button
            variant="danger"
            className="w-100 btn-sm mt-2"
            onClick={() => deleteHandler(params.row.id)}
          >
            <i className="fas fa-trash"></i>
          </Button>
        </>
      ),
    },
  ];

  const rows = products?.map((product) => ({
    id: product._id,
    name: product.name,
    name_fa: product.name_fa,
    price: product.price,
    countInStock: product.countInStock,
    category: product.category,
    category_fa: product.category_fa,
    brand: product.brand,
    brand_fa: product.brand_fa,
  }));

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>{t("products")}</h1>
        </Col>
        <Row className="mb-4">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>{t("products")}</Card.Title>
                <Card.Text>{products?.length}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>{t("total-value")}</Card.Title>
                <Card.Text>${totalValue}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Col className="text-right">
          <Button
            className="my-3"
            variant="info"
            onClick={createProductHandler}
          >
            <i className="fas fa-plus"></i> {t("create-product")}
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
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
          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListPage;
