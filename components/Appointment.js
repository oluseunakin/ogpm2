import { useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { appointments } from "../lib/appointments";
import _ from "lodash";
import { formatDate } from "../lib/utils";

function Apt({ appointments }) {
  return (
    <Card>
      <Card.Header>Appointments</Card.Header>
      <Card.Body>
          <Row>
            <Col>
              {appointments.map((apt, i) => (
                <Row className="justify-content-center d-flex mb-1" key={i}>
                  <Col>{apt.name}</Col>
                  <Col>
                    {formatDate(apt.date * (1000 * 60 * 60 * 24))}
                  </Col>
                </Row>
              ))}
            </Col>
          </Row>  
      </Card.Body>
    </Card>
  );
}

export function Appointment({ admin, dailyAppointment }) {
  const [loading, setLoading] = useState(false);
  const [rendered, setRendered] = useState(() =>
    !_.isEmpty(dailyAppointment) ? (
      <>
        <h3>You have Appointments with</h3>
        <Apt appointments={dailyAppointment} />
      </>
    ) : (
      <h3>You have no Appointments for today</h3>
    )
  );

  return (
    admin && (
      <Row>
        <Col>
          <Row className="mb-4">
            <Col className="justify-content-center d-flex">
              <Button
                variant="success"
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  const apts = await appointments();
                  setRendered(
                    _.isEmpty(apts) ? (
                      <h3>You have no Appointments</h3>
                    ) : (
                      <Apt appointments={apts} />
                    )
                  );
                  setLoading(false);
                }}
              >
                {loading ? "Fetching your Appointments..." : "See all Appointments"}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col className="justify-content-center d-flex">{rendered}</Col>
          </Row>
        </Col>
      </Row>
    )
  );
}
