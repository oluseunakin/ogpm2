import { useState, useRef, useEffect } from "react";
import { devotionByDay, createDevotion } from "../lib/devotion";
import { BsSearch } from "react-icons/bs";
import { BibleBooks } from "../components/Bible";
import {
  Button,
  Form,
  FormControl,
  InputGroup,
  Row,
  Col,
  Card,
  Badge,
} from "react-bootstrap";
import { MySpinner } from "../components/Spinner";
import Bible from "../lib/Bible";
import { devotions } from "../lib/devotion";
import { Devotion } from "../components/Devotion";
import { checkMedia, formatDate } from "../lib/utils";
import { Navigation } from "../components/Navigation";
import { useRouter } from "next/router";
import Result from "../components/Result";

export default function DevotionComp({ devotions }) {
  const { admin } = useRouter().query;
  const [verses, setVerses] = useState([]);
  const fileInput = useRef();
  const titleRef = useRef();
  const topicRef = useRef();
  const searchRef = useRef();
  const [result, setResult] = useState();
  const [data, setData] = useState(devotions);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [muchMedia, setMuchMedia] = useState(false);

  if (admin) {
    useEffect(async () => {
      const d = async () => {
        const b = await new Bible().getBooks(
          Bible.types.get("The Holy Bible, American Standard Version")
        );
        return b.data;
      };
      setBooks(await d());
    }, books);
  }
  return (
    <>
      <Navigation admin={admin} />
      <Result text={result} />
      <Row>
        <Col>
          <Row className="mb-5">
            <Col className="col-md-7 col-lg-5">
              <InputGroup>
                <FormControl
                  type="date"
                  defaultValue={formatDate(Date.now(), "-")}
                  ref={searchRef}
                />
                <InputGroup.Append>
                  <Button
                    aria-label="Search for a devotion"
                    variant="secondary"
                    onClick={async (e) => {
                      setResult(<MySpinner />);
                      setData(
                        await devotionByDay(
                          Math.floor(
                            searchRef.current.valueAsDate.getTime() /
                              (1000 * 60 * 60 * 24)
                          )
                        )
                      );
                      setResult();
                    }}
                  >
                    <BsSearch />
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Col>
          </Row>
          {admin && (
            <Card className='mb-4'>
              <Card.Header>Create Devotion</Card.Header>
              <Card.Body>
                <Row>
                  <Col>
                    <Row className="mb-3">
                      <Col>
                        <FormControl
                          placeholder="Title for devotion"
                          ref={titleRef}
                        />
                      </Col>
                    </Row>
                    {books && (
                      <Row className="mb-3">
                        <Col>
                          <h5>Add Bible Verses</h5>
                          <BibleBooks books={books} admin={setVerses} setData={setData}/>
                        </Col>
                      </Row>
                    )}
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
                                        verses.filter(
                                          (verse, index) => index != i
                                        )
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
                          ref={topicRef}
                          placeholder="Sermon for devotion"
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col>
                        <Form.File multiple ref={fileInput} />
                        {muchMedia && <span>You are trying to upload more than the max allowed</span>}
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col className="col-md-3">
                        <Button
                          disabled={loading}
                          onClick={async () => {
                            const media = checkMedia(fileInput.current.files);
                            if (typeof media === "string") {
                              setMuchMedia(true);
                              fileInput.current.value = ''
                            } else {
                              setLoading(true);
                              setMuchMedia(false)
                              const newDev = (
                                await (
                                  await createDevotion({
                                    title: titleRef.current.value,
                                    topic: topicRef.current.value,
                                    media,
                                    text: verses,
                                    date: Math.floor(
                                      new Date().getTime() /
                                        (1000 * 60 * 60 * 24)
                                    ),
                                  })
                                ).get()
                              ).data();
                              setLoading(false);
                              setData([newDev, ...data]);
                              titleRef.current.value = "";
                              topicRef.current.value = "";
                              fileInput.current.value = "";
                              setVerses([]);
                            }
                          }}
                        >
                          {loading ? <MySpinner /> : "Create Devotion"}
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
      {data.map((dev, i) => (
        <Devotion
          key={i}
          gallery={dev.gallery}
          title={dev.title}
          topic={dev.topic}
          text={dev.text}
          date={dev.date}
        />
      ))}
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      devotions: await devotions(),
    },
  };
}
