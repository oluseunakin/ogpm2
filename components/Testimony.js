import { useState, useRef} from "react";
import {shareTestimony, testimonyByDay, testimonyByName } from "../lib/testimony";
import { formatDate } from "../lib/utils";
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
import MediaComp from "./Media";

export function Testimony({ testimony, desc, testifier, date, gallery}) {
  
  return (
    <Row className="mb-4">
      <Col>
        <Card>
          <Card.Body>
            <Card.Title>{testifier}</Card.Title>
            <Card.Subtitle>
              <p>{desc}</p>
              <p className='text-muted'>{formatDate(date)}</p>
            </Card.Subtitle>
             
            <Card.Text>{testimony}</Card.Text>
            {gallery && <MediaComp media={gallery} screen="small" /> }
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export function TestimonyComp({result, oldTests, setData}) {

  const [testimony, setTestimony] = useState({
    testimony : '', testifier : '', desc : '', date : ''
  });
  const fileInput = useRef();
  const [name, setName] = useState("");
  const [searchDate, setSearchDate] = useState()
  const [loading, setLoading] = useState(false)

  return (
    <Row>
      <Col>
        <Row className="mb-3">
          <Col md={6} className="mb-2">
            <InputGroup>
              <FormControl
                value={name}
                placeholder="Search by member's name"
                onChange={(e) => {
                  const value = e.currentTarget.value
                  if(value === '') setData(oldTests.map((t,i) => <Testimony key={i} testifier={t.testifier}
                    testimony={t.testimony} date={t.date} desc={t.desc} gallery={t.gallery} />))
                  setName(e.currentTarget.value)
                }}
              />
              <InputGroup.Append>
                <Button
                  variant="outline-dark"
                  aria-label="Search for testimony by name"
                  onClick={async () => {
                    setData(null);
                    setData((await testimonyByName(name)).map((t,i) => <Testimony key={i} testifier={t.testifier}
                    testimony={t.testimony} date={t.date} desc={t.desc} gallery={t.gallery} />));
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
                defaultValue={formatDate(new Date().getTime(),'-')}
                onChange={(e) => {
                  setSearchDate(e.currentTarget.valueAsDate.getTime()/(1000*60*60*24))
                }}
              />
              <InputGroup.Append>
                <Button
                  variant="outline-dark"
                  aria-label="Search for a testimony"
                  onClick={async (e) => {
                    setData(null);
                    setData((await testimonyByDay(searchDate)).map((t,i) => <Testimony key={i} testifier={t.testifier}
                    testimony={t.testimony} date={t.date} desc={t.desc} gallery={t.gallery} />));
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
            <FormControl
              placeholder="Your name"
              value={testimony.testifier}
              onChange={(e) =>
                setTestimony({...testimony,testifier: e.currentTarget.value, date: Date.now()/(1000*60*60*24)})
              }
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <FormControl
              placeholder="What the Lord has done for you"
              value={testimony.desc}
              onChange={(e) => setTestimony({ ...testimony, desc: e.currentTarget.value })}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <FormControl
              as="textarea"
              value={testimony.testimony}
              onChange={(e) => {setTestimony({...testimony, testimony: e.currentTarget.value})}}
              placeholder="Your testimony to the glory of the Lord"
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.File
              multiple
              ref={fileInput}
              onChange={(e) => {
                setTestimony({
                  ...testimony,
                  media: fileInput.current.files,
                });
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              className="col-md-3"
              disabled={loading}
              onClick={async () => {
                setData(null)
                setLoading(true)
                const newTestimony = await shareTestimony(testimony)
                setLoading(false)
                newTestimony ? result('Success') : result("Can't share testimony now, try again later");
                setData([...oldTests, newTestimony].map((t,i) => <Testimony key={i} testifier={t.testifier}
                  testimony={t.testimony} date={t.date} desc={t.desc} gallery={t.gallery} />))
                result('')
              }}
            >
              {loading? 'Sharing...' : 'Share your Testimony' }
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
