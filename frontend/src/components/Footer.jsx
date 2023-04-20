import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  const date = new Date().getFullYear();

  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center font-weight-normal">StoreHook {date}</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
