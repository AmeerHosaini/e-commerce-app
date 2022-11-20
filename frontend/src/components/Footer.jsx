import { Container, Row, Col } from "react-bootstrap";

const Footer = ({ theme }) => {
  const date = new Date().getFullYear();

  const lightTheme = "light";
  const darkTheme = "dark";
  const textStyle = `text-${theme === lightTheme ? darkTheme : lightTheme}`;

  return (
    <footer className={`bg-${theme}`}>
      <Container>
        <Row>
          <Col className={`text-center ${textStyle} font-weight-normal`}>
            Copyright &copy; StoreHook {date}
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
