import { Spinner } from "react-bootstrap";

export function MySpinner() {
  return (
    <Spinner
      animation="border"
      role="status"
      className="d-flex justify-content-center"
    >
      <span className="sr-only">Loading...</span>
    </Spinner>
  );
}
