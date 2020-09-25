import React from "react";
import Home from "./App";
import Pdf from "./Pdf";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

export default () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/pdf" component={Pdf} />
      </Switch>
    </Router>
  );
};
