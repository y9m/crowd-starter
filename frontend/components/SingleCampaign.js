import React, { Component } from 'react';
import { Layout, ContributeForm } from '../components';
import Campaign from '../../ethereum/campaign';
import { Card, Grid, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import { NavLink } from 'react-router-dom';

class SingleCampaign extends Component {
  state = {
    minimumContribution: 0,
    balance: 0,
    requests: 0,
    approvers: 0,
    owner: '',
    campaignName: ''
  };

  async componentDidMount() {
    const campaign = Campaign(this.props.match.params.address);
    const getSummary = campaign.methods.getSummary().call();
    const getCampaignName = campaign.methods.campaignName().call();

    const [summary, campaignName] = await Promise.all([
      getSummary,
      getCampaignName
    ]);

    this.setState({
      minimumContribution: summary[0],
      balance: summary[1],
      requests: summary[2],
      approvers: summary[3],
      owner: summary[4],
      campaignName
    });
  }

  renderCards() {
    const {
      balance,
      owner,
      minimumContribution,
      requests,
      approvers
    } = this.state;

    const items = [
      {
        header: owner,
        description:
          'The ownder created this campaign and can submit requests to withdraw money.',
        meta: 'Address of Manager',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: minimumContribution,
        description:
          'You must contribute at least this much wei to become an approver.',
        meta: 'Minimum Contribution (wei)'
      },
      {
        header: requests,
        description:
          'A request attempts to draw money from the contract. Requests must be approved by approvers.',
        meta: 'Number of Requests'
      },
      {
        header: approvers,
        description:
          'The number of people who have already donated to this campaign.',
        meta: 'Number of Approvers'
      },
      {
        header: web3.utils.fromWei(balance.toString(), 'ether'),
        description: 'The remaining amount of money the campaign has to spend.',
        meta: 'Campaign Balance (ether)'
      }
    ];

    return <Card.Group items={items} />;
  }

  render() {
    const { address } = this.props.match.params;
    return (
      <Layout>
        <h3>{this.state.campaignName}</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={address} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <NavLink to={`campaigns/${address}/requests`}>
                <Button primary>View Requests</Button>
              </NavLink>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default SingleCampaign;
