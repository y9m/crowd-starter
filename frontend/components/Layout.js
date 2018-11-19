import React from 'react';
import { Container } from 'semantic-ui-react';
import { Header } from '../components';

const Layout = props => {
  return (
    <Container>
      <Header />
      {props.children}
    </Container>
  );
};

export default Layout;
