import { useState, useEffect } from "react";
import Product from "../components/Product";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const SuggestedProduct = ({ data, products }) => {
  const { t } = useTranslation();
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (products && data && data.category) {
      const match = products.filter(
        (p) => p.category === data.category && p._id !== data._id
      );
      setRelatedProducts(match);
    }
  }, [data, products]);
  return (
    <>
      {products.length > 0 && (
        <Row className="align-items-center mt-4">
          <Col>
            <h1>{t("related-products")}</h1>
          </Col>
        </Row>
      )}
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
