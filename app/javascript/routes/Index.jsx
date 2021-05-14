import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/Home";
import Assets from "../components/Assets";
import AddAsset from "../components/AddAsset";

export default (
  <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/assets" exact component={Assets} />
      <Route path="/addasset" exact component={AddAsset} />
    </Switch>
  </Router>
);