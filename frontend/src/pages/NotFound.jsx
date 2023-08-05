import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="error">
      <h1>404</h1>
      <p>{t("not-found")}</p>
      <Link className="btn btn-info" to="/">
        {t("go-back")}
      </Link>
    </div>
  );
};

export default NotFound;
