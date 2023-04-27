import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { useEffect, useState } from "react";

const ActivatePage = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { activation_token } = useParams();

  useEffect(() => {
    if (activation_token) {
      const activateUser = async () => {
        try {
          const res = await axios.post("/api/users/activate", {
            activation_token,
          });
          setSuccess(res.data.msg);
        } catch (error) {
          setError(
            error.response && error.response.data.msg
              ? error.response.data.msg
              : error.msg
          );
        }
      };

      activateUser();
    }
  }, [activation_token]);

  return (
    <FormContainer>
      {error && <Message variant="danger">{error}</Message>}
      {success && <Message variant="success">{success}</Message>}
      <p>Your account has been activated!</p>
      <p>
        <Link to="/login">Login</Link>
      </p>
    </FormContainer>
  );
};

export default ActivatePage;
