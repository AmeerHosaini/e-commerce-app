import { useTranslation } from "react-i18next";
import axios from "axios";
import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { listProductDetails, updateProduct } from "../actions/productAction";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";

const ProductEditPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [name_fa, setName_fa] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [brand_fa, setBrand_fa] = useState("");
  const [category, setCategory] = useState("");
  const [category_fa, setCategory_fa] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [description_fa, setDescription_fa] = useState("");
  const [uploading, setUploading] = useState(false);

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate("/admin/productList");
    } else {
      // if fields are empty
      if (!product.name || product._id !== id) {
        dispatch(listProductDetails(id));
      } else {
        setName(product.name);
        setName_fa(product.name_fa);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setBrand_fa(product.brand_fa);
        setCategory(product.category);
        setCategory_fa(product.category_fa);
        setCountInStock(product.setCountInStock);
        setDescription(product.description);
        setDescription_fa(product.description_fa);
      }
    }
  }, [dispatch, product, id, navigate, successUpdate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post("/api/upload", formData, config);

      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: id,
        name,
        name_fa,
        price,
        brand,
        brand_fa,
        image,
        category,
        category_fa,
        description,
        description_fa,
        countInStock,
      })
    );
  };

  return (
    <>
      <Link to="/admin/productList" className="btn btn-primary my-3">
        {t("go-back")}
      </Link>
      <h1>{t("edit-product")}</h1>
      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
      <FormContainer>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="name_fa" className="my-3">
              <Form.Label>نام به فارسی</Form.Label>
              <Form.Control
                type="text"
                value={name_fa}
                onChange={(e) => setName_fa(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price" className="my-3">
              <Form.Label>{t("price_")}</Form.Label>
              <Form.Control
                type="number"
                placeholder={t("enter-price")}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image" className="my-3">
              <Form.Label>{t("image")}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t("enter-image")}
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Group controlId="image-file" className="mb-3">
                <Form.Control type="file" onChange={uploadFileHandler} />
              </Form.Group>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId="brand" className="my-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="brand_fa">
              <Form.Label>نام تجاری - Brand</Form.Label>
              <Form.Control
                type="text"
                value={brand_fa}
                onChange={(e) => setBrand_fa(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock" className="my-3">
              <Form.Label>{t("count-in-stock")}</Form.Label>
              <Form.Control
                type="number"
                placeholder={t("enter-count-in-stock")}
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category" className="my-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category_fa">
              <Form.Label>کتگوری</Form.Label>
              <Form.Control
                type="text"
                value={category_fa}
                onChange={(e) => setCategory_fa(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description" className="my-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description_fa">
              <Form.Label>توضیحات</Form.Label>
              <Form.Control
                type="text"
                value={description_fa}
                onChange={(e) => setDescription_fa(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" className="my-3">
              {t("update-product")}
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditPage;
