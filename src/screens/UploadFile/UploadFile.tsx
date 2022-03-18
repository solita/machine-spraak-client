import React, { ReactElement, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import * as AudioAnalysisService from "../../services/AudioAnalysisService";

const MAX_FILE_SIZE_BYTES = 6000000;
const SUPPORTED_FILE_TYPES = ["audio/wav", "audio/x-wav"];

const UploadFile = ():ReactElement=>{
    const [file, setFile] = useState<File| null>(null);
    const [response, setResponse] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSelectFile = (event:React.ChangeEvent) => {
      const target = event.target as HTMLInputElement;

      if(!target.files){
        return;
      }
      if (target.files[0].size > MAX_FILE_SIZE_BYTES) {
        setError(`Maximum file size is ${MAX_FILE_SIZE_BYTES} bytes`);
        handleReset();
        return;
      }
      if (!SUPPORTED_FILE_TYPES.includes(target.files[0].type)) {
        setError(`File type must be one of: ${SUPPORTED_FILE_TYPES}.`);
        handleReset();
        return;
      }
      setFile(target.files[0]);
      setResponse("");
      setError("");
    };
  
    const handleReset = () => {
      setFile(null);
    };
  
    const handleUpload = async () => {
      try {
        setLoading(true);
        const response = await AudioAnalysisService.postFile(file);
        setResponse(response);
      } 
      //#TODO: Replace any with a suitable matching type
      catch (error:any) {
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
                formEncType="multipart/form-data"
                size="lg"
                onChange={(event) => handleSelectFile(event)}
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
            <div className="mt-1">
              {loading && <Spinner animation="border" role="status" />}
            </div>
          </Col>
        </Row>
      </Container>
    );
};

export default UploadFile;
