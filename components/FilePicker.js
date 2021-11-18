import { Button, Form } from "react-bootstrap";

export const FilePicker = ({ ref }) => {
  return (
    <>
      <Form.Label htmlFor='file' style={{
          
      }}>Add Pictures and Videos</Form.Label>
      <Form.Control type='file' ref={ref} multiple hidden id='file'></Form.Control>
    </>
  );
};
