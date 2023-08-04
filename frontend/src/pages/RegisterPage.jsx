import { useTranslation } from "react-i18next";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Form, Button, Col, Row, Card } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { register } from "../actions/userActions";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState(null);
  const { t } = useTranslation();

  const dispatch = useDispatch();
  // const userRegister = useSelector((state) => state.userRegister);
  // const { loading, userInfo, error } = userRegister;

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, success, error } = userRegister;

  // const navigate = useNavigate();
  const location = useLocation();
  const redirect = location.search ? location.search.split("=")[1] : "/";

  // We want to redirect --- Basically if we register, after our data is submitted to the db, we should see something. That would be the home page not the register page
  // We dont want to come to the registration page if we are registered
  // useEffect(() => {
  //   // if user is not logged in, it will be null
  //   if (userInfo) {
  //     navigate(redirect);
  //   }
  // }, [navigate, userInfo, redirect]);
  // In the activation case, we don't want to go anywhere and stay in the registeration page until the user opens his email and activate account.

  const submitHandler = (e) => {
    e.preventDefault();
    // Check the password
    if (password !== confirmPassword) {
      setMessage(t("passwords-do-not-match"));
    } else {
      dispatch(register(name, email, password));
    }
  };

  const togglePassword = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow" style={{ width: "500px" }}>
        <Card.Body>
          <h1 className="text-center">{t("sign-up")}</h1>
          {message && <Message variant="danger">{message}</Message>}
          {success && <Message variant="danger">{success}</Message>}
          {error && <Message variant="danger">{error}</Message>}
          {loading && <Loader />}

          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>{t("name")}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t("enter-name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label className="mt-2">{t("email-address")}</Form.Label>
              <Form.Control
                type="email"
                placeholder={t("enter-email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label className="mt-2">{t("password")}</Form.Label>
              <div style={{ position: "relative" }}>
                <Form.Control
                  type={isVisible ? "text" : "password"}
                  placeholder={t("enter-password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: "2.5rem" }} // Add padding to make space for the icon
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "0.75rem",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                  onClick={togglePassword}
                >
                  {isVisible ? <MdVisibility /> : <MdVisibilityOff />}
                </div>
              </div>
            </Form.Group>

            <Form.Group controlId="confirmPassword">
              <Form.Label className="mt-2">{t("confirm")}</Form.Label>
              <div style={{ position: "relative" }}>
                <Form.Control
                  type={isVisible ? "text" : "password"}
                  placeholder={t("confirm-password")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingRight: "2.5rem" }} // Add padding to make space for the icon
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "0.75rem",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                  onClick={togglePassword}
                >
                  {isVisible ? <MdVisibility /> : <MdVisibilityOff />}
                </div>
              </div>
            </Form.Group>

            <Button className="mt-3" type="submit" variant="info" block>
              {t("register")}
            </Button>
          </Form>

          <Row className="py-3">
            <Col>
              {t("already-have-account")}{" "}
              <Link
                className="text-info"
                to={redirect ? `/login?redirect=${redirect}` : "/login"}
              >
                {t("sign-in")}
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RegisterPage;
