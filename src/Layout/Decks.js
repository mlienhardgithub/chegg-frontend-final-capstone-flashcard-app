import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import Header from "./Header";
import Deck from "./Deck";
import Study from "./Study";
import EditDeck from "./EditDeck";
import AddCard from "./AddCard";
import EditCard from "./EditCard";

export default function Decks() {
    const { url, path } = useRouteMatch();
    console.log('Decks routeMatchOutput', useRouteMatch());

    return (
        <>
            <Header />
            <main className="container">
                <div className="card">
                    <div className="card-body">
                        <Switch>
                            <Route exact={true} path={path}>
                                <Deck />
                            </Route>
                            {/* TODO: Implement the screen starting here */}
                            <Route path={`${path}/study`}>
                                <Study />
                            </Route>
                            <Route path={`${path}/edit`}>
                                <EditDeck />
                            </Route>
                            <Route path={`${path}/cards/:cardId/edit`}>
                                <EditCard />
                            </Route>
                            <Route path={`${path}/cards/new`}>
                                <AddCard />
                            </Route>
                        </Switch>
                    </div>
                </div>
            </main>
        </>
    );
};
