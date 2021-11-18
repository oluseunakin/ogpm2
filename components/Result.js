import { Row, Col, Card } from "react-bootstrap";

export default function Result({ text }) {
  if (text)
    return (
      <Card
        style={{
          position: "fixed",
          top: "40%",
          left: "40%",
          zIndex: "100",
          backgroundColor: "black",
          color: "aquamarine",
        }}
      >
        <Card.Body>
          {text}
        </Card.Body>
      </Card>
    );
  return null;
}
