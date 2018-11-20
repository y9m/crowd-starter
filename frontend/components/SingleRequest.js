import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import Campaign from '../../ethereum/campaign';
import { withRouter } from 'react-router';

class SingleRequest extends Component {
  state = {
    approveLoading: false,
    finalizeLoading: false,
    hasVoted: false
  };

  async componentDidMount() {
    const { address, id } = this.props;
    const accounts = await web3.eth.getAccounts();
    const campaign = Campaign(address);

    const hasVoted = await campaign.methods.hasVoted(id, accounts[0]).call();
    this.setState({ hasVoted });
  }

  handleApprove = async () => {
    this.setState({ approveLoading: true });

    const { address, id } = this.props;
    const accounts = await web3.eth.getAccounts();
    const campaign = Campaign(address);

    await campaign.methods.approveRequest(id).send({
      from: accounts[0]
    });

    this.setState({ approveLoading: false });
    this.props.history.push(`/campaigns/${address}/requests`);
  };

  handleFinalize = async () => {
    this.setState({ finalizeLoading: true });

    const { address, id } = this.props;
    const accounts = await web3.eth.getAccounts();
    const campaign = Campaign(address);

    await campaign.methods.finalizeRequest(id).send({
      from: accounts[0]
    });

    this.setState({ finalizeLoading: false });
    this.props.history.push(`/campaigns/${address}/requests`);
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;
    const readyToFinalize =
      Number(request.approvalCount) > Number(approversCount) / 2;

    return (
      <Row disabled={request.complete}>
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.approvalCount}/{approversCount}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              loading={this.state.approveLoading}
              color="green"
              onClick={this.handleApprove}
              disabled={this.state.hasVoted}
            >
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              loading={this.state.finalizeLoading}
              color="teal"
              disabled={!readyToFinalize}
              onClick={this.handleFinalize}
              primary={readyToFinalize && !!request.complete}
            >
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default withRouter(SingleRequest);
