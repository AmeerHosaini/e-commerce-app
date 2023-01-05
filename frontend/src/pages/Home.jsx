import { Button, Col, Row } from "react-bootstrap";
import {
  Grid,
  Paper,
  styled,
  Typography,
  Box,
  Container,
  Slider,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productAction";
import { useParams, Link } from "react-router-dom";
import Meta from "../components/Meta";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/paginate";
import ProductCarousel from "../components/ProductCarousel";

const StyledPaper = styled(Paper, {
  name: "StyledPaper",
  slot: "Wrapper",
})({
  margin: "2rem 0",
  padding: "1rem",
});

const Filters = styled(Box, {
  name: "Filters",
  slot: "Wrapper",
})({
  padding: "0 1.5rem",
});

const PriceInputs = styled(Box, {
  name: "PriceInputs",
  slot: "Wrapper",
})({
  display: "flex",
  justifyContent: "space-between",
});

const StyledContainer = styled(Container, {
  name: "StyledContainer",
  slot: "Wrapper",
})({
  marginTop: 20,
});

const Home = () => {
  /* const [products, setProducts] = useState([]);

  // With this syntax we get a 404 error, because axios is looking at localhost:3000/api/products
  // If we had specified the localhost route, we would have gotten across domain error
  // We must set up proxy to look for localhost:5000 in the package.json
  // http:127.0.0.1 is the loopback (localhost)
  // const getProducts = async () => {
  //   const { data } = await axios.get("/api/products");
  //   setProducts(data);
  // };

  // useEffect(() => {
  //   // const getProducts = async () => {
  //   //   const { data } = await axios.get("/api/products");
  //   //   setProducts(data);
  //   // }
  //   getProducts();
  // }, []);
  */

  // We are gonna make the get request through our action -- useSelector(uses a part of a state)
  const dispatch = useDispatch();
  const { keyword } = useParams();

  // There is always one page if pageNumber not specified
  const { pageNumber } = useParams() || 1;

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, pages, page } = productList;

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <Meta />
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className={`btn btn-dark`}>
          Go Back
        </Link>
      )}
      {/* Filtering */}
      <StyledPaper>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>Filters</Typography>
            <Filters>
              <Slider
                min={0}
                max={1000}
                disabled={loading}
                valueLabelDisplay="auto"
              />
              <PriceInputs>
                <TextField
                  size="small"
                  id="lower"
                  label="Min price"
                  variant="outlined"
                  type="number"
                  disabled={loading}
                />
                <TextField
                  size="small"
                  id="upper"
                  label="Max price"
                  variant="outlined"
                  type="number"
                  disabled={loading}
                />
              </PriceInputs>
            </Filters>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>Sort By</Typography>
            <FormControl component="fieldset">
              <RadioGroup aria-label="price-order" name="price-order">
                <FormControlLabel
                  disabled={loading}
                  control={<Radio />}
                  value="descending"
                  label="Price: Highest - Lowest"
                />
                <FormControlLabel
                  disabled={loading}
                  control={<Radio />}
                  value="ascending"
                  label="Price: Lowest - Highest"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        <Button className="btn btn-dark">Clear All</Button>
      </StyledPaper>
      <h1 className={`mt-3`}>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default Home;
