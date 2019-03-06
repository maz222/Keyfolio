import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {NavLink, Switch} from 'react-router-dom'
import './App.css';

import './AppStyle.css';

import SearchPage from './PageComponents/SearchPage.js';
import CardPage from './PageComponents/CardPage.js';
import DeckPage from './PageComponents/DeckPage.js';
import LandingPage from './PageComponents/LandingPage.js'

const routeURLs = {
  home: '/',
  cardSearch: '/cards',
  cardDetails: '/cards/cardDetails',
  deckSearch: '/decks'
}

class App extends Component {
  render() {
    const aLink = "activeLink";
      return (
      <Router>
        <div className="App">
          <div id="banner">
              <h1>KeyFolio</h1>
              <div className="navBar">
                <NavLink exact activeClassName={aLink} to="/">Home</NavLink>
                <NavLink activeClassName={aLink} to="/cards">Cards</NavLink>
                <NavLink activeClassName={aLink} to="/decks">Decks</NavLink>
              </div>
          </div>
          <div id="content">
            <Switch>
              <div style={{width:"100%",height:"100%"}}>
                  <Route exact path={routeURLs.home} component={LandingPage} />
                  <Route exact path={routeURLs.cardSearch} render={(routeProps) => <SearchPage {...routeProps } {...{qBase:routeURLs.cardSearch + "?"}}/>} />
                  <Route path={routeURLs.cardDetails} component={(routeProps) => <CardPage {...routeProps} {...{qBase:routeURLs.cardDetails + "?"}}/>} />
                  <Route path={routeURLs.deckSearch} component={(routeProps) => <DeckPage {...routeProps} {...{qBase:routeURLs.deckSearch + "?"}}/>} />
              </div>          
            </Switch>
          </div>
        </div>
      </Router>
      );
    }
} 

export default App;