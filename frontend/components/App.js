import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { AllCampaigns, NewCampaignForm, SingleCampaign } from '../components';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/campaigns" component={AllCampaigns} />
          <Route exact path="/campaigns/new" component={NewCampaignForm} />
          <Route exact path="/campaigns/:address" component={SingleCampaign} />
          <Redirect to="/campaigns" />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
