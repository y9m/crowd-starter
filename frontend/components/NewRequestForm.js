import React, { Component } from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import { NavLink } from 'react-router-dom';
import { Layout } from '../components';

class NewRequestForm extends Component {
  state = {
    value: '',
    description: '',
    recipient: '',
    loading: false,
    errorMessage: ''
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });

    try {
      const { description, value, recipient } = this.state;
      const { address } = this.props.match.params;

      const campaign = Campaign(address);
      const accounts = await web3.eth.getAccounts();

      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({ from: accounts[0] });

      this.setState({ loading: false });
      this.props.history.push(`/campaigns/${address}/requests`);
    } catch (err) {
      this.setState({ loading: false, errorMessage: err.message });
    }
  };

  render() {
    return (
      <Layout>
        <NavLink to={`/campaigns/${this.props.match.params.address}/requests`}>
          Back
        </NavLink>
        <h3>Create a Request</h3>
        <Form onSubmit={this.handleSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={event =>
                this.setState({ description: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Value</label>
            <Input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
              label="ether"
              labelPosition="right"
            />
          </Form.Field>
          <Form.Field>
            <label>Recipient</label>
            <Input
              value={this.state.recipient}
              onChange={event =>
                this.setState({ recipient: event.target.value })
              }
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Create
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default NewRequestForm;
