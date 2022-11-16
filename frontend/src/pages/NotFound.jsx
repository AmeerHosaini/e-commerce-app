import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="error">
      <h1>404</h1>
      <p>Oops, the page you're looking for does not exist</p>
      <Link className="btn btn-dark" to="/">
        Go Back
      </Link>
    </div>
  );
};

export default NotFound;
