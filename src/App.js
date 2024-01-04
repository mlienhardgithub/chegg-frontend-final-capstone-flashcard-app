import React from "react";
import { Route, Switch } from "react-router-dom";
import Layout from "./Layout";
import "./App.css";
import NotFound from "./Layout/NotFound";
import Decks from "./Layout/Decks";
import CreateDeck from "./Layout/CreateDeck";

/**
 * App is a wrapper for <Layout>, you should not need to change this file.
 */

function App() {
  return (
    <div className="app-routes">
      <Switch>
        <Route exact={true} path="/">
          <Layout />
        </Route>
        <Route path="/decks/new">
          <Layout />
        </Route>
        <Route path="/decks/:deckId">
          <Layout />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
