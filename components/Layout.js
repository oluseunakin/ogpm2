import { Container } from "react-bootstrap";

const Layout = ({ children }) => {
  return (
    <Container fluid="lg" >
      {children}
    </Container>
  );
};

export default Layout;
