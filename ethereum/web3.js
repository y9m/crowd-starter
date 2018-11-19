import Web3 from 'web3';

const web3 =
  typeof window !== 'undefined' && window.web3 !== undefined
    ? new Web3(window.web3.currentProvider)
    : new Web3(
        new Web3.providers.HttpProvider(
          'https://rinkeby.infura.io/v3/ab46eae08e9941efb644c113ca3acab5'
        )
      );

export default web3;
