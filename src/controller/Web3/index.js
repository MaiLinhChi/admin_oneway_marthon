const Web3 = require('web3');

let window = require('global/window');
let web3Instance
if (window.tomoWeb3) web3Instance = window.tomoWeb3;
else web3Instance = new Web3(new Web3.providers.HttpProvider(process.env.RPC))

export const HightOrLowABI = require('./HightOrLowABI.json')

export const contractHightOrLow = () => {
    let currentWeb3 = new Web3(web3Instance.currentProvider);
    return new currentWeb3.eth.Contract(HightOrLowABI, process.env.REACT_APP_CONTRACT);
}
