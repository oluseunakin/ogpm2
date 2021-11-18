import { Card, Row, Col } from "react-bootstrap";
import { getAbout } from "../lib/utils";
import MediaComp from "../components/Media";
import { EditAbout } from "../components/EditAbout";
import { useRouter } from "next/router";
import { Navigation } from "../components/Navigation";
import { useState } from "react";
import Result from "../components/Result";
import Head from "next/head";

export default function About({ old }) {
  const { admin } = useRouter().query;
  const [result, setResult] = useState()
  const [data, setData] = useState(old)
  return (
    <>
      <Result text={result} />
      <Navigation admin={admin} />
      <Row>
        <Col>
          {admin && <EditAbout result={setResult} setData={setData} oldAbout={data}/>}
          {data && (
            <Row className="mb-3">
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Text>{data.about}</Card.Text>
                    {data.gallery && <MediaComp media={data.gallery} />}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </>
  );
}

export async function getServerSideProps() {
  
  return {
    props: {
      old: await getAbout(),
    },
  };
}
