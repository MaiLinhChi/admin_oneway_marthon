import storeRedux from 'src/controller/Redux/store/configureStore'
import MetaMaskServices from 'src/controller/MetaMask'
import WalletConnectServices from 'src/controller/WalletConnect'
import StorageActions from 'src/controller/Redux/actions/storageActions'
import PageReduxAction from 'src/controller/Redux/actions/pageActions'
import { METAMASK_INFO } from 'src/common/constants'
import { showNotification, lowerCase, getCurrentBrowserLanguage } from 'src/common/function'
import { CONNECTION_METHOD } from './constants'

export default class ReduxServices {
  static async callDispatchAction (action) {
    storeRedux.dispatch(action)
  }

  // static getAuthKeyBearer () {
  //   const { userData } = storeRedux.getState()
  //   if (userData && userData.token) {
  //     return 'Bearer ' + userData.token
  //   } else {
  //     return ''
  //   }
  // }

  static async detectConnectionMethod () {
    const { connectionMethod } = storeRedux.getState()

    switch (connectionMethod) {
    case CONNECTION_METHOD.METAMASK:
      await MetaMaskServices.refresh()
      break
    case CONNECTION_METHOD.WALLET_CONNECT:
      WalletConnectServices.refresh()
      break
    default:
      break
    }
  }


  static getContractAddress () {
    const { settingRedux } = storeRedux.getState()
    return {
      contractCDP: settingRedux.cdp,
      contractVoter: settingRedux.voter,
      contractVoter2: settingRedux.voter2,
      contractFiat: settingRedux.fiat,
      contractCDPRefactory: settingRedux.CDPRecfactory,
      contractCDPLiquidated: settingRedux.CDPLiquidated,
      contractCDPGovernance: settingRedux.CDPGovernance,
      tokenTAI: settingRedux.TAI,
      tokenTFI: settingRedux.TFI,
      tokenSTFI: settingRedux.STFI,
      cdpCeo: settingRedux.CDPCeo,
      address30: settingRedux.VOTERDddress30,
      address70: settingRedux.VOTERDddress70,
      takeInterestor: settingRedux.takeInterestor,
      liquidatior: settingRedux.liquidatior,
      addressMasternode: settingRedux.masterNode
    }
  }

  static async onEnableMetaMask (callback = null) {
    let currentWeb3 = window.tomoWeb3
    if (currentWeb3 && typeof currentWeb3 !== 'undefined') {
      // Get tomochain network
      currentWeb3.version.getNetwork((err, network) => {
        if (!err) {
          // Enable open pantograph when closed
          const enableMetaMask = () => {
            currentWeb3.currentProvider && currentWeb3.currentProvider.enable().then(() => {
              callback && callback()
            })
          }
          currentWeb3.eth.getAccounts((err, accounts) => {
            if (!err) {
              if (!accounts || accounts.length <= 0) {
                enableMetaMask()
              }
            }
          })
        }
      })
    }
  }

  static async refreshMetaMask () {
    const { metamaskRedux } = storeRedux.getState()

    const checkMetaMask = () => {
      return new Promise(async (resolve, reject) => {
        const { metamaskRedux } = storeRedux.getState()
        const isShowLog = false
        const showLogStatus = (message) => {
          isShowLog && console.log(message)
        }

        let newStatus = Object.assign({}, metamaskRedux)
        let currentWeb3 = window.tomoWeb3
        try {
          if (typeof currentWeb3 === 'undefined') {
            if (metamaskRedux.status === METAMASK_INFO.status.Loading) {
              showLogStatus('No web3 detected')
              newStatus.status = METAMASK_INFO.status.NoWeb3
              newStatus.network = 0
              resolve(newStatus)
            } else if (newStatus.status !== METAMASK_INFO.status.NoWeb3) {
              showLogStatus('Lost web3')
              window.location.reload(true)
              newStatus.status = METAMASK_INFO.status.Error
              newStatus.network = 0
              resolve(newStatus)
            }
          } else {
            showLogStatus('web3 detected')

            // Get metamask ether network
            let p1 = new Promise((resolve, reject) => {
              try {
                currentWeb3.version.getNetwork((err, network) => {
                  if (err) {
                    return reject(err)
                  }
                  return resolve(network)
                })
              } catch (e) {
                showLogStatus('Get metamask netWork error' + e)
                return reject(e)
              }
            })
            // Close p1 promise if over time
            let p2 = new Promise(function (resolve, reject) {
              setTimeout(() => {
                return reject(new Error('request timeout'))
              }, 1800)
            })

            Promise.race([p1, p2]).then((networkNew) => {
              const networkParse = parseInt(networkNew)
              const web3 = currentWeb3
              const findNetwork = METAMASK_INFO.network[networkParse]
              showLogStatus('web3 network is ' + (findNetwork || 'Unknown'))

              let network = findNetwork || 'Unknown'
              web3.eth.getAccounts((err, accounts) => {
                showLogStatus('TomoChain Account detected' + accounts + 'newStatus' + newStatus.account)
                if (accounts && newStatus.account && newStatus.account !== accounts[0]) {
                  // Clear data and reload page when change new account
                  this.callDispatchAction(StorageActions.setUserData(null))
                  // alert(1)
                  newStatus.status = METAMASK_INFO.status.ChangeAccount
                  newStatus.network = network
                  resolve(newStatus)
                }
                if (err) {
                  newStatus.status = METAMASK_INFO.status.Error
                  newStatus.network = network
                  resolve(newStatus)
                } else if (accounts && accounts.length > 0) {
                  newStatus.status = METAMASK_INFO.status.Ready
                  newStatus.network = network
                  newStatus.account = accounts[0].toLowerCase()
                  resolve(newStatus)
                }
              })
            }).catch((e) => {
              showLogStatus('Check network error' + e)
              newStatus.status = METAMASK_INFO.status.Locked
              newStatus.network = 0
              resolve(newStatus)
            })
          }
        } catch (e) {
          newStatus.status = METAMASK_INFO.status.Error
          newStatus.network = 0
          resolve(newStatus)
        }
      })
    }

    const newMetamaskStatus = await checkMetaMask()
    if (newMetamaskStatus && (newMetamaskStatus.network !== metamaskRedux.network || newMetamaskStatus.status !== metamaskRedux.status || newMetamaskStatus.account !== metamaskRedux.account)) {
      ReduxServices.callDispatchAction(PageReduxAction.setMetamask(newMetamaskStatus))
    }
  }

  static loginMetamask (callback = null, callbackErr = null) {
    return new Promise(async (resolve, reject) => {
      const signMetaMask = (callback = null) => {
        return new Promise(async (resolve, reject) => {
          try {
            const { metamaskRedux, settingRedux, locale } = storeRedux.getState()
            const { messages } = locale
            if(process.env.REACT_APP_IS_SIGNED_REQUIRED === "true"){
                let msgHash = settingRedux.messageHash || 'Binary Option'
                let content = await MetaMaskServices.signPersonalMessage(metamaskRedux.address, msgHash)

                if (content) {
                  let newMetaMask = Object.assign({}, metamaskRedux)
                  ReduxServices.callDispatchAction(PageReduxAction.setMetamask(newMetaMask))
                  let newUserLogin = Object.assign({}, { address: metamaskRedux.address, sig: content, isSigned: true })
                  ReduxServices.callDispatchAction(StorageActions.setUserData(newUserLogin))
                  // ReduxServices.refreshUserBalance()
                  callback && callback()
                  return resolve()
                } else {
                  showNotification(messages.txtWarningActiveMetaMask)
                  ReduxServices.callDispatchAction(StorageActions.setUserData({}))
                  callbackErr && callbackErr()
                  return resolve()
                }
            }else{
              let newMetaMask = Object.assign({}, metamaskRedux)
              ReduxServices.callDispatchAction(PageReduxAction.setMetamask(newMetaMask))
              let newUserLogin = Object.assign({}, { address: metamaskRedux.address, isSigned: true })
              ReduxServices.callDispatchAction(StorageActions.setUserData(newUserLogin))
              // ReduxServices.refreshUserBalance()
              callback && callback()
              return resolve()
            }  
          } catch (error) {
            showNotification(messages.txtWarningSigninMetaMaskError)
            reject(error)
          }
        })
      }

      const { metamaskRedux, locale } = storeRedux.getState()
      const { messages } = locale
      let currentWeb3 = window.ethereum
      try {
        // Check if MetaMask is installed
        if (!currentWeb3) {
          showNotification(messages.txtWarningInstallMetaMask)
          return resolve(null)
        }

        // check network allowed
        const findNetwork = parseInt(process.env.REACT_APP_NETWORK_ID)
        let network = findNetwork || 0
        if (metamaskRedux.network !== network) {
          await MetaMaskServices.addNewChain(network)
        }

        if (metamaskRedux.accounts) {
          let isSigned = ReduxServices.checkIsSigned()
          if (!isSigned) {
            signMetaMask(callback)
          } else {
            callback && callback()
            return resolve(null)
          }
        } else {
          return resolve(null)
        }
      } catch (error) {
        callbackErr && callbackErr()
        return resolve(error)
      }
    })
  }

  static resetUser () {
    ReduxServices.callDispatchAction(StorageActions.setUserData(null))
  }

  static checkIsSigned () {
    const { userData, metamaskRedux, walletConnect, connectionMethod } = storeRedux.getState()
    if (userData && userData.address) {
      switch (connectionMethod) {
      case CONNECTION_METHOD.METAMASK:
        return userData.isSigned && lowerCase(metamaskRedux.address) === lowerCase(userData.address)
      case CONNECTION_METHOD.WALLET_CONNECT:
        return userData.isSigned && lowerCase(walletConnect.address) === lowerCase(userData.address)
      default:
        return false
      }
    }
    return false
  }

  static detectBrowserLanguage () {
    const lang = window.pantographLanguage || getCurrentBrowserLanguage()
    ReduxServices.callDispatchAction(StorageActions.setLocale(lang))
  }

  static getMetaMask () {
    const { metamaskRedux } = storeRedux.getState()
    return metamaskRedux
  }

  static async updateMetaMask (data) {
    const { metamaskRedux } = storeRedux.getState()
    let newMetaMask = {
      ...metamaskRedux,
      ...data
    }
    ReduxServices.callDispatchAction(PageReduxAction.setMetamask({ ...newMetaMask }))
  }

  static getWalletConnect () {
    const { walletConnect } = storeRedux.getState()
    return walletConnect
  }

  static getConnectionMethod () {
    const { connectionMethod } = storeRedux.getState()
    return connectionMethod
  }

  static loginWalletConnect (callback = null, callbackErr = null) {
    return new Promise(async (resolve, reject) => {
      const signWalletConnect = (callback = null) => {
        return new Promise(async (resolve, reject) => {
          try {
            const { walletConnect, settingRedux, locale } = storeRedux.getState()
            const { messages } = locale
            const address = walletConnect.address
            if (process.env.REACT_APP_IS_SIGNED_REQUIRED === "true") {
              let msgHash = settingRedux.messageHash
              let signature = await WalletConnectServices.signPersonalMessage(msgHash, address)
              if (signature) {
                let newUserLogin = Object.assign({}, { address: walletConnect.address, sig: signature, isSigned: true })
                ReduxServices.callDispatchAction(StorageActions.setUserData(newUserLogin))
                // ReduxServices.refreshUserBalance()
                callback && callback()
                return resolve()
              } else {
                showNotification(messages.txtWarningActiveMetaMask)
                ReduxServices.callDispatchAction(StorageActions.setUserData({}))
                callbackErr && callbackErr()
                return resolve()
              }
            } else {
              let newUserLogin = Object.assign({}, { address: walletConnect.address, isSigned: true })
              ReduxServices.callDispatchAction(StorageActions.setUserData(newUserLogin))
              // ReduxServices.refreshUserBalance()
              callback && callback()
              return resolve()
            }
            
          } catch (error) {
            showNotification(messages.txtWarningActiveMetaMask)
            reject(error)
          }
        })
      }
      const { walletConnect, locale } = storeRedux.getState()
      const { messages } = locale
      try {
        if (!walletConnect.connector) {
          showNotification(messages.txtWarningSigninMetaMaskError)
          return resolve(null)
        }

        // check network allowed
        const findNetwork = parseInt(process.env.REACT_APP_NETWORK_ID)
        let network = findNetwork || 0
        if (walletConnect.chainId !== network) {
          showNotification(messages.onlySupportNetwork.replace('[network]', network))
          ReduxServices.updateWalletConnect({ connected: false })
          walletConnect.connector.killSession()
          return resolve(null)
        }

        if (walletConnect.address) {
          let isSigned = ReduxServices.checkIsSigned()
          if (!isSigned) {
            signWalletConnect(callback)
          } else {
            callback && callback()
            return resolve(null)
          }
        } else {
          ReduxServices.callDispatchAction(StorageActions.setUserData(null))
          return resolve(null)
        }
      } catch (error) {
        callbackErr && callbackErr()
        return resolve(error)
      }
    })
  }

  static async updateWalletConnect (data) {
    const { walletConnect } = storeRedux.getState()
    let newWalletConnect = {
      ...walletConnect,
      ...data
    }
    ReduxServices.callDispatchAction(PageReduxAction.setWalletConnect({ ...newWalletConnect }))
  }
}

