import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Jobs from "./pages/job/Jobs";
import Popular from "./pages/popular/Popular";

const App = () => {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" render={() => <Jobs />} />
          <Route exact path="/jobs" render={() => <Jobs />} />
          <Route path="/popular" render={() => <Popular />} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
