import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { MdVisibilityOff, MdVisibility } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { login, googleLogin } from "../actions/userActions";
import { useGoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const userGoogleLogin = useSelector((state) => state.userGoogleLogin);
  const { userInfo: googleUserInfo } = userGoogleLogin;

  // We want to redirect
  // We dont want to come to the login page if we are logged in
  useEffect(() => {
    // if user is not logged in, it will be null
    if (userInfo || googleUserInfo) {
      // navigate(redirect) --- redirects to '/login/shipping', and it needs a correspondent route in App.js, Why?
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate, googleUserInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    // Dispatch Login
    dispatch(login(email, password));
  };

  const togglePassword = () => {
    setIsVisible(!isVisible);
  };

  const g_login = useGoogleLogin({
    onSuccess: (codeResponse) => dispatch(googleLogin(codeResponse)),
  });

  // This part is used when using GoogleLogin component from @react-oauth/google
  // const googleSuccess = async (credentialResponse) => {
  //   console.log(credentialResponse);
  //   dispatch(googleLogin(credentialResponse));
  // };

  // const googleError = () => {
  //   console.log("Error happened");
  // };

  return (
    <FormContainer>
      <h1>{t("sign-in")}</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
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

        <div className="d-flex justify-content-between">
          <Button
            className="mt-3"
            type="submit"
            variant="primary"
            style={{ width: "48%" }}
          >
            {t("sign-in")}
          </Button>
          <div
            className="btn btn-outline-primary mt-3 btn-google-login"
            style={{ width: "48%" }}
            onClick={() => g_login()}
          >
            {/* <GoogleLogin
              buttonText="Sign in with Google"
              onSuccess={googleSuccess}
              onFailure={googleError}
            /> 
            <GoogleLogin
              onSuccess={(credentialResponse) => {
              console.log(credentialResponse);
            }}
              onError={() => {
              console.log("Login Failed");
            }}
            />
            */}
            {t("gmail")} <FcGoogle />
          </div>
        </div>
      </Form>

      <Row className="py-3">
        <Col>
          {t("new-customer")}{" "}
          <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
            {t("register")}
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <Link to={"/forgotpassword"}>{t("forgot-password")}</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginPage;
