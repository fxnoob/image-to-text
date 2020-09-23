import React, { useEffect, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import messagePassingService from "../../services/messagePassing";
import Home from "./Home";
import WindTurbineAnimation from "../../assets/WindTurbine";
import Loader from "./Loader";
import ErrorComponent from "./Error";

const queryString = require("query-string");
const parsed = queryString.parse(location.search);
const urlString = decodeURIComponent(parsed.url ? parsed.url : "");

function App() {
  const [ocr, setOcr] = useState("Recognizing...");
  const [err, setError] = useState("");
  const [url, setUrl] = useState(urlString);
  const [loading, setLoading] = useState(true);
  const doOCR = async () => {
    setUrl(urlString);
    messagePassingService.sendMessage("/recognize", { url: url }, response => {
      console.log({ response });
      const { status, error, data } = response;
      if (url == response.url) {
        if (status == "SUCCESS") {
          setOcr(data);
        } else {
          setError("Error!");
          setOcr("Error Occurred!");
        }
        setLoading(false);
      }
    });
  };
  useEffect(() => {
    doOCR();
  });
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        {loading ? (
          <Loader json={WindTurbineAnimation} text="loading..." />
        ) : err != "" ? (
          <ErrorComponent text="" />
        ) : (
          <Home ocrText={ocr} url={url} />
        )}
      </Container>
    </React.Fragment>
  );
}

export default App;
