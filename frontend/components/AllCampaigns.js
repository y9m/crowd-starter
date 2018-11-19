import React, { Component } from 'react';
import factory from '../../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import { Layout } from '../components';

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
        description: <a href={`campaigns/${address}`}>View Campaign</a>,
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Open Campaigns</h3>
        <a href="campaigns/new">
          <Button
            floated="right"
            content="Create Campaign"
            icon="add circle"
            primary
          />
        </a>
        {this.renderCampaigns()}
      </Layout>
    );
  }
}

export default AllCampaigns;
