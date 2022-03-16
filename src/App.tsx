import React from "react";
import UploadFileScreen from "./screens/UploadFile/UploadFile";
import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<UploadFileScreen/>}/>
        </Routes>
    </Router>
  );
};
export default App;