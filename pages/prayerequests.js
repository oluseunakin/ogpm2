import { useRef, useState } from "react";
import { requestPrayer, getRequests } from "../lib/prayerRequest";
import { Button, Card, Col, FormControl, Row } from "react-bootstrap";
import { Navigation } from "../components/Navigation";
import { useRouter } from "next/router";
import Result from "../components/Result";
import { formatDate } from "../lib/utils";
import { MySpinner } from "../components/Spinner";

export default function PrayerRequest({ prayers }) {
  const nameRef = useRef();
  const requestRef = useRef()
  const { admin } = useRouter().query;
  const [result, setResult] = useState();
  

  return (
    <>
      <Navigation admin={admin} />
      <Result text={result} />
      <Row className="justify-content-md-center">
        <Col md="5" className="mb-5 col-md-8">
          <Card>
            <Card.Header>Request for prayer</Card.Header>
            <Card.Body>
              <FormControl
                className="mb-3"
                placeholder="Your name"
                ref={nameRef}
              />
              <FormControl
                className="mb-3"
                ref={requestRef}
                as="textarea"
                placeholder="Type your request"
              />
              <Button
                className="col-md-auto"
                onClick={async () => {
                  setResult(<MySpinner />);
                  setResult(await requestPrayer(nameRef.current.value, requestRef.current.value));
                  admin && prayers.unshift({
                    name: nameRef.current.value,
                    request: requestRef.current.value,
                    date: Date.now()
                  })
                  setResult()
                  nameRef.current.value = ''
                  requestRef.current.value = ''  
                }}
              >
                Request
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          {admin &&
            prayers.map((req, i) => (
              <Row key={i} className="mb-4">
                <Col className="justify-content-center">
                  <Card>
                    <Card.Body>
                      <Card.Title className='ml-2'>{req.name}</Card.Title>
                      <Card.Subtitle className='ml-2'>{formatDate(req.date)}</Card.Subtitle>
                      <Card.Text className='mt-3'>{req.request}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            ))}
        </Col>
      </Row>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const { admin } = query;
  if (admin)
    return {
      props: {
        prayers: await getRequests(),
      },
    };

  return {
    props: {},
  };
}
