import Web3 from 'web3';
import { InjectedConnector } from '@web3-react/injected-connector'
import { Web3EthContract } from 'web3-eth-contract'

const connector = new InjectedConnector({ supportedChainIds: [
    4, //Rinkeby
    1337 //Ganache
] })

const getLibrary = (provider) => {
    return new Web3(provider);
}

export {connector, getLibrary};