import { Card, Row, Col, Button } from "react-bootstrap";
import { MySpinner } from "./Spinner";
import Bible from "../lib/Bible";
import { useState } from "react";
import { bibleTypes } from "../lib/utils";

function BibleChapter({ c, book, setData, handleClose }) {
  return (
    <Card className="my-2">
      <Card.Header>
        <Row>
          <Col className="justify-content-center d-flex">
            <h4>{c.reference}</h4>
          </Col>
          <Col className="justify-content-end d-flex">
            <Button variant="danger" onClick={handleClose}>
              x
            </Button>
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
                  setData("loading");
                  const cc = (
                    await new Bible().getChapter(book.bibleId, c.previous.id)
                  ).data;
                  setData(
                    <BibleChapter
                      setData={setData}
                      c={cc}
                      book={book}
                      handleClose={handleClose}
                    />
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
                  setData("loading");
                  const cc = (
                    await new Bible().getChapter(book.bibleId, c.next.id)
                  ).data;
                  setData(
                    <BibleChapter
                      setData={setData}
                      c={cc}
                      book={book}
                      handleClose={handleClose}
                    />
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

function BibleVerses({ book, verses, admin, handleClose }) {
  const [verse, setVerse] = useState();
  return (
    <>
      <select
        className="form-control mt-2"
        onChange={async (e) => {
          if (admin) {
            const b = verses.filter((verse) => e.target.value == verse.id)[0];
            admin((old) => [...old, b]);
          } else {
            setVerse(<MySpinner />)
            const verse = (
              await new Bible().getVerse(book.bibleId, e.target.value)
            ).data;
            setVerse(
              <BibleVerse
                verse={verse}
                close={handleClose}
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
      {verse}
    </>
  );
}

export function BibleVerse({ verse, close }) {
  return (
    <Card className="mt-2">
      <Card.Header className="d-flex justify-content-end">
        <Button variant="danger" onClick={close}>
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
function BibleChapters({ chapters, admin, book, setData, handleClose }) {
  const [chapter, setChapter] = useState()
  return (
    <>
      <select
        className="form-control mt-2"
        onChange={(e) => {
          const ch = e.target.value;
          setChapter(<MySpinner />)
          if (admin) {
            seeAll(false, ch, book, setChapter, admin);
          } else {
            setChapter(
              <Row className="mt-2">
                <Col>
                  Read whole chapter?{" "}
                  <Button
                    onClick={async () =>
                      await seeAll(true, ch, book, setData, false, handleClose)
                    }
                    className="mx-3"
                  >
                    Yes
                  </Button>
                  <Button
                    onClick={async () => await seeAll(false, ch, book, setData, false, handleClose)}
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
      {chapter}
    </>
  );
}

export function BibleBooks({ books, admin, setData, handleClose }) {
  const [chapters, setChapters] = useState();
  return (
    <>
      <select
        className="form-control"
        onChange={async (e) => {
          setChapters(<MySpinner />);
          const book = books.filter((book) => e.target.value == book.id)[0];
          const c = (await new Bible().getChapters(book.bibleId, book.id)).data;
          setChapters(
            <BibleChapters
              chapters={c}
              admin={admin}
              book={book}
              setData={setData}
              handleClose={handleClose}
            />
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
      {chapters}
    </>
  );
}

async function seeAll(seeVerses, chapter, book, setData, admin, handleClose) {
  if (seeVerses) {
    const c = (await new Bible().getChapter(book.bibleId, chapter)).data;
    setData(
      <BibleChapter
        c={c}
        book={book}
        setData={setData}
        handleClose={handleClose}
      />
    );
  } else {
    const verses = (await new Bible().getVerses(book.bibleId, chapter)).data;
    setData(
      <BibleVerses
        book={book}
        verses={verses}
        admin={admin}
        handleClose={handleClose}
      />
    );
  }
}

export function Bibeli({ setData, old }) {
  const [selected, setSelected] = useState();

  function close() {
    setSelected();
    setData(old);
  }
  return (
    <Card>
      <Card.Header>Read the Bible</Card.Header>
      <Card.Body>
        <select
          className="form-control mb-3"
          onChange={async (e) => {
            setSelected(<MySpinner />);
            const data = (await new Bible().getBooks(e.target.value)).data;
            setSelected(
              <BibleBooks books={data} setData={setData} handleClose={close} />
            );
          }}
        >
          {bibleTypes()}{" "}
        </select>
        {selected}
      </Card.Body>
    </Card>
  );
}
