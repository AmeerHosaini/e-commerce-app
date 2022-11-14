import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  const date = new Date().getFullYear();

  return (
    <footer className="bg-dark">
      <Container>
        <Row>
          <Col className="text-center">Copyright &copy; StoreHook {date}</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
