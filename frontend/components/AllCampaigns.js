import React, { Component } from 'react';
import factory from '../../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import { Layout } from '../components';
import { NavLink } from 'react-router-dom';

class AllCampaigns extends Component {
  state = {
    campaigns: []
  };

  async componentDidMount() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    this.setState({ campaigns });
  }

  renderCampaigns() {
    const { campaigns } = this.state;
    const items = campaigns.map(address => {
      return {
        header: address,
        description: (
          <NavLink to={`/campaigns/${address}`}>View Campaign</NavLink>
        ),
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Open Campaigns</h3>
        <NavLink to="/campaigns/new">
          <Button
            floated="right"
            content="Create Campaign"
            icon="add circle"
            primary
          />
        </NavLink>
        {this.renderCampaigns()}
      </Layout>
    );
  }
}

export default AllCampaigns;
