import storeRedux from 'src/controller/Redux/store/configureStore'
import Web3Services from 'src/controller/Web3'
import TomoFinanceServices from 'src/controller/API/HTTP'
import StorageActions from 'src/controller/Redux/actions/storageActions'
import PageReduxAction from 'src/controller/Redux/actions/pageActions'
import { METAMASK_INFO, CONTRACT } from 'src/common/constants'
import { showNotification, checkIsSigned } from 'src/common/function'

export default class ReduxServices {
  static async callDispatchAction (action) {
    storeRedux.dispatch(action)
  }

  static getAuthKeyBearer () {
    const { userData } = storeRedux.getState()
    if (userData && userData.token) {
      return 'Bearer ' + userData.token
    } else {
      return ''
    }
  }

  static async getSettings () {
    let configs = {}
    const promiseResult = await Promise.all([
      TomoFinanceServices.getConfig(),
      Web3Services.getOwner(),
      Web3Services.getLockStatus(),
      Web3Services.getProcessMN()
    ])
    if (promiseResult[0] && promiseResult[0].data) {
      configs = { ...configs, ...promiseResult[0].data }
    }
    configs.owner = promiseResult[1]
    configs.isLock = promiseResult[2]
    configs.isProcessMN = promiseResult[3]
    ReduxServices.callDispatchAction(StorageActions.setSetting(configs));
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
            const { metamaskRedux } = storeRedux.getState()
            const { settingRedux } = storeRedux.getState()
            const address = metamaskRedux.account
            let msgHash = settingRedux.messageHash || 'HTTP'
            let content = await Web3Services.onSignMessage(address, msgHash)
            if (content && content.address && content.signature) {
              let newMetaMask = Object.assign({}, metamaskRedux)
              ReduxServices.callDispatchAction(PageReduxAction.setMetamask(newMetaMask))
              let newUserLogin = Object.assign({}, { address: content.address, sig: content.signature, isSigned: true })
              await ReduxServices.callDispatchAction(StorageActions.setUserData(newUserLogin))
              await ReduxServices.refreshUserBalance()
              callback && callback(newUserLogin)
              return resolve()
            } else {
              showNotification('Please activate wallet first.')
              // alert(2)
              ReduxServices.callDispatchAction(StorageActions.setUserData({}))
              callbackErr && callbackErr()
              return resolve()
            }
          } catch (error) {
            showNotification('Please activate wallet first.')
            reject(error)
          }
        })
      }

      const { metamaskRedux, userData } = storeRedux.getState()
      let currentWeb3 = window.tomoWeb3
      try {
        if (!currentWeb3) {
          showNotification('Please install Pantograph first.')
          return resolve(null)
        }
        // Check if MetaMask is installed
        if (metamaskRedux.status === METAMASK_INFO.status.NoWeb3) {
          showNotification('Please install Pantograph first.')
          return resolve(null)
        }

        // check network allowed
        const findNetwork = METAMASK_INFO.network[parseInt(process.env.REACT_APP_NETWORK_ID)]
        let network = findNetwork || 'Unknown'
        if (metamaskRedux.status === METAMASK_INFO.status.Ready && metamaskRedux.network !== network) {
          showNotification('Network is not matched. Please check the network of your application.')
          return resolve(null)
        }

        if (metamaskRedux.account) {
          let isSigned = checkIsSigned(userData, metamaskRedux)
          if (!isSigned) {
            signMetaMask(callback)
          } else {
            callback && callback()
            return resolve(null)
          }
        } else {
          this.onEnableMetaMask(() => signMetaMask(callback))
          return resolve(null)
        }
      } catch (error) {
        return resolve(error)
      }
    })
  }

  static async refreshUserBalance () {
    const { userData, metamaskRedux } = storeRedux.getState()
    let isSigned = checkIsSigned(userData, metamaskRedux)

    const balanceResult = {
      balanceTOMO: 0,
      balanceTAI: 0,
      balanceTFI: 0
    }
    if (isSigned) {
      const contractAddress = ReduxServices.getContractAddress()
      const promiseResult = await Promise.all([
        Web3Services.getTomoBalance(userData.address),
        Web3Services.getTokenBalance(userData.address, contractAddress.tokenTAI),
        Web3Services.getTokenBalance(userData.address, contractAddress.tokenTFI)
      ])
      balanceResult.balanceTOMO = promiseResult[0]
      balanceResult.balanceTAI = promiseResult[1]
      balanceResult.balanceTFI = promiseResult[2]
    }

    ReduxServices.callDispatchAction(PageReduxAction.setBalance({ ...balanceResult }))
  }

  static resetUser () {
    ReduxServices.callDispatchAction(StorageActions.setUserData(null))
  }

  static async refreshTomoPrice () {
    let tomoPrice = await Web3Services.getTokenFiat('TOMO')
    ReduxServices.callDispatchAction(PageReduxAction.setTomoPrice(tomoPrice))
  }


}

