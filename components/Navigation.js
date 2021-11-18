import Head from "next/head";
import { Fragment } from "react";
import { Navbar, Nav } from "react-bootstrap";
import styles from "./navigation.module.css";

export function Navigation({ admin }) {
  const ad = admin ? "?admin=" + admin : " ";
  return (
    <>
      <Head>
        <title>Oracle of God Prophetic Ministry</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar expand="md" collapseOnSelect={true} className='mb-4' >
        <Navbar.Brand href={"/" + ad}>
          <h5 className={styles.home}>Oracle of God Prophetic Ministry</h5>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className={styles.menubtn}/>
        <Navbar.Collapse >
          <Nav fill style={{ width: "100%" }}>
            <Nav.Link href={"/about" + ad} className="text-primary">
              About
            </Nav.Link>
            <Nav.Link href={"/prayerequests" + ad} className="text-primary">
              Prayer Requests
            </Nav.Link>
            <Nav.Link href={"/devotions" + ad} className="text-primary">
              Devotions
            </Nav.Link>
            <Nav.Link href={"/testimonies" + ad} className="text-primary">
              Testimonies
            </Nav.Link>
            <Nav.Link href={"/news" + ad} className="text-primary">
              News/Events
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}
