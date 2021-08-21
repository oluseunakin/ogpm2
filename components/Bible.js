import {
  Card,
  Row,
  Col,
  Button,
  Spinner,
} from "react-bootstrap";
import Bible from "../lib/Bible";
import { useState } from "react";

function BibleChapter({ c, book, setData }) {
  return (
    <Card className="my-2">
      <Card.Header>
        <Row>
          <Col className="justify-content-center d-flex">
            <h4>{c.reference}</h4>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body dangerouslySetInnerHTML={{ __html: c.content }}></Card.Body>
      <Card.Footer>
        <Row>
          {c.previous && (
            <Col className="d-flex justify-content-end">
              <Button
                onClick={async () => {
                  setData(null);
                  const cc = (
                    await new Bible().getChapter(book.bibleId, c.previous.id)
                  ).data;
                  setData(
                    <BibleChapter setData={setData} c={cc} book={book} />
                  );
                }}
              >
                Prev
              </Button>
            </Col>
          )}
          {c.next && (
            <Col className="d-flex justify-content-end">
              <Button
                onClick={async () => {
                  setData(null);
                  const cc = (
                    await new Bible().getChapter(book.bibleId, c.next.id)
                  ).data;
                  setData(
                    <BibleChapter setData={setData} c={cc} book={book} />
                  );
                }}
              >
                Next
              </Button>
            </Col>
          )}
        </Row>
      </Card.Footer>
    </Card>
  );
}

function BibleVerses({ book, setData, verses, admin }) {
  return (
    <select
      className="form-control mt-2"
      onChange={async (e) => {
        if (admin) {
          const b = verses.filter((verse) => e.target.value == verse.id)[0];
          admin((old) => [...old, b]);
        } else {
          const verse = (
            await new Bible().getVerse(book.bibleId, e.target.value)
          ).data;
          setData(
            <BibleVerse
              verse={verse}
              close={() =>
                setData(
                  <BibleVerses book={book} setData={setData} verses={verses} />
                )
              }
            />
          );
        }
      }}
    >
      <option>Select Verse</option>
      {verses.map((verse, i) => (
        <option key={i} value={verse.id}>
          {++i}
        </option>
      ))}
    </select>
  );
}

export function BibleVerse({ verse, close }) {
  return (
    <Card className="mt-2">
      <Card.Header className="d-flex justify-content-end">
        <Button variant="danger" onClick={() => close()}>
          x
        </Button>
      </Card.Header>
      <Card.Body>
        <Card.Text
          dangerouslySetInnerHTML={{ __html: verse.content }}
        ></Card.Text>
      </Card.Body>
    </Card>
  );
}

export function BibleBooks({ books, admin }) {
  const [chapters, setChapters] = useState();
  const [data, setData] = useState();
  const [book, setBook] = useState({ bibleId: "", id: "" });

  return (
    <Card>
      <Card.Header>Read the Bible</Card.Header>
      <Card.Body>
        <Row>
          <Col>
            <select
              className="form-control"
              onChange={async (e) => {
                setChapters("");
                const b = books.filter((book) => e.target.value == book.id)[0];
                setBook({ ...book, bibleId: b.bibleId, id: b.id });
                setChapters(
                  (await new Bible().getChapters(b.bibleId, b.id)).data
                );
              }}
            >
              <option>Select Book</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </Col>
        </Row>

        {chapters &&
          (chapters !== "" ? (
            <Row>
              <Col>
                <select
                  className="form-control mt-2"
                  onChange={(e) => {
                    setData("");
                    const chapter = e.target.value;
                    if (admin) {
                      seeAll(false, chapter, book, setData, admin);
                    } else {
                      setData(
                        <Row className="mt-2">
                          <Col>
                            Read whole chapter?{" "}
                            <Button
                              onClick={async () =>
                                await seeAll(true, chapter, book, setData)
                              }
                              className="mx-3"
                            >
                              Yes
                            </Button>
                            <Button
                              onClick={async () =>
                                await seeAll(false, chapter, book, setData)
                              }
                            >
                              No
                            </Button>
                          </Col>
                        </Row>
                      );
                    }
                  }}
                >
                  <option>Select Chapter</option>
                  {chapters.map((chapter, i) => (
                    <option key={i} value={chapter.id}>
                      {chapter.number}
                    </option>
                  ))}
                </select>
              </Col>
            </Row>
          ) : (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          ))}
        {data &&
          (data !== "" ? (
            data
          ) : (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          ))}
      </Card.Body>
    </Card>
  );
}

async function seeAll(seeVerses, chapter, book, setData, admin) {
  if (seeVerses) {
    setData("");
    const c = (await new Bible().getChapter(book.bibleId, chapter)).data;
    setData(<BibleChapter c={c} book={book} setData={setData} />);
  } else {
    setData("");
    const verses = (await new Bible().getVerses(book.bibleId, chapter)).data;
    setData(
      <BibleVerses
        book={book}
        setData={setData}
        verses={verses}
        admin={admin}
      />
    );
  }
}
