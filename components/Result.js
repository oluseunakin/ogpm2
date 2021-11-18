import { Row, Col, Card } from "react-bootstrap";

export default function Result({ text }) {
  if (text)
    return (
      <Card
        style={{
          position: "fixed",
          top: "40%",
          left: "30%",
          zIndex: "100",
        }}
      >
        <Card.Body>
          {text}
        </Card.Body>
      </Card>
    );
  return null;
}
