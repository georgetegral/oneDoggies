const Token = artifacts.require("doggiesContract");
const DoggieMarketplace = artifacts.require("DoggieMarketplace")

module.exports = function (deployer) {
  deployer.deploy(DoggieMarketplace, Token.address);
};
