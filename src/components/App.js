import { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
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

  const handleSelectFile = (event) => {
    setFile(event.target.files[0]);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get("machinespraak_api", "/audio_analysis");
      console.log(res);
    };
    console.log("API_URL: ", process.env.REACT_APP_API_URL);
    fetchData();
  }, [file]);

  return (
    <Container fluid="md">
      <Row className="justify-content-center mt-5 mb-0">
        <Col md="10" xs="10">
          <Form.Group controlId="formFileLg" className="mb-3">
            <Form.Label>
              <h4>Choose data to analyze</h4>
            </Form.Label>
            <Form.Control
              type="file"
              size="lg"
              onChange={(event) => handleSelectFile(event)}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="justify-content-center mt-0 mb-0">
        <Col md="10" xs="10">
          <div>
            <pre>
              {file && file.size + " bytes"}
              <br />
              {file && file.type}
            </pre>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
