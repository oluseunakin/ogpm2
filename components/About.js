import { useState, useRef } from "react";
import { Card, FormControl, Row, Button, Col, Form } from "react-bootstrap";
import { updateAbout } from "../lib/utils";
import MediaComp from "./Media";

export function EditAbout({ result, oldAbout }) {

  const [loading, setLoading] = useState(false);
  const fileInput = useRef();
  const aboutInput = useRef();

  return (
    <Row className="mb-3">
      <Col>
        <Card>
          <Card.Header>Edit About</Card.Header>
          <Card.Body>
            <FormControl
              className="mb-2"
              defaultValue={oldAbout.about}
              ref={aboutInput}
              as="textarea"
            />
            <Form.File className="mb-2" multiple ref={fileInput} />
            <Button
              className="mb-2"
              disabled={loading}
              onClick={() => {
                setLoading(true);
                const file = fileInput.current.files
                  ? fileInput.current.files
                  : undefined;
                oldAbout.about = aboutInput.current.value;
                oldAbout.gallery = file;
                updateAbout({ oldAbout });
                result("Success");
                setLoading(false);
                setTimeout(() => result(""), 5000);
              }}
            >
              {loading ? "Saving" : "Save"}
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export function About({ oldAbout}) {

  return (
    <Row>
      <Col>
        {oldAbout && (
          <Row className="mb-3">
            <Col>
              <Card>
                <Card.Body>
                  <Card.Text>{oldAbout.about}</Card.Text>
                  {oldAbout.gallery && <MediaComp media={oldAbout.gallery} />}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  );
}
