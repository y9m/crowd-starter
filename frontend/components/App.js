import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { AllCampaigns, NewCampaignForm } from '../components';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/campaigns" component={AllCampaigns} />
          <Route path="/campaigns/new" component={NewCampaignForm} />
          <Redirect to="/campaigns" />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
