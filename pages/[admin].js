import { dailyAppointment } from "../lib/appointments";
import { dailyNews } from "../lib/news";
import { Row, Col } from "react-bootstrap";
import { Bibeli } from "../components/Bible";
import { Appointment } from "../components/Appointment"
import { Navigation } from "../components/Navigation";
import { useState } from "react";

export default function Home({ admin, dailyAppointment, dailyNews }) {
  const daily = dailyNews.map((n, i) => (
    <News
      key={i}
      news={n.news}
      title={n.title}
      gallery={n.gallery}
      date={n.date}
    />
  ))
  const [data, setData] = useState(daily)
  return (
    <>
      <Navigation admin={admin} />
      <Row className="mb-4">
        <Col lg={4} className="mb-3">
          <Bibeli setData={setData} old={daily}/>
        </Col>
        <Col lg={8} className="mb-3">
          <Appointment admin={admin} dailyAppointment={dailyAppointment} />
        </Col>
      </Row>
      {data}
    </>
  );
}

export async function getServerSideProps({ params }) {

  if(params.admin !== 'lucas') return {
    notFound: true
  }

  return {
    props: {
      dailyAppointment: await dailyAppointment(),
      dailyNews: (await dailyNews()),
      admin: 'lucas',
    },
  };
}
