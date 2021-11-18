import MediaComp from "./Media";
import { Col, Row, Card } from "react-bootstrap";
import { formatDate } from "../lib/utils";

export function Testimony({ testimony, desc, testifier, date, gallery }) {
  return (
    <Row className="mb-4">
      <Col>
        <Card>
          <Card.Body>
            <Card.Title>{testifier}</Card.Title>
            <Card.Subtitle>
              <p>{desc}</p>
              <small className="text-muted">
                {formatDate(date * (1000 * 60 * 60 * 24))}
              </small>
            </Card.Subtitle>
            <Card.Text>{testimony}</Card.Text>
            {<MediaComp media={gallery} screen="small" />}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
