import { useState, useRef } from "react";
import {
  shareTestimony,
  testimonyByDay,
  testimonyByName,
} from "../lib/testimony";
import { formatDate } from "../lib/utils";
import { BsSearch } from "react-icons/bs";
import {
  Col,
  Form,
  FormControl,
  InputGroup,
  Row,
  Button,
  Card,
} from "react-bootstrap";
import MediaComp from "./Media";

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
            {gallery && <MediaComp media={gallery} screen="small" />}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export function TestimonyComp({ result, oldTests, setData }) {
  const [testimony, setTestimony] = useState({
    testimony: "",
    testifier: "",
    desc: "",
    date: "",
  });
  const fileInput = useRef();
  const [name, setName] = useState("");
  const [searchDate, setSearchDate] = useState();
  const [loading, setLoading] = useState(false);

  return (
    <Row>
      <Col>
        <Row className="mb-3">
          <Col md={6} className="mb-2">
            <InputGroup>
              <FormControl
                placeholder="Search by member's name"
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  if (value === "")
                    setData(
                      oldTests.map((t, i) => (
                        <Testimony
                          key={i}
                          testifier={t.testifier}
                          testimony={t.testimony}
                          date={t.date}
                          desc={t.desc}
                          gallery={t.gallery}
                        />
                      ))
                    );
                  setName(e.currentTarget.value);
                }}
              />
              <InputGroup.Append>
                <Button
                  variant="primary"
                  aria-label="Search for testimony by name"
                  onClick={async () => {
                    setData(null);
                    setData(
                      (await testimonyByName(name)).map((t, i) => (
                        <Testimony
                          key={i}
                          testifier={t.testifier}
                          testimony={t.testimony}
                          date={t.date}
                          desc={t.desc}
                          gallery={t.gallery}
                        />
                      ))
                    );
                  }}
                >
                  <BsSearch />
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
          <Col md={6} className="mb-2">
            <InputGroup>
              <FormControl
                type="date"
                defaultValue={formatDate(new Date().getTime(), "-")}
                onChange={(e) => {
                  setSearchDate(
                    e.currentTarget.valueAsDate.getTime() /
                      (1000 * 60 * 60 * 24)
                  );
                }}
              />
              <InputGroup.Append>
                <Button
                  variant="primary"
                  aria-label="Search for a testimony"
                  onClick={async (e) => {
                    setData(null);
                    setData(
                      (await testimonyByDay(searchDate)).map((t, i) => (
                        <Testimony
                          key={i}
                          testifier={t.testifier}
                          testimony={t.testimony}
                          date={t.date}
                          desc={t.desc}
                          gallery={t.gallery}
                        />
                      ))
                    );
                  }}
                >
                  <BsSearch />
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Card>
              <Card.Header>Share your testimony</Card.Header>
              <Card.Body>
                <FormControl
                  className="mb-3"
                  placeholder="Your name"
                  onChange={(e) =>
                    setTestimony({
                      ...testimony,
                      testifier: e.currentTarget.value,
                      date: Date.now() / (1000 * 60 * 60 * 24),
                    })
                  }
                />
                <FormControl
                  className="mb-3"
                  placeholder="What the Lord has done for you"
                  onChange={(e) =>
                    setTestimony({ ...testimony, desc: e.currentTarget.value })
                  }
                />
                <FormControl
                  className="mb-3"
                  as="textarea"
                  onChange={(e) => {
                    setTestimony({
                      ...testimony,
                      testimony: e.currentTarget.value,
                    });
                  }}
                  placeholder="Your testimony to the glory of the Lord"
                />
                <Form.File
                  className="mb-3"
                  multiple
                  ref={fileInput}
                  onChange={(e) => {
                    setTestimony({
                      ...testimony,
                      media: fileInput.current.files,
                    });
                  }}
                />
                <Button className="col-md-auto"
                  disabled={loading}
                  onClick={async () => {
                    setData(null);
                    setLoading(true);
                    const newTestimony = await shareTestimony(testimony);
                    setLoading(false);
                    newTestimony
                      ? result("Success")
                      : result("Can't share testimony now, try again later");
                    setData(
                      [newTestimony, ...oldTests].map((t, i) => (
                        <Testimony
                          key={i}
                          testifier={t.testifier}
                          testimony={t.testimony}
                          date={t.date}
                          desc={t.desc}
                          gallery={t.gallery}
                        />
                      ))
                    );
                    result("");
                  }}
                >
                  {loading ? "Sharing..." : "Share your Testimony"}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
