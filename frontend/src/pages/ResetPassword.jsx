import axios from "axios";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import Message from "../components/Message";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { t } = useTranslation();

  const { resetToken } = useParams();

  const submitHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (!password || !confirmPassword) {
      setTimeout(() => {
        setError("");
      }, 5000);
      return setError(t("provide-password"));
    }

    if (password !== confirmPassword) {
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setError("");
      }, 5000);
      return setError(t("password-incorrect"));
    }

    try {
      const { data } = await axios.put(
        `/api/users/passwordreset/${resetToken}`,
        {
          password,
        },
        config
      );
      setSuccess(data.data);
    } catch (error) {
      setError(
        error.response && error.response.data.msg
          ? error.response.data.msg
          : error.msg
      );
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow" style={{ width: "500px" }}>
        <Card.Body>
          <h1 className="text-center">{t("reset-password")}</h1>
          {error && <Message variant="danger">{error}</Message>}
          {success && <Message variant="success">{success}</Message>}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="password">
              <Form.Label>{t("new-password")}</Form.Label>
              <Form.Control
                type="password"
                placeholder={t("enter-new-password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label className="mt-2">{t("confirm-password")}</Form.Label>
              <Form.Control
                type="password"
                placeholder={t("confirm-new-password")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
            <Button className="mt-3" type="submit" variant="info" block>
              {t("reset-pass")}
            </Button>
          </Form>
          <Row className="mt-3">
            <Col>
              {success && (
                <Link className="text-info" to={"/login"}>
                  {t("login")}
                </Link>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ResetPassword;
