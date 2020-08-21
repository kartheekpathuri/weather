import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import Current from "./Current";
import Forecast from "./Forecast";
import Navbar from "./Navbar";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route path="/" component={Current} exact />
        <Route path="/forecast" component={Forecast} />
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
