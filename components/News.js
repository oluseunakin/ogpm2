import { useState, useRef } from "react";
import { newsByDay, createNews } from "../lib/news";
import { formatDate } from "../lib/utils";
import _ from "lodash";
import MediaComp from "./Media";
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

export function NewsComp({ admin, oldNews, setData }) {
  const [news, setNews] = useState({
    title: "",
    news: "",
  });
  const [searchDate, setSearchDate] = useState();
  const fileInput = useRef();
  const [loading, setLoading] = useState(false);

  return (
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
                    e.currentTarget.valueAsDate.getTime() /
                      (1000 * 60 * 60 * 24)
                  );
                }}
              />
              <InputGroup.Append>
                <Button
                  variant="primary"
                  aria-label="Search for a news or event"
                  onClick={async (e) => {
                    setData(null);
                    setData(
                      await newsByDay(searchDate).map((news, i) => (
                        <News
                          key={i}
                          title={news.title}
                          news={news.news}
                          date={news.date}
                          gallery={news.gallery}
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
        {admin && admin === "lucas" && (
          <Row>
            <Col>
              <Card>
                <Card.Header>Create News or Event</Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Col>
                      <FormControl
                        placeholder="News/Events title"
                        onFocus={() =>
                          setNews({
                            ...news,
                            date: Math.floor(
                              new Date().getTime() / (1000 * 60 * 60 * 24)
                            ),
                          })
                        }
                        onChange={(e) =>
                          setNews({ ...news, title: e.currentTarget.value })
                        }
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <FormControl
                        as="textarea"
                        onChange={(e) =>
                          setNews({ ...news, news: e.currentTarget.value })
                        }
                        placeholder="News/Events in detail"
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <Form.File
                        multiple
                        ref={fileInput}
                        onChange={(e) =>
                          setNews({ ...news, media: fileInput.current.files })
                        }
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <Button
                        className="col-sm-auto col-12"
                        disabled={loading}
                        onClick={async () => {
                          setData(null);
                          setLoading(true);
                          const newEvent = await createNews(news);
                          setLoading(false);
                          oldNews.unshift(newEvent);
                          setData(
                            oldNews.map((news, i) => (
                              <News
                                key={i}
                                title={news.title}
                                news={news.news}
                                date={news.date}
                                gallery={news.gallery}
                              />
                            ))
                          );
                        }}
                      >
                        {loading ? "Creating..." : "Create News/Events"}
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  );
}

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
            {gallery && <MediaComp media={gallery} />}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
