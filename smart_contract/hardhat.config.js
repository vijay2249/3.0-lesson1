require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks:{
    ropsten:{
      url: 'https://eth-ropsten.alchemyapi.io/v2/MPXZN6LQFCATi7iPoEa837jL78QvtQ_t',
      accounts: ['2e39a95f07d9df37a79299ad525083aff8ab69ca30a29aae3fbf67c50e9a1cff']
    }
  }
}