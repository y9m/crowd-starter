import React, { Component } from 'react';
import { Layout } from '../components';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

class NewCampaignForm extends Component {
  state = {
    campaignName: '',
    minimumContribution: '',
    loading: false,
    errorMessage: ''
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(this.state.campaignName, this.state.minimumContribution)
        .send({
          from: accounts[0]
        });

      this.setState({ loading: false });
      console.log('campaign form props', this.props);
      this.props.history.push('/campaigns');
    } catch (err) {
      this.setState({ loading: false, errorMessage: err.message });
    }
  };

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>
        <Form
          error={
            !Number.isInteger(Number(this.state.minimumContribution)) &&
            !!this.state.minimumContribution
          }
          onSubmit={this.handleSubmit}
        >
          <Form.Field>
            <label>Campaign Name</label>
            <Input
              value={this.state.campaignName}
              onChange={event =>
                this.setState({ campaignName: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={event =>
                this.setState({ minimumContribution: event.target.value })
              }
            />
          </Form.Field>
          <Message error header="Oops" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary type="submit">
            Create
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default NewCampaignForm;
