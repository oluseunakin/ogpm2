import Head from "next/head";
import { NewsComp } from "../components/News";
import { dailyAppointment } from "../lib/appointments";
import { useState } from "react";
import { DevotionComp, Devotion } from "../components/Devotion";
import { PrayerComp, PrayerRequest } from "../components/PrayerRequest";
import { TestimonyComp, Testimony } from "../components/Testimony";
import { Appointment } from "../components/Appointment";
import { News } from "../components/News";
import { dailyNews, allnews } from "../lib/news";
import {
  Container,
  Row,
  Col,
  Toast,
  Spinner,
  Navbar,
  Nav,
  Card,
} from "react-bootstrap";
import { BibleBooks } from "../components/Bible";
import { getTestimonies } from "../lib/testimony";
import { devotions } from "../lib/devotion";
import { bibleTypes, getAbout } from "../lib/utils";
import Bible from "../lib/Bible";
import { getRequests } from "../lib/prayerRequest";
import { About, EditAbout} from "../components/About";

export default function Home({ admin, dailyAppointment, dailyNews }) {
  const [main, setMain] = useState(
    <Appointment admin={admin} dailyAppointment={dailyAppointment} />
  );
  const [result, setResult] = useState("");
  const [selectedType, setSelectedType] = useState();
  const [data, setData] = useState(
    dailyNews.map((n, i) => (
      <News
        key={i}
        news={n.news}
        title={n.title}
        gallery={n.gallery}
        date={n.date}
      />
    ))
  );

  return (
    <>
      <Head>
        <title></title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Head>
        <title>Oracle of God Prophetic Ministry</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container fluid="lg" style={{backgroundColor:"transparent"}}>
        <Navbar expand="md" className="mb-5" collapseOnSelect> 
          <Navbar.Brand
            onClick={(e) => {
              e.preventDefault();
              setMain(
                <Appointment
                  admin={admin}
                  dailyAppointment={dailyAppointment}
                />
              );
              setData(
                dailyNews.map((n) => (
                  <News
                    news={n.news}
                    title={n.title}
                    gallery={n.gallery}
                    date={n.date}
                  />
                ))
              );
            }}
            href="/"
          >
            Oracle of God Prophetic Ministry
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Nav fill style={{ width: "100%" }}>
              <Nav.Link
                href='/about'
                className="text-primary"
                onClick={async (e) => {
                  e.preventDefault()
                  setData(null)
                  const old = await getAbout()
                  setMain(<EditAbout result={setResult} oldAbout={old}/>)
                  setData(<About oldAbout={old}/>)
                }}
              >
                About
              </Nav.Link>
              <Nav.Link
                className="text-primary"
                href='/prayers'
                onClick={async (e) => {
                  e.preventDefault()
                  setData(null);
                  const prayers = await getRequests();
                  setMain(<PrayerComp result={setResult} />);
                  setData(<PrayerRequest prayers={prayers} admin={admin} />);
                }}
              >
                Prayer Requests
              </Nav.Link>
              <Nav.Link
                className="text-primary"
                href='/devotions'
                onClick={async (e) => {
                  e.preventDefault()
                  setData(null);
                  const oldDevs = await devotions();
                  const books = (
                    await new Bible().getBooks(
                      Bible.types.get(
                        "The Holy Bible, American Standard Version"
                      )
                    )
                  ).data;
                  setMain(
                    <DevotionComp
                      admin={admin}
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
                href='/testimonies'
                className="text-primary"
                onClick={async (e) => {
                  e.preventDefault()
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
                href='/news'
                className="text-primary"
                onClick={async (e) => {
                  e.preventDefault()
                  setData(null);
                  const oldNews = await allnews();
                  setMain(
                    <NewsComp
                      oldNews={oldNews}
                      setData={setData}
                      admin={admin}
                    />
                  );
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
            <Toast show={result !== ""} >
              <Toast.Body>{result}</Toast.Body>
            </Toast>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col md={4} className="mb-4">
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

export async function getServerSideProps({ params }) {
  return {
    props: {
      dailyAppointment: await dailyAppointment(),
      dailyNews: await dailyNews(),
      admin: params.admin,
    },
  };
}
