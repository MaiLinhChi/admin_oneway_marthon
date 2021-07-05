import { roundingNumber, convertBalanceToWei } from 'src/common/function';
import converter from 'hex2dec';
import ReduxServices from 'src/common/redux';
import WalletConnectServices from 'src/controller/WalletConnect'
import { TOMO_RPC, CONNECTION_METHOD,RPC } from 'src/common/constants'
const Web3 = require('web3');
let window = require('global/window');


export const HightOrLowABI = require('./HightOrLowABI.json')
const createWeb3Provider = () => {
    let web3 = new Web3()
    const walletConnect = ReduxServices.getWalletConnect()
    const connectionMethod = ReduxServices.getConnectionMethod()
    if (connectionMethod === CONNECTION_METHOD.WALLET_CONNECT && walletConnect && walletConnect.chainId !== 0) {
      let walletConnect = ReduxServices.getWalletConnect()
      web3.setProvider(new Web3.providers.HttpProvider(TOMO_RPC[walletConnect.chainId].rpcUrls[0]))
    } else if (connectionMethod === CONNECTION_METHOD.METAMASK && window.ethereum) {
      web3.setProvider(window.ethereum)
    } else {
      web3.setProvider(new Web3.providers.HttpProvider(TOMO_RPC[parseInt(process.env.REACT_APP_NETWORK_ID)].rpcUrls[0]))
    }
    return web3
  }

export const contractHightOrLow = () => {
    const web3Instance = createWeb3Provider();
    return new web3Instance.eth.Contract(HightOrLowABI, process.env.REACT_APP_CONTRACT);
}

export const postBaseSendTxs = async(from, arrSend, isNeedCovert = false) => {
  return new Promise(async (resolve, reject) => {
    let web3 = createWeb3Provider()
    web3.eth.getChainId(async (err, network) => {
      let chainId = '0x88'
      if (!err) {
        chainId = '0x' + network
      }

      const isTestnet = chainId === '0x89'
      const nonce = await getNonce(from)

      const promise = arrSend.map(async (item, index) => {
        return new Promise(async (resolve, reject) => {
          const {
            to,
            data,
            value,
            percent,
            gasPrice,
            extraRateGas = 1.1,
            callbackData,
            callbackFunc,
            callBeforeFunc,
            isCallBackErr,
            callbackErrFunc,
            additionalData
          } = item
          const newGasPrice = parseFloat(gasPrice ? convertBalanceToWei(gasPrice, 9) : await getGasPrice())
          let rawTransaction = {
            nonce: nonce + index,
            to,
            from,
            gasPrice: newGasPrice || 250000000,
            data
          }

          if (!isTestnet) {
            rawTransaction.chainId = chainId
          }

          if (percent) {
            rawTransaction.gasPrice = newGasPrice * percent
          }

          if (value) {
            rawTransaction.value = converter.decToHex(
              isNeedCovert ? convertBalanceToWei(value) : value
            )
          }
          console.log('rawTransaction: ', rawTransaction)

          estimateGas(rawTransaction)
            .then(async (gas) => {
              const gasFinal = converter.decToHex(roundingNumber(gas * extraRateGas, 0).toString()) || gas
              rawTransaction.gas = gasFinal
              rawTransaction.gasLimit = gasFinal

              const connectionMethod = ReduxServices.getConnectionMethod()
              if (connectionMethod === CONNECTION_METHOD.WALLET_CONNECT) {
                if (additionalData) {
                  rawTransaction.data = '--' + JSON.stringify(additionalData) + '--' + rawTransaction.data
                }
                WalletConnectServices.sendTransaction(rawTransaction)
                  .then((res) => {
                    // call before call next callBackData
                    if (callBeforeFunc && res) {
                      callBeforeFunc && callBeforeFunc(res)
                    }

                    if (callbackData) {
                      const callbackAfterDone = (receipt) => {
                        if (receipt && receipt.status && receipt.status === true) {
                          setTimeout(() => {
                            postBaseSendTxs(from, callbackData)
                          }, 500)
                        } else {
                          if (isCallBackErr) {
                            console.log("err1",err);
                            callbackErrFunc(err)
                          }
                          reject(err)
                        }
                      }
                      trackingTxs(res, callbackAfterDone)
                    }

                    if (callbackFunc) {
                      const callbackAfterDone = (receipt) => {
                        if (receipt && receipt.status && receipt.status === true) {
                          callbackFunc && callbackFunc(res)
                        } else {
                          if (isCallBackErr) {
                            console.log("err2",err);
                            callbackErrFunc(err)
                          }
                          reject(err)
                        }
                      }

                      trackingTxs(res, callbackAfterDone)
                    }
                    resolve(res)
                  })
                  .catch((err) => {
                    if (isCallBackErr) {
                      console.log("err3",err);
                      callbackErrFunc(err)
                    }
                    reject(err)
                  })
              } else {
                // using the event emitter
                web3.eth.sendTransaction(rawTransaction)
                  .on('transactionHash', function (hash) {
                    // call before call next callBackData
                    if (callBeforeFunc && hash) {
                      callBeforeFunc && callBeforeFunc(hash)
                    }
                    resolve(hash)
                  })
                  .on('receipt', function (receipt) {
                    if (callbackData) {
                      setTimeout(() => {
                        postBaseSendTxs(from, callbackData)
                      }, 500)
                    }

                    if (callbackFunc) {
                      callbackFunc(receipt.transactionHash)
                    }
                  })
                  .on('error', function (error) {
                    console.error()
                    if (isCallBackErr) {
                      console.log("err4",error);
                      callbackErrFunc(error)
                    }
                    reject(error)
                  })
              }
            })
            .catch((err) => {
              console.log(`estimateGas - error`)
              if (isCallBackErr) {
                console.log("err5",err);
                callbackErrFunc(err)
              }
              reject(err)
            })
        })
      })
      Promise.all(promise)
        .then((result) => {
          console.log('postBaseSendTxs - Final send result', result)
          resolve(result)
        })
        .catch((err) => {
          console.log('postBaseSendTxs - error: ', err)
          reject(err)
        })
    })
  })
}
export const callGetDataWeb3 = (contract, method, param) => {
    // method.encodeABI
    const dataTx = contract.methods[method](...param).encodeABI()
    return dataTx
}

export const  getNonce = async(address) => {
    return new Promise(async (resolve, reject) => {
        const web3Instance = createWeb3Provider();
        web3Instance.eth.getTransactionCount(address, (err, res) => {
            if (err) {
                resolve(0);
            }
            resolve(res);
        });
    });
}

export const  getGasPrice = async() => {
    return new Promise(async (resolve, reject) => {
        const web3Instance = createWeb3Provider();
        web3Instance.eth.getGasPrice((err, res) => {
            if (err) {
                resolve(0);
            }
            resolve(res);
        });
    });
}

export const estimateGas=(rawTransaction) => {
    return new Promise(async (resolve, reject) => {
        const web3Instance = createWeb3Provider();
        web3Instance.eth.estimateGas(rawTransaction, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

export const trackingTxs = async(hash, callback, receipt) => {
  if (
    receipt === undefined ||
    receipt === null ||
    receipt.blockNumber === null ||
    receipt.blockNumber === undefined
  ) {
    let web3 = new Web3()
    web3.setProvider(new Web3.providers.HttpProvider(RPC[parseInt(process.env.REACT_APP_NETWORK_ID)].rpcUrls[0]))
    web3.eth.getTransactionReceipt(hash, (err, result) => {
      if (!err) {
        setTimeout(() => {
          trackingTxs(hash, callback, result)
        }, 500)
      }
    })
  } else {
    callback && callback(receipt)
  }
}
