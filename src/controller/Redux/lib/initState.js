import { METAMASK_INFO } from 'src/common/constants'

var initState = {
  lang: 'en',
  userData: null,
  metamaskRedux: {
    status: METAMASK_INFO.status.Loading,
    network: 0,
    account: ''
  },
  balanceRedux: {
    balanceTOMO: 0,
    balanceTAI: 0,
    balanceTFI: 0
  },
  internet: true,
  isloading: true,
  setting: {},
  tomoPrice: 0
}

export default initState
