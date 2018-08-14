module.exports = {
     // See <http://truffleframework.com/docs/advanced/configuration>
     // to customize your Truffle configuration!
     networks: {
          ganache: {
               host: "localhost",
               port: 7545,
               network_id: "*" // Match any network id
          },
          truewords: {
               host: "localhost",
               port: 8545,
               network_id: "4224",
               gas: 4700000,
               from: '0x5dae6dbb4c07a3d7ec7705bc642f7027b7c8534c'
          }
     }
};
