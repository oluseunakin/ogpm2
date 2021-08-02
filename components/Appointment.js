import { useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { appointments} from "../lib/appointments";
import _ from "lodash";
import { formatDate } from "../lib/utils";

function Apt({name,date}) {
  return <Card>
    <Card.Body>
  <Row>
      <Col className="col-7">{name}</Col>
      <Col className="col-5">{formatDate(new Date(date*(1000*60*60*24)))}</Col>
    </Row></Card.Body></Card>
}

export function Appointment({ admin, dailyAppointment}) {

  const [loading, setLoading] = useState(false)
  const [rendered, setRendered] = useState(() => 
    !(_.isEmpty(dailyAppointment))? 
      <>
        <h3>You have Appointments with</h3>
        {dailyAppointment.map((apt,i) => <Row className="mb-3" key={i}><Col><Apt name={apt.name} date={apt.date}/></Col></Row>)}
      </>
    : <h3>You have no Appointments for today</h3>
  )

  return admin === "lucas" && (
    <Row>
      <Col>
        <Row className="mb-4" >
          <Col className="d-flex justify-content-end">
            <Button
              variant="success"
              active={loading}
              onClick={async () => {
                setLoading(true)
                const apts = await appointments()
                setRendered(
                  <Card>
                    <Card.Body>
                      {_.isEmpty(apts)?'You have no Appointments' : apts.map((apt,i) => (
                        <Row key={i}>
                          <Col><Apt name={apt.name} date={apt.date}/></Col>
                        </Row>))
                      }
                    </Card.Body>
                  </Card>
                )
                setLoading(false)
              }}
            >
              {loading? 'Fetching...' : 'See all Appointments'}
            </Button>
          </Col>
        </Row>
        <Row className="px-5"><Col>{rendered}</Col></Row>
      </Col>
    </Row>
  ) 
}
