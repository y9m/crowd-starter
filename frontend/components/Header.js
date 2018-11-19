import React from 'react';
import { Menu } from 'semantic-ui-react';

const Header = () => {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <a href="/" className="item">
        Crowdstarter
      </a>

      <Menu.Menu position="right">
        <a href="/" className="item">
          Campaigns
        </a>

        <a href="/campaigns/new" className="item">
          +
        </a>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
