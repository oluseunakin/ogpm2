import { useRef, useState } from "react";
import { Card, FormControl, Row, Button, Col, Form } from "react-bootstrap";
import { updateAbout, checkMedia } from "../lib/utils";
import { MySpinner } from "./Spinner";

export function EditAbout({ result, oldAbout, setData }) {
  const fileInput = useRef();
  const aboutInput = useRef();
  const [muchMedia, setMuchMedia] = useState(false);
  const [loading, setLoading] = useState(false)
  return (
    <Row className="mb-3">
      <Col>
        <Card>
          <Card.Header>Edit About</Card.Header>
          <Card.Body>
            <FormControl
              className="mb-2"
              placeholder={oldAbout ? oldAbout.about : "Start typing..."}
              ref={aboutInput}
              as="textarea"
            />
            <Form.File className="mb-2" multiple ref={fileInput} />
            {muchMedia && (
              <span>You are trying to upload more than the max allowed</span>
            )}
            <Button
              className="mb-2"
              onClick={async () => {
                const media = checkMedia(fileInput.current.files);
                if (typeof media === "string") {
                  setMuchMedia(true);
                  fileInput.current.value = "";
                } else {
                  setLoading(true)
                  const files =
                    fileInput.current.files.length > 0
                      ? fileInput.current.files
                      : undefined;
                  result(<MySpinner />);
                  setMuchMedia(false)
                  setData(await updateAbout(aboutInput.current.value, media));
                  setLoading(false)
                  fileInput.current.value = "";
                  aboutInput.current.value = "";
                  result();
                }
              }}
            >
              {loading? <MySpinner /> : 'Save'}
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
