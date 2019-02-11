import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';

import './AppStyle.css';

import SearchPage from './PageComponents/SearchPage.js';
import CardPage from './PageComponents/CardPage.js';

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
      return (
      <div className="App">
        <div id="banner">
            <h1>KeyFolio</h1>
        </div>
        <div id="content">
          <Router>
            <div style={{width:"100%",height:"100%"}}>
                <Route exact path='/' component={SearchPage} />
                <Route path='/cardDetails' component={CardPage} />
            </div>          
          </Router>
        </div>
      </div>
      );
    }
} 

export default App;