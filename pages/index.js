import Head from "next/head";
import { NewsComp, News } from "../components/News";
import { useState } from "react";
import { PrayerComp } from "../components/PrayerRequest";
import { DevotionComp, Devotion } from "../components/Devotion";
import { TestimonyComp, Testimony } from "../components/Testimony";
import { allnews } from "../lib/news";
import { devotions } from "../lib/devotion";
import { bookAppointment } from "../lib/appointments";
import Bible from "../lib/Bible";
import {
  Button,
  Col,
  Container,
  Row,
  FormControl,
  Toast,
  Spinner,
  Navbar,
  Nav,
  Card,
} from "react-bootstrap";
import { getTestimonies } from "../lib/testimony";
import _ from "lodash";
import { bibleTypes, daily } from "../lib/utils";
import { BibleBooks} from "../components/Bible";

export default function Home({ daily }) {
  
  function Daily() {
    return _.isEmpty(daily) ? (
        <h1 style={{ textAlign: "center" }}>There is no devotion for today</h1>
      ) : daily.map((d, i) => <Row key={i}>
          <Col>
            {d.text ? <Devotion text={d.text} title={d.title} topic={d.topic} date={d.date} gallery={d.gallery} />
            : <News news={d.news} title={d.title} date={d.date} gallery={d.gallery} />}
          </Col>
        </Row>
      ) 
  } 
  
  const [main, setMain] = useState();
  const [data, setData] = useState(<Daily />);
  const [name, setName] = useState("");
  const [bookClicked, setBookClicked] = useState(false);
  const [result, setResult] = useState("");
  const [selectedType, setSelectedType] = useState();

  return (
    <>
      <Head>
        <title>Oracle of God Prophetic Ministry</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container fluid="lg">
        <Navbar expand="md" className="mb-5" collapseOnSelect={true}>
          <Navbar.Brand
            onClick={(e) => {
              e.preventDefault();
              setData(<Daily />);
            }}
            href="/"
          >
            Oracle of God Prophetic Ministry
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Nav fill style={{ width: "100%" }}>
              <Nav.Link onClick={(e) => setMain(<PrayerComp />)}>
                Prayer Requests
              </Nav.Link>
              <Nav.Link
                onClick={async () => {
                  setData(null);
                  const oldDevs = await devotions();
                  const books = (await new Bible().getBooks(Bible.types.get('The Holy Bible, American Standard Version'))).data
                  setMain(
                    <DevotionComp
                      result={setResult}
                      setData={setData}
                      oldDevs={oldDevs}
                      books={books}
                    />
                  );
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
                }}
              >
                Devotions
              </Nav.Link>
              <Nav.Link
                onClick={async () => {
                  setData(null);
                  const oldTests = await getTestimonies();
                  setMain(
                    <TestimonyComp
                      result={setResult}
                      setData={setData}
                      oldTests={oldTests}
                    />
                  );
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
                }}
              >
                Testimonies
              </Nav.Link>
              <Nav.Link
                onClick={async () => {
                  setData(null);
                  const oldNews = await allnews();
                  setMain(<NewsComp oldNews={oldNews} setData={setData} />);
                  setData(
                    oldNews.map((n, i) => (
                      <News
                        key={i}
                        news={n.news}
                        date={n.date}
                        title={n.title}
                        gallery={n.gallery}
                      />
                    ))
                  );
                }}
              >
                News/Events
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Row>
          <Col className="justify-content-center d-flex">
            <Toast show={result !== ""}>
              <Toast.Body>{result}</Toast.Body>
            </Toast>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col md={4} className="mb-4">
            <Row className="mb-3">
              <Col>
                <FormControl
                  placeholder="Your name here"
                  className="mb-3"
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                />
                <div className="d-flex justify-content-end">
                  <Button
                    active={!bookClicked}
                    onClick={async () => {
                      setBookClicked(true);
                      setResult(await bookAppointment(name));
                      setTimeout(() => setResult(""), 5000);
                      setBookClicked(false);
                    }}
                  >
                    {bookClicked ? "Booking..." : "Book Appointment"}
                  </Button>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card>
                  <Card.Header>Read the Bible</Card.Header>
                  <Card.Body>
                    <select
                      className="form-control"
                      value={selectedType}
                      onChange={async (e) => {
                        setSelectedType(e.target.value);
                        setData(null);
                        const data = (
                          await new Bible().getBooks(e.target.value)
                        ).data;
                        setData(<BibleBooks books={data} />);
                      }}
                    >
                      {bibleTypes()}{" "}
                    </select>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col md={8}>{main}</Col>
        </Row>
        {data ? (
          data
        ) : (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        )}
      </Container>
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      daily: await daily()
    },
  };
}
