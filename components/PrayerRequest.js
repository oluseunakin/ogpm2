import { useState } from "react";
import { requestPrayer } from "../lib/prayerRequest";
import { Button, Card, Col, FormControl, Row } from "react-bootstrap";

export function PrayerComp({result}) {

  const [name, setName] = useState("");
  const [request, setRequest] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <Row className="mb-5">
      <Col>
        <Row className="p-2">
          <Col>
            <FormControl
              value={name}
              placeholder="Your name"
              onChange={(e) => setName(e.currentTarget.value)}
            />
          </Col>
        </Row>
        <Row className="p-2">
          <Col>
            <FormControl
              as="textarea"
              value={request}
              placeholder="Type your request"
              onChange={(e) => setRequest(e.currentTarget.value)}
            />
          </Col>
        </Row>
        <Row className="p-2">
          <Col>
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
          </Col>
        </Row>
      </Col>
    </Row>
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
