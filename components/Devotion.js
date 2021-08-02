import { useState, useRef, useEffect } from "react";
import { devotionByDay, createDevotion } from "../lib/devotion";
import { formatDate } from "../lib/utils";
import _ from "lodash";
import { BsSearch } from "react-icons/bs";
import { BibleBooks, BibleVerse } from "./Bible";
import {
  Button,
  Form,
  FormControl,
  InputGroup,
  Row,
  Col,
  Card,
  Spinner,
  Badge,
} from "react-bootstrap";
import MediaComp from "./Media";
import Bible from "../lib/Bible";

export function DevotionComp({ admin, result, setData, oldDevs, books }) {
  const [dev, setDev] = useState({
    title: "Title of devotion",
    text: [],
    topic: "Enter devotion here",
  });
  const [verses, setVerses] = useState([]);
  const fileInput = useRef();
  const [searchDate, setSearchDate] = useState();
  const [loading, setLoading] = useState(false)

  return (
    <Row>
      <Col>
        <Row className="mb-5">
          <Col className="col-md-7 col-lg-5">
            <InputGroup>
              <FormControl
                type="date"
                defaultValue={formatDate(Date.now(), "-")}
                onChange={(e) => {
                  setSearchDate(e.currentTarget.valueAsDate.getTime()/(1000*60*60*24));}}
              />
              <InputGroup.Append>
                <Button
                  aria-label="Search for a devotion"
                  variant="outline-dark"
                  onClick={async (e) => {
                    setData(null);
                    const devo = await devotionByDay(searchDate)
                    setData(
                       devo.map((dev, i) => (
                        <Devotion
                          key={i}
                          gallery={dev.gallery}
                          title={dev.title}
                          topic={dev.topic}
                          text={dev.text}
                          date={dev.date}
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
        {admin && (
          <Row className="mb-5">
            <Col>
              <Row className="mb-3">
                <Col>
                  <FormControl
                    value={dev.title}
                    placeholder='Title for devotion'
                    onChange={(e) =>
                      setDev({ ...dev, title: e.currentTarget.value })
                    }
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <h5>Add Bible Verses</h5>
                  <BibleBooks books={books} admin={setVerses} />
                </Col>
              </Row>
              {verses.length != 0 && (
                <Row className="mb-3">
                  <Col>
                    <Card>
                      <Card.Header>Bible Verses</Card.Header>
                      <Card.Body>
                        {verses.map((verse, i) => (
                          <Badge key={i} bg="info">
                            {verse.reference}
                            <Button
                              className="mx-2"
                              onClick={() => {
                                setVerses(
                                  verses.filter((verse, index) => index != i)
                                );
                              }}
                            >
                              x
                            </Button>
                          </Badge>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}
              <Row className="mb-3">
                <Col>
                  <FormControl
                    as="textarea"
                    onFocus={() => setDev({...dev, date: Math.floor(new Date().getTime()/(1000*60*60*24))})}
                    onChange={(e) => setDev({ ...dev, topic: e.currentTarget.value, text: verses })}
                    value={dev.topic}
                    placeholder="Sermon for devotion"
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.File
                    multiple
                    ref={fileInput}
                    onChange={(e) => {
                      setDev({ ...dev, media: fileInput.current.files });
                    }}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col className="col-md-3">
                  <Button
                    disabled={loading}
                    onClick={async () => {
                      setData(null);
                      setLoading(true)
                      const newDevotion = await createDevotion(dev);
                      newDevotion
                        ? result("Success")
                        : result("Can't create devotion now, try again later");
                      setLoading(false)
                      oldDevs.unshift(newDevotion)
                      setData(
                        oldDevs.map((dev, i) => (
                          <Devotion
                            key={i}
                            gallery={dev.gallery}
                            title={dev.title}
                            topic={dev.topic}
                            text={dev.text}
                            date={dev.date}
                          />
                        ))
                      );
                      setDev({
                        title: "Title of devotion",
                        text: [],
                        topic: "Enter devotion here",media: null
                      })
                      setVerses([])
                      result("");
                    }}
                  >
                    {loading? 'Creating...' : 'Create Devotion'}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  );
}

export function Devotion({ text, title, topic, date, gallery }) {
  const [verse, setVerse] = useState("");
  return (
    <Row className="mb-4">
      <Col>
        <Card>
          <Card.Body>
            <Card.Title className="d-flex justify-content-center">{title}</Card.Title>
            {!_.isEmpty(text) && (
              <>
                <Row className="mb-1">
                  <Col>
                    <Badge>Bible Texts:</Badge>
                    {text.map((t, i) => (
                      <Button
                        key={i}
                        onClick={async () => {
                          setVerse(
                            <div className="d-flex justify-content-center">
                              <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                              </Spinner>
                            </div>
                          );
                          const data = (await new Bible().getVerse(t.bibleId, t.id))
                            .data;
                          setVerse(
                            <BibleVerse verse={data} close={() => setVerse(null)} />
                          );
                        }}
                        variant="link"
                      >
                        {t.reference}
                      </Button>
                    ))}
                  </Col>
                </Row>
                {verse && <Row className="mb-1">
                  <Col>{verse}</Col>
                </Row>}
              </>
            )}
            <Card.Subtitle className="text-muted">
              {formatDate(date*(1000*60*60*24))}
            </Card.Subtitle>
            <Card.Text>{topic}</Card.Text>
            {gallery && <MediaComp media={gallery} />}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
