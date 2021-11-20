import { News } from "../components/News";
import { useState } from "react";
import { Devotion } from "../components/Devotion";
import { Button, Col, Row, FormControl, Card } from "react-bootstrap";
import _ from "lodash";
import { daily } from "../lib/utils";
import { upcoming } from "../lib/news";
import { bookAppointment } from "../lib/appointments";
import { Bibeli } from "../components/Bible";
import { Navigation } from "../components/Navigation";
import Result from "../components/Result";

export default function Home({ daily, upcoming }) {
  const [name, setName] = useState("");
  const [bookClicked, setBookClicked] = useState(false);
  const [result, setResult] = useState();
  const [data, setData] = useState(<Daily />);

  function Daily() {
    return _.isEmpty(daily) ? (
      <h1 style={{ textAlign: "center", color: "white" }}>
        There is no devotion for today
      </h1>
    ) : (
      daily.map((d, i) => (
        <Row key={i}>
          <Col>
            {d.text ? (
              <Devotion
                text={d.text}
                title={d.title}
                topic={d.topic}
                date={d.date}
                gallery={d.gallery}
              />
            ) : (
              <News
                news={d.news}
                title={d.title}
                date={d.date}
                gallery={d.gallery}
              />
            )}
          </Col>
        </Row>
      ))
    );
  }

  return (
    <>
      <Navigation />
      <Row className="mb-4">
        <Col md="8" className="justify-content-md-center d-flex mb-2">
          <Row>
            <Col>
              <FormControl
                placeholder="Your name here"
                className="mb-3"
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
              />
            </Col>
            <Col>
              <Button
                disabled={bookClicked}
                onClick={async () => {
                  setBookClicked(true);
                  setResult(<h5>{await bookAppointment(name)}</h5>);
                  setBookClicked(false);
                  setTimeout(() => setResult(), 5000);
                }}
              >
                {bookClicked ? "Booking..." : "Book Appointment"}
              </Button>
            </Col>
          </Row>
        </Col>
        <Col md="4">
          <Bibeli setData={setData} old={Daily} />
        </Col>
      </Row>
      <Row>
        <Col md="8">{data}</Col>
        <Col md="4">
          <Card>
            <Card.Header className="d-flex justify-content-center">
              <h4>Upcoming News and Events</h4>
            </Card.Header>
            <Card.Body>
              {upcoming.map((news, i) => (
                <News
                  key={i}
                  news={news.news}
                  title={news.title}
                  date={news.date}
                  gallery={news.gallery}
                />
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Result text={result} />
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      daily: await daily(),
      upcoming: await upcoming(),
    },
  };
}
