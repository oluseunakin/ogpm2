import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/scriptures.css";
import Layout from "../components/Layout";
import { Error } from "../components/Error";
import "../styles/style.css"

function MyApp({ Component, pageProps }) {
  return (
    <Error>
      <Layout>
        <Component {...pageProps} />
      </Layout>{" "}
    </Error>
  );
}

export default MyApp;
