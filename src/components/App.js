import { useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import "./App.css";
import Amplify, { API } from "aws-amplify";

Amplify.configure({
  API: {
    endpoints: [
      {
        name: "machinespraak_api",
        endpoint: process.env.REACT_APP_API_URL,
      },
    ],
  },
});

const App = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef();

  const handleSelectFile = (event) => {
    setFile(event.target.files[0]);
    setResponse("");
    setError("");
  };

  const handleReset = () => {
    fileInputRef.current.value = "";
    setFile(null);
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      const response = await API.get("machinespraak_api", "/audio_analysis");
      setResponse(response);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
    setLoading(false);
    handleReset();
  };

  return (
    <Container fluid="md">
      <Row className="justify-content-center mt-5 mb-0">
        <Col md="10" xs="10">
          <Form.Group controlId="formFileLg" className="mb-3">
            <Form.Label>
              <h4>Upload a file</h4>
            </Form.Label>
            <Form.Control
              type="file"
              size="lg"
              onChange={(event) => handleSelectFile(event)}
              ref={fileInputRef}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="justify-content-center mt-2 mb-0">
        <Col md="10" xs="10">
          <div>
            <pre>
              {file && <button onClick={handleUpload}>Upload</button>}{" "}
              {file && file.name + " " + file.size + " bytes"}
              {file && file.type && ", " + file.type}
              {response}
              {error}
            </pre>
          </div>
          <div className="mt-1">{loading && <Spinner animation="border" role="status" />}</div>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
