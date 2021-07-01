var initState = {
  lang: 'en',
  userData: null,
  connectionMethod: null,
  metamaskRedux: {
    network: 0,
    accounts: [],
    address: ''
  },
  walletConnect: {
    connector: {},
    chainId: 0,
    accounts: [],
    address: '',
    session: {}
  },
  transferData: {},
  balanceRedux: {
    balanceTOMO: 0,
    balanceTAI: 0,
    balanceTFI: 0
  },
  internet: true,
  isloading: true,
  tokensRedux: [],
  setting: {},
  tomoPrice: 0
}

export default initState
