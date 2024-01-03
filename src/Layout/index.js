import React from 'react';
import { Route, Switch } from "react-router-dom";
import Header from "./Header";
import NotFound from "./NotFound";
import Home from './Home';

function Layout() {
  return (
    <>
    <Header />
    <main className="container">
      {/* TODO: Implement the screen starting here */}
      <Switch>
        <Route exact={true} path="/">
          <Home />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </main>
  </>
  );
}

export default Layout;
