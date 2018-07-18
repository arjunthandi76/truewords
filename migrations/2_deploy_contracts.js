var TrueWords = artifacts.require("./TrueWords.sol");

module.exports = function(deployer) {
  deployer.deploy(TrueWords);
};
