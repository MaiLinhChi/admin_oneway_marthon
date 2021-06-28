import ReduxServices from 'src/common/redux'
import WalletConnect from '@walletconnect/client'
import { convertUtf8ToHex } from '@walletconnect/utils'
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal'
import Observer from 'src/common/observer'
import { OBSERVER_KEY } from 'src/common/constants'
import { getDataLocal, saveDataLocal, removeDataLocal } from 'src/common/function'

const DEFAULT_BRIDGE = 'https://bridge.keyringpro.com'
const INITIAL_STATE = {
  connector: null,
  connected: false,
  chainId: 0,
  accounts: [],
  address: '',
  session: {}
}
let connector

export default class WalletConnectServices {
  static async initialize () {
    try {
      // create new connector
      connector = new WalletConnect({ bridge: DEFAULT_BRIDGE, qrcodeModal: WalletConnectQRCodeModal, session: INITIAL_STATE.session })

      // update redux state
      ReduxServices.updateWalletConnect({ connector })

      // check if already connected
      if (!connector.connected) {
        // create new session
        await connector.createSession({ chainId: process.env.REACT_APP_CHAIN_ID })
      } else {
        // get updated accounts and chainId
        const { accounts, chainId, peerMeta } = connector
        this.onConnect(connector, accounts, chainId, peerMeta)
      }

      // subscribe to events
      this.subscribeToEvents()
    } catch (error) {
      console.log('initialize', error)
    }
  }

  static async refresh () {
    try {
      let walletConnect = ReduxServices.getWalletConnect()
      const prevConnector = walletConnect.connector

      if (!prevConnector) {
        // create new connector
        // connector = new WalletConnect({ bridge: DEFAULT_BRIDGE, session: {} })
      } else {
        let oldSession = getDataLocal('wallet_connect_session')
        connector = new WalletConnect({ session: oldSession ? oldSession : prevConnector.session, bridge: DEFAULT_BRIDGE })
      }

      // update redux state
      ReduxServices.updateWalletConnect({ connector })

      // check if already connected
      if (!connector.connected) {
        // create new session
        await connector.createSession({ chainId: process.env.REACT_APP_CHAIN_ID })
      } else {
        // get updated accounts and chainId
        const { accounts, chainId, peerMeta } = connector
        this.onConnect(connector, accounts, chainId, peerMeta)
      }

      // subscribe to events
      this.subscribeToEvents()
    } catch (error) {
      console.log('refresh', error)
    }
  }

  static subscribeToEvents () {
    if (!connector) {
      return
    }

    connector.on('session_update', (error, payload) => {
      console.log('session_request', error, payload)
      if (error) {
        throw error
      }

      // get updated accounts and chainId
      const { accounts, chainId } = payload.params[0]
      this.onSessionUpdate(accounts, chainId)
    })

    connector.on('session_request', (error, payload) => {
      console.log('session_request', error, payload)
      if (error) {
        throw error
      }
    })

    connector.on('connect', (error, payload) => {
      console.log('connect', error, payload)
      if (error) {
        throw error
      }

      // get updated accounts and chainId
      const { accounts, chainId, peerMeta } = payload.params[0]
      this.onConnect(connector, accounts, chainId, peerMeta)
      saveDataLocal('wallet_connect_session', connector.session)
    })

    connector.on('disconnect', (error, payload) => {
      console.log('disconnect', error, payload)
      if (error) {
        throw error
      }

      // delete connector
      this.onDisconnect()
    })
  }

  static onSessionUpdate (accounts, chainId) {
    const address = accounts[0]
    // update redux state
    ReduxServices.updateWalletConnect({
      chainId,
      accounts,
      address
    })
  }

  static async onConnect (connector, accounts, chainId, peerMeta) {
    const address = accounts[0]
    const callbackSignIn = async () => {
      Observer.emit(OBSERVER_KEY.ALREADY_SIGNED)
      await ReduxServices.getUserStakeDataDetail();
      await ReduxServices.getUserUnstakedDataDetail();
    }
    // update redux state
    await ReduxServices.updateWalletConnect({
      connector,
      connected: true,
      chainId,
      accounts,
      address,
      session: connector.session
    })
    ReduxServices.loginWalletConnect(callbackSignIn)
  }

  static onDisconnect () {
    this.resetApp()
  }

  static async resetApp () {
    // update redux state
    ReduxServices.updateWalletConnect(INITIAL_STATE)
    ReduxServices.resetUser()
    await ReduxServices.getUserStakeDataDetail();
    await ReduxServices.getUserUnstakedDataDetail();
    Observer.emit(OBSERVER_KEY.CHANGED_ACCOUNT)
    removeDataLocal('wallet_connect_session')
  }

  static killSession = () => {
    if (connector) {
      connector.killSession()
    }
    this.resetApp()
  }

  static sendTransaction (tx) {
    let walletConnect = ReduxServices.getWalletConnect()
    const { connector } = walletConnect
    if (!connector) {
      return
    }

    return new Promise((resolve, reject) => {
      // Sign transaction
      connector
        .signTransaction(tx)
        .then((result) => {
          // Returns signed transaction
          return resolve(result)
        })
        .catch((error) => {
          // Error returned when rejected
          return reject(error)
        })
    })
  }

  static signPersonalMessage (message, address) {
    let walletConnect = ReduxServices.getWalletConnect()
    const { connector } = walletConnect
    if (!connector) {
      return
    }
    const msgParams = [
      convertUtf8ToHex(message),
      address
    ]

    return new Promise((resolve, reject) => {
      // Sign transaction
      connector
        .signPersonalMessage(msgParams)
        .then((result) => {
          // Returns signed transaction
          return resolve(result)
        })
        .catch((error) => {
          // Error returned when rejected
          return reject(error)
        })
    })
  }
}
