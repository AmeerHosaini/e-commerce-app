import { useTranslation } from "react-i18next";
import { Spinner } from "react-bootstrap";

const Loader = () => {
  const { t } = useTranslation();

  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        width: "100px",
        height: "100px",
        margin: "auto",
        display: "grid",
      }}
    >
      <span className="sr-only">{t("loading")}</span>
    </Spinner>
  );
};

export default Loader;
