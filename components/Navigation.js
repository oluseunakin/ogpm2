import Head from "next/head";
import { Navbar, Nav } from "react-bootstrap";
import styles from "./navigation.module.css";

export function Navigation({ admin }) {
  const ad = admin ? "?admin=" + admin : " ";
  const add = admin? "lucas" : ''
  return (
    <>
      <Head>
        <title>Oracle of God Prophetic Ministry</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar expand="md" collapseOnSelect={true} className='mb-4' >
        <Navbar.Brand href={"/" + add}>
          <h5 className={styles.home}>Oracle of God Prophetic Ministry</h5>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className='btn-primary'/>
        <Navbar.Collapse >
          <Nav fill style={{ width: "100%" }}>
            <Nav.Link href={"/about" + ad} className="text-warning">
              About
            </Nav.Link>
            <Nav.Link href={"/prayerequests" + ad} className="text-warning">
              Prayer Requests
            </Nav.Link>
            <Nav.Link href={"/devotions" + ad} className="text-warning">
              Devotions
            </Nav.Link>
            <Nav.Link href={"/testimonies" + ad} className="text-warning">
              Testimonies
            </Nav.Link>
            <Nav.Link href={"/news" + ad} className="text-warning">
              News/Events
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}
