import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Image, Carousel } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { topProducts } from "../actions/productAction";

const ProductCarousel = () => {
  const dispatch = useDispatch();
  const productTopRated = useSelector((state) => state.productTopRated);
  const { loading, products, error } = productTopRated;

  const changeLang = useSelector((state) => state.changeLang);
  const { lang } = changeLang;

  useEffect(() => {
    dispatch(topProducts());
  }, [dispatch]);

  // if loading, show loader. else if error, show message, else create a carousel
  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Carousel pause="hover">
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />
            <Carousel.Caption className="carousel-caption">
              <h2>
                {lang === "en" ? product.name : product.name_fa} ($
                {product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;

// fluid stays in the container
// pause - on hover pauses
