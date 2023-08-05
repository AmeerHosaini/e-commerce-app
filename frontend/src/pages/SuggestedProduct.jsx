import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";

const SuggestedProduct = ({ data }) => {
  const productList = useSelector((state) => state.productList);
  const { products } = productList;

  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const match =
      products && products.filter((p) => p.category === data.category);
    setRelatedProducts(match);
  }, [products, data.category]);

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Related Products</h1>
        </Col>
      </Row>
      <Row>
        {relatedProducts.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default SuggestedProduct;
