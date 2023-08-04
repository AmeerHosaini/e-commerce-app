import { useTranslation } from "react-i18next";
import { Form, Button, Card } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import Message from "../components/Message";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { t } = useTranslation();

  const submitHandler = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (!email) {
      setTimeout(() => {
        setError("");
      }, 5000);
      return setError(t("enter-email"));
    }

    try {
      const { data } = await axios.post(
        "/api/users/forgotpassword",
        { email },
        config
      );

      setSuccess(data.data);
    } catch (error) {
      setError(
        error.response && error.response.data.msg
          ? error.response.data.msg
          : error.msg
      );
      setEmail("");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow" style={{ width: "500px" }}>
        <Card.Body>
          <h1 className="text-center">{t("forgot-password")}</h1>
          <p className="text-center">{t("forgot-password-msg")}</p>
          {/* Add error and success */}
          {error && <Message variant="danger">{error}</Message>}
          {success && <Message variant="success">{success}</Message>}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="email">
              <Form.Label>{t("email-address")}</Form.Label>
              <Form.Control
                type="email"
                placeholder={t("enter-email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Button className="mt-3" type="submit" variant="info" block>
              {t("send-email")}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ForgotPassword;
