var selling = artifacts.require("./selling.sol");

module.exports = function(deployer) {
  deployer.deploy(selling);
};
