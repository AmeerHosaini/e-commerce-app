import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Rating from "../components/Rating";

const Product = ({ product }) => {
  const { _id, image, name, rating, numReviews, price, name_fa } = product;

  const changeLang = useSelector((state) => state.changeLang);
  const { lang } = changeLang;

  const { t } = useTranslation();

  return (
    <Card className="my-3 p-2 rounded home-product shadow">
      <Link to={`/product/${_id}`}>
        <Card.Img src={image} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`/product/${_id}`}>
          <Card.Title as="div">
            <strong>{lang === "en" ? name : name_fa}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <div className="my-3">
            <Rating value={rating} text={`${numReviews} ${t("reviews")}`} />
          </div>
        </Card.Text>

        <Card.Text as="h3">${price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
