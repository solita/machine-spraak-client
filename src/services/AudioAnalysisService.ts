import Amplify, { API } from "aws-amplify";
import {UNEXPECTED_SERVER_ERROR} from "./common";

const MACHINE_SPRAAK_API_NAME = "machinespraak_api";

const RESOURCES = {
  AudioAnalysisResource:
    {
      name: MACHINE_SPRAAK_API_NAME ,
      endpoint: process.env.REACT_APP_API_URL,
    }
};

Amplify.configure({
    API: {
      endpoints: [
        RESOURCES.AudioAnalysisResource,
      ],
    },
});

//TODO: Change the type "any" to appropriate type
async function postFile(file:any):Promise<string>{
  try{
    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_name", file.name);
    const content = {
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    return await API.post(RESOURCES.AudioAnalysisResource.name, "/audio_analysis",content);
  }
  catch{
      return UNEXPECTED_SERVER_ERROR;
  }
};
export  {postFile};