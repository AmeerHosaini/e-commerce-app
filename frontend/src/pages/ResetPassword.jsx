import axios from "axios";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      return setError("Please provide your password");
    }

    if (password !== confirmPassword) {
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setError("");
      }, 5000);
      return setError("Passwords do not match");
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
    <FormContainer>
      <h1>Reset Password</h1>
      {error && <Message variant="danger">{error}</Message>}
      {success && <Message variant="success">{success}</Message>}

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="password">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter New Password"
            title={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="confirmPassword">
          <Form.Label className="mt-2">Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm New Password"
            title={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button className="mt-3" type="submit" variant="primary">
          Reset Password
        </Button>
      </Form>
      <Row className="mt-3">
        <Col>{success && <Link to={"/login"}>Login</Link>}</Col>
      </Row>
    </FormContainer>
  );
};

export default ResetPassword;
