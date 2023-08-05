import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../actions/cartAction";

const ShippingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate(`/payment`);
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>{t("shipping")}</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <Form.Label>{t("shipping-address")}</Form.Label>
          <Form.Control
            type="text"
            placeholder={t("enter-address")}
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="city">
          <Form.Label className="mt-2">{t("city")}</Form.Label>
          <Form.Control
            type="text"
            placeholder={t("enter-city")}
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="postalCode">
          <Form.Label className="mt-2">{t("postal-code")}</Form.Label>
          <Form.Control
            type="text"
            placeholder={t("enter-postal-code")}
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="country">
          <Form.Label className="mt-2">{t("country")}</Form.Label>
          <Form.Control
            type="text"
            placeholder={t("enter-country")}
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button className="mt-3" type="submit" variant="info">
          {t("continue")}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingPage;

// We want to save our shipping address by filling out a form and submit it
// We want to have an action that adds the shipping address to the cart part of state and local storage
