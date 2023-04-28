import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { useEffect } from "react";
import { activate } from "../actions/userActions";

const ActivatePage = () => {
  const { activation_token } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const userActivate = useSelector((state) => state.userActivate);
  const { loading, error, success } = userActivate;

  useEffect(() => {
    if (activation_token) {
      dispatch(activate(activation_token));
    }
  }, [activation_token, dispatch]);

  return (
    <FormContainer>
      {error && <Message variant="danger">{error}</Message>}
      {success && <Message variant="success">{success}</Message>}
      {loading && <Loader />}
      <p>{t("account-activated")}</p>
      <p>
        <Link to="/login">{t("log-in")}</Link>
      </p>
    </FormContainer>
  );
};

export default ActivatePage;
