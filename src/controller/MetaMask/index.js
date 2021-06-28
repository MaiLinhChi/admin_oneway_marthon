import ReduxServices from 'src/common/redux'
import MetaMaskOnboarding from '@metamask/onboarding'
import Observer from 'src/common/observer'
import { OBSERVER_KEY, BSC_RPC } from 'src/common/constants'
import { convertUtf8ToHex } from '@walletconnect/utils'
import PageReduxAction from 'src/controller/Redux/actions/pageActions'
let onboarding

export default class MetaMaskServices {
  static async initialize () {
    try {
      if (!onboarding) {
        onboarding = new MetaMaskOnboarding()
      }
      const { accounts } = ReduxServices.getMetaMask()
      if (MetaMaskOnboarding.isMetaMaskInstalled()) {
        let accounts = await window.ethereum
          .request({ method: 'eth_requestAccounts' })
          .then(this.subscribeToEvents())
        this.onConnect(accounts)
      } else if (accounts && accounts.length > 0) {
        onboarding.stopOnboarding()
        this.onConnect(accounts)

        // subscribe to events
        this.subscribeToEvents()
      } else {
        onboarding.startOnboarding()
      }
    } catch (error) {
      console.log('initialize', error)
    }
  }

  static async refresh () {
    try {
      if (!onboarding) {
        onboarding = new MetaMaskOnboarding()
      }
      const { accounts } = ReduxServices.getMetaMask()
      if (MetaMaskOnboarding.isMetaMaskInstalled()) {
        await window.ethereum
          .request({ method: 'eth_accounts' })
          .then(this.handleNewAccounts)
          .then(this.subscribeToEvents())
        this.getNetworkAndChainId()
      } else if (accounts && accounts.length > 0) {
        this.onConnect(accounts)
        // subscribe to events
        this.subscribeToEvents()
      }
    } catch (error) {
      console.log('refresh', error)
    }
  }

  static subscribeToEvents () {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum.on('chainChanged', this.handleNewChain)
      window.ethereum.on('networkChanged', this.handleNewNetwork)
      window.ethereum.on('accountsChanged', this.handleNewAccounts)
    }
  }

  static async getNetworkAndChainId () {
    try {
      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      })
      this.handleNewChain(chainId)

      const networkId = await window.ethereum.request({
        method: 'net_version'
      })
      this.handleNewNetwork(networkId)
    } catch (err) {
      console.error(err)
    }
  }

  static handleNewChain (chainId) {
    ReduxServices.updateMetaMask({
      chainId
    })
  }

  static handleNewNetwork (networkId) {
    ReduxServices.updateMetaMask({
      network: networkId
    })
  }

  static handleNewAccounts (accounts) {
    const address = accounts[0]
    ReduxServices.updateMetaMask({
      accounts,
      address
    })
  }

  static async addNewChain (chainID) {
    let chainData = BSC_RPC[parseInt(chainID)]
    if (chainData && MetaMaskOnboarding.isMetaMaskInstalled()) {
      return new Promise((resolve, reject) => {
        // Sign transaction
        window.ethereum
          .request({ method: 'wallet_addEthereumChain', params: [chainData] })
          .then((result) => {
            // Returns result successfully
            return resolve(result)
          })
          .catch((error) => {
            // Error returned when rejected
            return reject(error)
          })
      })
    } else {
      return null
    }
  }

  static signPersonalMessage (address, message) {
    const msgParams = [
      convertUtf8ToHex(message),
      address
    ]
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      return new Promise((resolve, reject) => {
        // Sign transaction
        window.ethereum
          .request({ method: 'personal_sign', params: msgParams })
          .then((result) => {
            // Returns signed transaction
            return resolve(result)
          })
          .catch((error) => {
            // Error returned when rejected
            return reject(error)
          })
      })
    } else {
      return null
    }
  }

  static async onConnect (accounts) {
    const address = accounts[0]
    const callbackSignIn = async () => {
      Observer.emit(OBSERVER_KEY.ALREADY_SIGNED)
    }
    await this.getNetworkAndChainId()
    // update redux state
    await ReduxServices.updateMetaMask({
      accounts,
      address
    })
    
    ReduxServices.loginMetamask(callbackSignIn)
  }
}
