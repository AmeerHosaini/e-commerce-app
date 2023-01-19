import FormContainer from "../components/FormContainer";
import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import Message from "../components/Message";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      return setError("Please provide your email");
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
    <FormContainer>
      <h1>Forgot Password</h1>
      <p>
        Please enter the email address you register your account with. We will
        send you reset password confirmation to this email.
      </p>
      {/* Add error and success */}
      {error && <Message variant="danger">{error}</Message>}
      {success && <Message variant="success">{success}</Message>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button className="mt-3" type="submit" variant="primary">
          Send Email
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ForgotPassword;
