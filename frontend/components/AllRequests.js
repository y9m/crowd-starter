import React, { Component } from 'react';
import { Layout, SingleRequest } from '../components';
import { Button, Table } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import Campaign from '../../ethereum/campaign';

class AllRequests extends Component {
  state = {
    approversCount: 0,
    requests: []
  };

  async componentDidMount() {
    const campaign = Campaign(this.props.match.params.address);
    const requestCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    const requests = await Promise.all(
      Array(Number(requestCount))
        .fill()
        .map((element, index) => campaign.methods.requests(index).call())
    );

    this.setState({ requests, approversCount });
  }

  renderSingleRequest() {
    const { requests, approversCount } = this.state;
    const { address } = this.props.match.params;

    return requests.map((request, index) => {
      return (
        <SingleRequest
          key={index}
          request={request}
          address={address}
          id={index}
          approversCount={approversCount}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;
    const { address } = this.props.match.params;

    return (
      <Layout>
        <NavLink to={`/campaigns/${address}`}>Back</NavLink>
        <h3>Requests</h3>
        <NavLink to={`/campaigns/${address}/requests/new`}>
          <Button primary>New Request</Button>
        </NavLink>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderSingleRequest()}</Body>
        </Table>
      </Layout>
    );
  }
}

export default AllRequests;
