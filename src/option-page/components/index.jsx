import React, { useEffect, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Home from "./Home";
import WindTurbineAnimation from "../../assets/WindTurbine";
import Loader from "./Loader";
const queryString = require("query-string");

function App() {
  const [ocr, setOcr] = useState("Recognizing...");
  const [err, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const doOCR = async () => {
    const parsed = queryString.parse(location.search);
    const url = parsed.url
      ? parsed.url
      : "https://images.unsplash.com/photo-1569229569803-69384f5efa83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80";
    chrome.runtime.sendMessage({ path: "/recognize", url: url }, response => {
      const { status, error, data } = response;
      if (status == "SUCCESS") {
        setOcr(data);
      } else {
        setOcr("Error Occurred!");
      }
      setLoading(false);
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
          <div />
        ) : (
          <Home ocrText={ocr} />
        )}
      </Container>
    </React.Fragment>
  );
}

export default App;
