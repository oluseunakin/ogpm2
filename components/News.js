import MediaComp from "./Media";
import { Col, Row, Card } from "react-bootstrap";
import { formatDate } from "../lib/utils";

export function News({ news, title, date, gallery }) {
  return (
    <Row className="mb-3">
      <Col>
        <Card>
          <Card.Body>
            <Card.Title className="d-flex justify-content-center">
              {title}
            </Card.Title>
            <Card.Subtitle className="text-muted">
              {formatDate(date * (1000 * 60 * 60 * 24))}
            </Card.Subtitle>
            <Card.Text>{news}</Card.Text>
            <MediaComp media={gallery} screen='md'/>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
