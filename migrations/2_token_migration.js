const Token = artifacts.require("doggiesContract");

module.exports = function (deployer) {
  deployer.deploy(Token);
};
