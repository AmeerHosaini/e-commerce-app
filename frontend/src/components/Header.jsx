import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";
import SearchBox from "./SearchBox";

const Header = ({ theme, toggleTheme }) => {
  // this gets userLogin part of our state
  // then, we destructure our states from userReducer

  const lightTheme = "light";
  const darkTheme = "dark";
  const textStyle = `text-${theme === lightTheme ? darkTheme : lightTheme}`;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userGoogleLogin = useSelector((state) => state.userGoogleLogin);
  const { userInfo: userGoogleInfo } = userGoogleLogin;

  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar bg={theme} variant={theme} expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className={textStyle}>StoreHook</Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <SearchBox />
            <Nav className="ml-auto">
              <LinkContainer to="/cart">
                <Nav.Link>
                  <FaShoppingCart className={`mb-1 mr-2 ${textStyle}`} />
                  <span className={textStyle}>Cart</span>
                </Nav.Link>
              </LinkContainer>
              {userInfo || userGoogleInfo ? (
                <NavDropdown
                  title={
                    <span className={textStyle}>
                      {userInfo?.name || userGoogleInfo?.name}
                    </span>
                  }
                  id="username"
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Log out
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <FaUser className={`mb-1 mr-2 ${textStyle}`} />
                    <span className={textStyle}>Sign In</span>
                  </Nav.Link>
                </LinkContainer>
              )}
              {(userInfo && userInfo.isAdmin) ||
              (userGoogleInfo && userGoogleInfo.isAdmin) ? (
                <NavDropdown
                  title={<span className={textStyle}>Admin</span>}
                  id="adminMenu"
                >
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              ) : null}
              <Nav.Link onClick={toggleTheme}>
                {theme === darkTheme ? (
                  <i className={`fas fa-sun ${textStyle}`}></i>
                ) : (
                  <i className={`fas fa-moon ${textStyle}`}></i>
                )}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
