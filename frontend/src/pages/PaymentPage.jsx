import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../actions/cartAction";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  // We want this, because we would want to redirect if there is no shipping address
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const { t } = useTranslation();

  const navigate = useNavigate();

  if (!shippingAddress) {
    // @TODO: fix the route later on
    navigate("/login/shipping");
  }

  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>{t("payment-method")}</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">{t("select-method")}</Form.Label>
        </Form.Group>
        <Col className="my-3">
          <Form.Check
            type="radio"
            label={t("payment-label")}
            id="PayPal"
            name="paymentMethod"
            value="PayPal"
            onChange={(e) => setPaymentMethod(e.target.value)}
          ></Form.Check>
          <Form.Check
            type="radio"
            label={t("cash-on-delivery")}
            id="cashOnDelivery"
            name="paymentMethod"
            value="cashOnDelivery"
            onChange={(e) => setPaymentMethod(e.target.value)}
          ></Form.Check>
        </Col>
        <Button className="mt-3" type="submit" variant="primary">
          {t("continue")}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentPage;
