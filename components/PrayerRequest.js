import { useState } from "react";
import { requestPrayer } from "../lib/prayerRequest";
import { Button, Card, Col, FormControl, Row } from "react-bootstrap";

export function PrayerComp({ result }) {
  const [name, setName] = useState("");
  const [request, setRequest] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <Card className="mb-5">
      <Card.Header>Request for prayer</Card.Header>
      <Card.Body>
        <FormControl
          className="mb-3"
          placeholder="Your name"
          onChange={(e) => setName(e.currentTarget.value)}
        />
        <FormControl
          className="mb-3"
          as="textarea"
          placeholder="Type your request"
          onChange={(e) => setRequest(e.currentTarget.value)}
        />
        <Button
          disabled={loading}
          className="col-md-auto"
          onClick={async () => {
            setLoading(true);
            result(await requestPrayer(name, request));
            setLoading(false);
            setName("");
            setRequest("");
            setTimeout(() => result(""), 5000);
          }}
        >
          {loading ? "Sending Prayer..." : "Request"}
        </Button>
      </Card.Body>
    </Card>
  );
}

export function PrayerRequest({ admin, prayers }) {
  return (
    <Row>
      <Col>
        {admin === "lucas" &&
          prayers.map((req, i) => (
            <Row key={i} className="mb-4">
              <Col className="justify-content-center">
                <Card>
                  <Card.Body>
                    <Card.Title>{req.name}</Card.Title>
                    <Card.Text>{req.request}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ))}
      </Col>
    </Row>
  );
}
