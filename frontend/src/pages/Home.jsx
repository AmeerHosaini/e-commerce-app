import { Button, Col, Row } from "react-bootstrap";
import {
  Grid,
  Paper,
  styled,
  Typography,
  Box,
  Slider,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import Meta from "../components/Meta";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/paginate";
import ProductCarousel from "../components/ProductCarousel";
import axios from "axios";

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

const Home = () => {
  // We are gonna make the get request through our action -- useSelector(uses a part of a state)
  const navigate = useNavigate();
  const location = useLocation();
  const params = location.search ? location.search : null;
  const [sliderMax, setSliderMax] = useState(1000);
  // dots on the slider
  const [priceRange, setPriceRange] = useState([0, sliderMax]);
  // radio buttons
  const [priceOrder, setPriceOrder] = useState("descending");
  const [filter, setFilter] = useState("");
  const [sorting, setSorting] = useState("");

  const { keyword } = useParams();
  // There is always one page if pageNumber not specified
  const { pageNumber } = useParams() || 1;

  // component state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(null);
  const [pages, setPages] = useState(null);

  const updateUiValues = (uiValues) => {
    setSliderMax(uiValues.maxPrice);
    if (uiValues.filtering.price) {
      let priceFilter = uiValues.filtering.price;

      // it's the same as our url, it helps us to update our state.
      setPriceRange([Number(priceFilter.gte), Number(priceFilter.lte)]);
    }

    if (uiValues.sorting.price) {
      let priceSort = uiValues.sorting.price;
      setPriceOrder(priceSort);
    }
  };

  useEffect(() => {
    // Whenever the component refreshes twice or reloads twice due to the useEffect state change, we dont want to make 2 axios requests
    let cancel;
    const fetchData = async () => {
      setLoading(true);
      try {
        let query;
        // if there is something in search params (url)
        if (params && !filter) {
          query = params;
        } else {
          query = filter;
        }

        if (sorting) {
          if (query.length === 0) {
            query = `?sort=${sorting}`;
          } else {
            query = query + "&sort=" + sorting;
          }
        }

        if (keyword) {
          if (query.length === 0) {
            query = `?name=${keyword}`;
          } else {
            query = query + "&name=" + keyword;
          }
        }

        if (pageNumber) {
          if (query.length === 0) {
            query = `?pageNumber=${pageNumber}`;
          } else {
            query = query + "&pageNumber=" + pageNumber;
          }
        }

        const { data } = await axios({
          method: "GET",
          // no need for http because we have set up a proxy
          url: `/api/products${query}`,
          // cancel the first one and
          cancelToken: new axios.CancelToken((c) => (cancel = c)),
        });

        setProducts(data.products);
        setPage(data.page);
        setPages(data.pages);
        setLoading(false);
        updateUiValues(data.uiValues);
      } catch (error) {
        if (axios.isCancel(error)) return;
        // this is how axios shows the error
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
        setLoading(false);
      }
    };
    fetchData();
    // When we return a function, it gets run whenever our component dismounts
    // We want to return a function that calls cancel, not call the api twice
    return () => cancel();
  }, [filter, params, sorting, keyword, pageNumber]);
  // if our url params changes, we want to change our query

  // handlePriceInputChange
  const handlePriceInputChange = (e, type) => {
    let newRange;

    if (type === "lower") {
      newRange = [...priceRange];
      newRange[0] = Number(e.target.value);
      setPriceRange(newRange);
    }

    if (type === "upper") {
      newRange = [...priceRange];
      newRange[1] = Number(e.target.value);
      setPriceRange(newRange);
    }
  };

  // onSliderCommitHandler
  const onSliderCommitHandler = (e, newValue) => {
    // We want to refresh when this function is invoked
    buildRangeFilter(newValue);
  };

  // onTextFieldCommitHandler
  // Whenever we exit the text field, this will fire off
  const onTextFieldCommitHandler = () => {
    buildRangeFilter(priceRange);
  };

  // buildRangeFilter
  const buildRangeFilter = (newValue) => {
    // Redirect to save the old filter in the url and when we referesh the filter gets saved
    const urlFilter = `?price[gte]=${newValue[0]}&price[lte]=${newValue[1]}`;
    setFilter(urlFilter);
    // we want to redirect to match that state. when we refresh, we keep that filter state
    navigate(urlFilter);
  };

  // handleSortChange
  const handleSortChange = (e) => {
    setPriceOrder(e.target.value);

    if (e.target.value === "ascending") {
      setSorting("price");
    } else if (e.target.value === "descending") {
      setSorting("-price");
    }
  };

  // clear all filters
  const clearAllFilters = () => {
    setFilter("");
    setSorting("");
    setPriceRange([0, sliderMax]);
    navigate("/");
  };

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
      <StyledPaper className="mui-slider-bg">
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom className="mui-font">
              Filters
            </Typography>
            <Filters>
              <Slider
                min={0}
                max={sliderMax}
                value={priceRange}
                onChange={(e, newValue) => setPriceRange(newValue)}
                onChangeCommitted={onSliderCommitHandler}
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
                  value={priceRange[0]}
                  onChange={(e) => handlePriceInputChange(e, "lower")}
                  onBlur={onTextFieldCommitHandler}
                />
                <TextField
                  size="small"
                  id="upper"
                  label="Max price"
                  variant="outlined"
                  type="number"
                  disabled={loading}
                  value={priceRange[1]}
                  onChange={(e) => handlePriceInputChange(e, "upper")}
                  onBlur={onTextFieldCommitHandler}
                />
              </PriceInputs>
            </Filters>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom className="mui-font">
              Sort By
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="price-order"
                name="price-order"
                value={priceOrder}
                onChange={handleSortChange}
              >
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
        <Button className="btn btn-primary" onClick={clearAllFilters}>
          Clear All
        </Button>
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
