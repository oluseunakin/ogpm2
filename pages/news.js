import { useState, useRef } from "react";
import { newsByDay, createNews, allnews } from "../lib/news";
import { checkMedia, compress, formatDate } from "../lib/utils";
import _ from "lodash";
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
import { News } from "../components/News";
import { MySpinner } from "../components/Spinner";
import { Navigation } from "../components/Navigation";
import { useRouter } from "next/router";
import Result from "../components/Result";

export default function NewsComp({ oldNews }) {
  const titleRef = useRef();
  const newsRef = useRef();
  const [data, setData] = useState(oldNews);
  const [searchDate, setSearchDate] = useState();
  const fileInput = useRef();
  const [loading, setLoading] = useState(false);
  const [muchMedia, setMuchMedia] = useState(false)
  const { admin } = useRouter().query;

  return (
    <>
      <Navigation admin={admin} />
      <Row>
        <Col>
          <Row className="mb-3">
            <Col className="col-lg-5 col-md-7">
              <InputGroup>
                <FormControl
                  type="date"
                  defaultValue={formatDate(Date.now(), "-")}
                  onChange={(e) => {
                    setSearchDate(
                      Math.floor(
                        e.currentTarget.valueAsDate.getTime() /
                          (1000 * 60 * 60 * 24)
                      )
                    );
                  }}
                />
                <InputGroup.Append>
                  <Button
                    variant="primary"
                    aria-label="Search for a news or event"
                    onClick={async (e) => {
                      setData(null);
                      setData(await newsByDay(searchDate));
                    }}
                  >
                    <BsSearch />
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Col>
          </Row>
          {admin && (
            <Row className="mb-4">
              <Col>
                <Card>
                  <Card.Header>Create News or Event</Card.Header>
                  <Card.Body>
                    <Row className="mb-3">
                      <Col>
                        <FormControl
                          placeholder="News/Events title"
                          ref={titleRef}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col>
                        <FormControl
                          as="textarea"
                          ref={newsRef}
                          placeholder="News/Events in detail"
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
                      <Col>
                        <Button
                          className="col-sm-auto col-12"
                          disabled={loading}
                          onClick={async () => {
                            const media = checkMedia(fileInput.current.files);
                            if (typeof media === "string") {
                              setMuchMedia(true)
                              fileInput.current.value = ''
                            }
                            else {
                              setData(null);
                              setLoading(true);
                              const newEvent = await createNews({
                                news: newsRef.current.value,
                                title: titleRef.current.value,
                                date: Math.floor(
                                  Date.now() / (1000 * 60 * 60 * 24)
                                ),
                                media: media,
                              });
                              setLoading(false);
                              setMuchMedia(false)
                              newsRef.current.value = "";
                              titleRef.current.value = "";
                              fileInput.current.value = "";
                              setData([newEvent, ...data]);
                            }
                          }}
                        >
                          {loading ? <MySpinner /> : "Create News/Events"}
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
          {data ? (
            data.map((n, i) => (
              <News
                key={i}
                news={n.news}
                title={n.title}
                date={n.date}
                gallery={n.minGallery}
              />
            ))
          ) : (
            <MySpinner />
          )}
        </Col>
      </Row>
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      oldNews: await allnews(),
    },
  };
}
