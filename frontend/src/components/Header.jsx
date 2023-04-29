import { useTranslation } from "react-i18next";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";
import { changeLanguage } from "../actions/langActions";
import SearchBox from "./SearchBox";
import axios from "axios";

const Header = ({ theme, toggleTheme }) => {
  // this gets userLogin part of our state
  // then, we destructure our states from userReducer

  const { i18n, t } = useTranslation();

  const lightTheme = "light";
  const darkTheme = "dark";
  const textStyle = `text-${theme === lightTheme ? darkTheme : lightTheme}`;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userGoogleLogin = useSelector((state) => state.userGoogleLogin);
  const { userInfo: userGoogleInfo } = userGoogleLogin;

  const changeLang = useSelector((state) => state.changeLang);
  const { lang } = changeLang;

  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  };

  // language switcher
  // const handleLanguageChange = (e) => {
  //   const languageCode = e.target.value;
  //   i18n.changeLanguage(languageCode);
  //   setLanguage(languageCode);
  //   // document.documentElement.dir = languageCode === "fa" ? "rtl" : "ltr";
  // };

  function handleLanguageChange(eventKey) {
    i18n.changeLanguage(eventKey);
    axios.defaults.headers.common["Accept-Language"] = eventKey;
    // setLanguage(eventKey);
    dispatch(changeLanguage(eventKey));
    // document.documentElement.dir = eventKey === "fa" ? "rtl" : "ltr";
  }

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
                  <span className={textStyle}>{t("cart")}</span>
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
                    <NavDropdown.Item>{t("profile")}</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    {t("log-out")}
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <FaUser className={`mb-1 mr-2 ${textStyle}`} />
                    <span className={textStyle}>{t("sign-in")}</span>
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
                    <NavDropdown.Item>{t("users")}</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>{t("products")}</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>{t("orders")}</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              ) : null}
              <NavDropdown
                title={<span className={textStyle}>{lang}</span>}
                onSelect={handleLanguageChange}
              >
                <NavDropdown.Item eventKey="en">English</NavDropdown.Item>
                <NavDropdown.Item eventKey="fa">Farsi/Persian</NavDropdown.Item>
              </NavDropdown>

              {/* <select onChange={handleLanguageChange}>
                <option value="en">en</option>
                <option value="fa">fa</option>
              </select> */}
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
