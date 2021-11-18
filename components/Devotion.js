import { useState } from "react";
import MediaComp from "../components/Media";
import { Alert, Row, Col, Card } from "react-bootstrap";
import { BibleVerse } from "./Bible";
import _ from "lodash";
import { formatDate } from "../lib/utils";
import { MySpinner } from "./Spinner";
import Bible from "../lib/Bible";

export function Devotion({ text, title, topic, date, gallery }) {
  const [verse, setVerse] = useState("");
  return (
    <Row className="mb-4">
      <Col>
        <Card >
          <Card.Body>
            <Card.Title className="d-flex justify-content-center">
              {title}
            </Card.Title>

            <Row style={{ margin: 0 }}>
              <Col>
                {!_.isEmpty(text) && (
                  <Row>
                    <Col className="col-auto">
                      <small> Bible Texts: </small>
                    </Col>
                    {text.map((t, i) => (
                      <Col className="col-auto" key={i}>
                        <Alert.Link
                          onClick={async () => {
                            setVerse(<MySpinner />);
                            const data = (
                              await new Bible().getVerse(t.bibleId, t.id)
                            ).data;
                            setVerse(
                              <BibleVerse
                                verse={data}
                                close={() => setVerse(null)}
                              />
                            );
                          }}
                        >
                          {t.reference}
                        </Alert.Link>
                      </Col>
                    ))}
                  </Row>
                )}
                {verse && (
                  <Row className="mb-1">
                    <Col>{verse}</Col>
                  </Row>
                )}
                <div>
                  <small className="text-muted">
                    {formatDate(date * (1000 * 60 * 60 * 24))}
                  </small>
                </div>
              </Col>
            </Row>
            <Card.Text className="mt-3">{topic}</Card.Text>
            {<MediaComp media={gallery} />}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
