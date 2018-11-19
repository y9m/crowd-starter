import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { AllCampaigns } from '../components';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/campaigns" component={AllCampaigns} />
          <Redirect to="/campaigns" />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
