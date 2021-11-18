import { useState, useRef } from "react";
import {
  getTestimonies,
  shareTestimony,
  testimonyByDay,
  testimonyByName,
} from "../lib/testimony";
import { formatDate, checkMedia } from "../lib/utils";
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
import { Testimony } from "../components/Testimony";
import { Navigation } from "../components/Navigation";
import { useRouter } from "next/router";
import { MySpinner } from "../components/Spinner";
import Result from "../components/Result";

export default function TestimonyComp({ oldTests }) {
  const fileInput = useRef();
  const testimonyRef = useRef();
  const [muchMedia, setMuchMedia] = useState(false);
  const testifierRef = useRef();
  const descRef = useRef();
  const nameRef = useRef();
  const dateRef = useRef();
  const [data, setData] = useState(oldTests);
  const { admin } = useRouter().query;
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Navigation admin={admin} />
      <Result text={result} />
      <Row className='mb-3'>
        <Col>
          <Row className="mb-3">
            <Col md={6} className="mb-2">
              <InputGroup>
                <FormControl
                  placeholder="Search by member's name"
                  ref={nameRef}
                  onChange={(e) => {
                    if (e.currentTarget.value === "") setData(oldTests);
                  }}
                />
                <InputGroup.Append>
                  <Button
                    variant="secondary"
                    aria-label="Search for testimony by name"
                    onClick={async () => {
                      setResult(<MySpinner />);
                      setData(await testimonyByName(nameRef.current.value));
                      setResult();
                    }}
                  >
                    <BsSearch />
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Col>
            <Col md={6} className="mb-2">
              <InputGroup>
                <FormControl
                  type="date"
                  defaultValue={formatDate(Date.now(), "-")}
                />
                <InputGroup.Append>
                  <Button
                    variant="secondary"
                    aria-label="Search for a testimony"
                    onClick={async (e) => {
                      setResult(<MySpinner />);
                      setData(
                        await testimonyByDay(
                          Math.floor(
                            dateRef.current.valueAsDate.getTime() /
                              (1000 * 60 * 60 * 24)
                          )
                        )
                      );
                      setResult();
                    }}
                  >
                    <BsSearch />
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Card>
                <Card.Header>Share your testimony</Card.Header>
                <Card.Body>
                  <FormControl
                    className="mb-3"
                    placeholder="Your name"
                    ref={testifierRef}
                  />
                  <FormControl
                    className="mb-3"
                    placeholder="What the Lord has done for you"
                    ref={descRef}
                  />
                  <FormControl
                    className="mb-3"
                    as="textarea"
                    ref={testimonyRef}
                    placeholder="Your testimony to the glory of the Lord"
                  />
                  <Form.File className="mb-3" multiple ref={fileInput} />
                  {muchMedia && (
                    <span>
                      You are trying to upload more than the max allowed
                    </span>
                  )}
                  <Button
                    className="col-auto"
                    disabled={loading}
                    onClick={async () => {
                      const media = checkMedia(fileInput.current.files);
                      if (typeof media === "string") {
                        setMuchMedia(true);
                        fileInput.current.value = "";
                      } else {
                        setLoading(true);
                        const newTest = await shareTestimony({
                          testifier: testifierRef.current.value,
                          testimony: testimonyRef.current.value,
                          media,
                          desc: descRef.current.value,
                          date: Math.floor(Date.now() / (1000 * 60 * 60 * 24)),
                        });

                        setLoading(false);
                        setMuchMedia(false);
                        setData([newTest, ...data]);
                        testifierRef.current.value = "";
                        testimonyRef.current.value = "";
                        fileInput.current.value = "";
                        descRef.current.value = "";
                      }
                    }}
                  >
                    {loading ? <MySpinner /> : "Share your Testimony"}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      {data.map((t, i) => (
        <Testimony
          key={i}
          testifier={t.testifier}
          testimony={t.testimony}
          date={t.date}
          desc={t.desc}
          gallery={t.minGallery}
        />
      ))}
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      oldTests: await getTestimonies(),
    },
  };
}
