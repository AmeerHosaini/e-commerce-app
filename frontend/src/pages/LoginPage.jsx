import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { login, googleLogin } from "../actions/userActions";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  // We want to redirect
  // We dont want to come to the login page if we are logged in
  useEffect(() => {
    // if user is not logged in, it will be null
    if (userInfo) {
      // navigate(redirect) --- redirects to '/login/shipping', and it needs a correspondent route in App.js, Why?
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    // Dispatch Login
    dispatch(login(email, password));
  };

  // const g_login = useGoogleLogin({
  //   onSuccess: (credentialResponse) =>
  //     dispatch(googleLogin(credentialResponse)),
  // });

  const googleSuccess = async (credentialResponse) => {
    console.log(credentialResponse);
    dispatch(googleLogin(credentialResponse));
  };

  const googleError = () => {
    console.log("Error happened");
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      {/* <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label className="mt-2">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button className="mt-3" type="submit" variant="primary">
          Sign In
        </Button>
        <GoogleLogin
          buttonText="Sign in with Google"
          onSuccess={googleSuccess}
          onFailure={googleError}
        />
      </Form> */}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label className="mt-2">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <div className="d-flex justify-content-between">
          <Button
            className="mt-3"
            type="submit"
            variant="primary"
            style={{ width: "48%" }}
          >
            Sign In
          </Button>
          <div
            className="btn btn-outline-primary mt-3"
            style={{ width: "48%" }}
            // onClick={() => g_login()}
          >
            <GoogleLogin
              buttonText="Sign in with Google"
              onSuccess={googleSuccess}
              onFailure={googleError}
            />
            {/* Sign in with Google */}
          </div>
        </div>
      </Form>

      <Row className="py-3">
        <Col>
          New Customer?{" "}
          <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
            Register
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <Link to={"/forgotpassword"}>Forgot Password?</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginPage;
