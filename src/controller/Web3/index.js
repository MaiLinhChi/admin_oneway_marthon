import Web3 from 'web3';
import ReduxServices from 'src/common/redux';
import {
  convertBalanceToWei,
  convertWeiToBalance,
  roundingNumber,
  lowerCase,
} from 'src/common/function';
import { NULL_ADDRESS, CONTRACTS_NAME } from 'src/common/constants';
import converter from 'hex2dec';
import abiVoter from './abiVoter';
import abiCDP from './abiCDP';
import abiCDPLiquidated from './abiCDPLiquidated';
import abiCDPRefactory from './abiCDPRefactory'
import abiFiat from './abiFiat';
import abiTomoValidator from './abiTomoValidator';
import abiStaking from './abiStaking'
import abiVoting from './abiVoting';
import abiMint from "./abiMint"

let window = require('global/window');
let web3Instance
if (window.tomoWeb3) {
  web3Instance = window.tomoWeb3;
} else {
  web3Instance = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_PROVIDER_URL))
}

export default class Web3Services {
  static async onSignMessage(address, nonce) {
    return new Promise(function (resolve, reject) {
      try {
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        currentWeb3.eth.personal.sign(
          currentWeb3.utils.fromUtf8(nonce),
          address,
          (err, signature) => {
            if (err) return reject(err);
            return resolve({ address, signature });
          },
        );
      } catch (e) {
        console.log('Sign message error', e);
        return resolve();
      }
    });
  }

  static callGetDataWeb3(contract, method, param) {
    // method.encodeABI
    const dataTx = contract.methods[method](...param).encodeABI()
    return dataTx
  }

  static async estimateGas(rawTransaction) {
    return new Promise(async (resolve, reject) => {
      let currentWeb3 = new Web3(web3Instance.currentProvider);
      currentWeb3.eth.estimateGas(rawTransaction, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  static async getTomoBalance(address) {
    console.log('--address--', address)
    return new Promise(async (resolve, reject) => {

      if (!address) return resolve(0);


      let currentWeb3 = new Web3(web3Instance.currentProvider);

      currentWeb3.eth.getBalance(address, (err, balance) => {
        if (err) {
          resolve(0);
        }
        resolve(balance ? convertWeiToBalance(balance) : 0);
      });
    });
  }

  static async getTokenBalance(address, contractAddress, decimalToken = 18) {
    return new Promise(async (resolve, reject) => {
      try {
        const minABI = [
          {
            constant: true,
            inputs: [
              {
                name: 'owner',
                type: 'address',
              },
            ],
            name: 'balanceOf',
            outputs: [
              {
                name: '',
                type: 'uint256',
              },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
          },
        ];
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(minABI, contractAddress);
        contract.methods.balanceOf(address).call((err, balance) => {
          if (err) {
            resolve(0);
          }
          const tokenBalance = convertWeiToBalance(balance, decimalToken);
          resolve(tokenBalance);
        });
      } catch (err) {
        resolve(0);
      }
    });
  }

  static async getTokenTotalSupply(contractAddress, decimalToken = 18) {
    return new Promise(async (resolve, reject) => {
      try {
        const minABI = [
          {
            constant: true,
            inputs: [],
            name: 'totalSupply',
            outputs: [
              {
                name: '',
                type: 'uint256',
              },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
          },
        ];
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(minABI, contractAddress);
        contract.methods.totalSupply().call((err, balance) => {
          if (err) {
            resolve(0);
          }
          const tokenBalance = convertWeiToBalance(balance, decimalToken);
          resolve(tokenBalance);
        });
      } catch (err) {
        resolve(0);
      }
    });
  }

  static async getNonce(address) {
    return new Promise(async (resolve, reject) => {
      let currentWeb3 = new Web3(web3Instance.currentProvider);
      currentWeb3.eth.getTransactionCount(address, (err, res) => {
        if (err) {
          resolve(0);
        }
        resolve(res);
      });
    });
  }

  static async getGasPrice() {
    return new Promise(async (resolve, reject) => {
      let currentWeb3 = new Web3(web3Instance.currentProvider);
      currentWeb3.eth.getGasPrice((err, res) => {
        if (err) {
          resolve(0);
        }
        resolve(res);
      });
    });
  }

  static async getBlockNumber() {
    return new Promise(async (resolve, reject) => {
      let currentWeb3 = new Web3(web3Instance.currentProvider);
      currentWeb3.eth.getBlockNumber((err, res) => {
        if (err) {
          resolve(0);
        }
        resolve(res);
      });
    });
  }

  static async getApproved(gameAddress, tokenId) {
    return new Promise(async (resolve, reject) => {
      const abiApprove = [
        {
          constant: true,
          inputs: [
            {
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'getApproved',
          outputs: [
            {
              name: '',
              type: 'address',
            },
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
      ];
      let currentWeb3 = new Web3(web3Instance.currentProvider);
      const contract = new currentWeb3.eth.Contract(abiApprove, gameAddress);
      contract.methods.getApproved(tokenId).call((err, result) => {
        if (err) {
          resolve(0);
        }
        resolve(result);
      });
    });
  }

  static async checkAllowance(coinContract, owner, spender) {
    return new Promise(async (resolve, reject) => {
      try {
        const minABI = [
          {
            constant: true,
            inputs: [
              {
                name: 'owner',
                type: 'address',
              },
              {
                name: 'spender',
                type: 'address',
              },
            ],
            name: 'allowance',
            outputs: [
              {
                name: '',
                type: 'uint256',
              },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
          },
        ];
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(minABI, coinContract);
        contract.methods.allowance(owner, spender).call((err, balance) => {
          if (err) {
            resolve(0);
          }
          resolve(balance);
        });
      } catch (err) {
        resolve(0);
      }
    });
  }

  static encodeApproveTxs(
    addressApprove,
    contractApproveForSend,
    approveValue,
  ) {
    const approveABI = [
      {
        constant: false,
        inputs: [
          {
            name: '_spender',
            type: 'address',
          },
          {
            name: '_value',
            type: 'uint256',
          },
        ],
        name: 'approve',
        outputs: [
          {
            name: 'success',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ];
    let currentWeb3 = new Web3(web3Instance.currentProvider);
    const contractTokenApprove = new currentWeb3.eth.Contract(
      approveABI,
      addressApprove,
    );
    const dataTx = contractTokenApprove.methods
      .approve(contractApproveForSend, approveValue)
      .encodeABI();
    return dataTx;
  }

  static async trackingTxs(hash, callback, receipt) {
    if (
      receipt === undefined ||
      receipt === null ||
      receipt.blockNumber === null ||
      receipt.blockNumber === undefined
    ) {
      web3Instance.eth.getTransaction(hash, (err, result) => {
        if (!err) {
          setTimeout(() => {
            this.trackingTxs(hash, callback, result);
          }, 500);
        }
      });
    } else {
      callback && callback();
    }
  }

  static async postBaseSendTxs(from, arrSend, isNeedCovert = false) {
    return new Promise(async (resolve, reject) => {
      web3Instance.version.getNetwork(async (err, network) => {
        let chainId = '0x88';
        if (!err) {
          chainId = '0x' + network;
        }

        const isTestnet = chainId === '0x89';

        const nonce = await this.getNonce(from);
        const gasPrice = await this.getGasPrice();

        const promise = arrSend.map(async (item, index) => {
          return new Promise(async (resolve, reject) => {
            const {
              to,
              data,
              value,
              percent,
              extraRateGas = 1.1,
              callbackData,
              callbackFunc,
              callBeforeFunc,
              isCallBackErr,
              callbackErrFunc,
            } = item;
            let rawTransaction = {
              nonce: nonce + index,
              to,
              from,
              gasPrice: gasPrice || 250000000,
              data,
            };

            if (!isTestnet) {
              rawTransaction.chainId = chainId;
            }

            if (percent) {
              rawTransaction.gasPrice = gasPrice * percent;
            }

            if (value) {
              rawTransaction.value = converter.decToHex(
                isNeedCovert ? convertBalanceToWei(value) : value,
              );
            }
            console.log('rawTransaction: ', rawTransaction);

            this.estimateGas(rawTransaction)
              .then(gas => {
                const gasFinal =
                  converter.decToHex(
                    roundingNumber(gas * extraRateGas, 0).toString(),
                  ) || gas;
                rawTransaction.gas = gasFinal;
                rawTransaction.gasLimit = gasFinal;
                web3Instance.eth.sendTransaction(rawTransaction, (err, res) => {
                  if (err) {
                    console.log(`sendTransaction - error`, err);
                    if (isCallBackErr) {
                      callbackErrFunc(err);
                    }
                    reject(err);
                  }
                  // call before call next callBackData
                  if (callBeforeFunc && res) {
                    callBeforeFunc && callBeforeFunc(res);
                  }

                  if (callbackData) {
                    const callbackAfterDone = () => {
                      setTimeout(() => {
                        this.postBaseSendTxs(from, callbackData);
                      }, 500);
                    };
                    this.trackingTxs(res, callbackAfterDone);
                  }

                  if (callbackFunc) {
                    const callbackAfterDone = () => {
                      callbackFunc && callbackFunc(res);
                    };

                    this.trackingTxs(res, callbackAfterDone);
                  }
                  resolve(res);
                });
              })
              .catch(err => {
                console.log(`estimateGas - error`);
                if (isCallBackErr) {
                  callbackErrFunc(err);
                }
                reject(err);
              });
          });
        });
        Promise.all(promise)
          .then(result => {
            console.log('postBaseSendTxs - Final send result', result);
            resolve(result);
          })
          .catch(err => {
            console.log('postBaseSendTxs - error: ', err);
            reject(err);
          });
      });
    });
  }

  static async getTokenFiat (symbol) {
    return new Promise(async (resolve, reject) => {
      try {
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        let contractAddress = ReduxServices.getContractAddress()
        const contract = new currentWeb3.eth.Contract(abiFiat, contractAddress.contractFiat)
        contract.methods.getToken2USD(symbol).call((err, res) => {
          if (err || !res || !res._token2USD) {
            return resolve(0)
          }
          const fiat = 1 / convertWeiToBalance(res._token2USD)
          return resolve(fiat)
        })
      } catch (err) {
        resolve(0)
      }
    })
  }

  static async getContractName() {
    return new Promise(async (resolve, reject) => {
      try {
        let web3 = new Web3(web3Instance.currentProvider);
        let contractAddress = ReduxServices.getContractAddress();
        const contract = new web3.eth.Contract(abiCDPRefactory, contractAddress.contractCDPRefactory);
        contract.methods.getContractName().call((err, res) => {
          if (err) {
            resolve(0);
          }
          resolve(res);
        });
      } catch (err) {
        resolve(0);
      }
    });
  }

  static async requestChangeConfig(
    fromUserAddress,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected,
  ) {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = ReduxServices.getContractAddress();

      let currentWeb3 = new Web3(web3Instance.currentProvider);

      const contract = new currentWeb3.eth.Contract(
        abiCDPRefactory,
        contractAddresses.contractCDPRefactory,
      );

      const dataTx = this.callGetDataWeb3(contract, 'requestChangeConfig', []);
      const requestChangeConfigData = {
        to: contractAddresses.contractCDPRefactory,
        data: dataTx,
        callBeforeFunc: callbackBeforeDone,
        callbackFunc: callbackAfterDone,
      };

      this.postBaseSendTxs(fromUserAddress, [requestChangeConfigData], true)
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          callbackRejected(err);
          console.log('requestChangeConfig - error: ', err);
          reject(err);
        });
    });
  }

  /**
   * @param {Array<string>} contractsName
   * @param {Array<string>} contractsAddress
   * Ex: ["CDP"], ["4"], [ "0x0C1849ce34aF2187ede48552A6C26c0A0ce5A9A2"]
   */
  static async configContractAddr(
    fromUserAddress,
    contractsName,
    contractsAddress,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected,
  ) {
    return new Promise(async (resolve, reject) => {
      const contracts = await this.getContractName();
      const ids = contractsName.map(cn => contracts.indexOf(cn));

      const contractAddresses = ReduxServices.getContractAddress();
      let currentWeb3 = new Web3(web3Instance.currentProvider);
      const contract = new currentWeb3.eth.Contract(abiCDPRefactory, contractAddresses.contractCDPRefactory);

      const dataTx = this.callGetDataWeb3(contract, 'configContractAddr', [contractsName, ids, contractsAddress]);
      const configData = {
        to: contractAddresses.contractCDPRefactory,
        data: dataTx,
        callBeforeFunc: callbackBeforeDone,
        callbackFunc: callbackAfterDone,
      };

      this.postBaseSendTxs(fromUserAddress, [configData], true)
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          callbackRejected(err);
          console.log('configContractAddr - error: ', err);
          reject(err);
        });
    });
  }

  static async requestWithdraw(
    fromUserAddress,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected,
  ) {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = ReduxServices.getContractAddress();

      let currentWeb3 = new Web3(web3Instance.currentProvider);
      const contract = new currentWeb3.eth.Contract(
        abiVoter,
        contractAddresses.contractVoter2,
      );

      const dataTx = this.callGetDataWeb3(contract, 'requestWithdrawReward', []);
      const requestWithdrawData = {
        to: contractAddresses.contractVoter2,
        data: dataTx,
        callBeforeFunc: callbackBeforeDone,
        callbackFunc: callbackAfterDone,
      };

      this.postBaseSendTxs(fromUserAddress, [requestWithdrawData], true)
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          callbackRejected(err);
          console.log('requestWithdrawReward - error: ', err);
          reject(err);
        });
    });
  }

  static async withdrawReward(
    fromUserAddress,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected,
  ) {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = ReduxServices.getContractAddress();

      let currentWeb3 = new Web3(web3Instance.currentProvider);
      const contract = new currentWeb3.eth.Contract(
        abiVoter,
        contractAddresses.contractVoter2,
      );

      const dataTx = this.callGetDataWeb3(contract, 'withdrawReward', []);
      const withdrawData = {
        to: contractAddresses.contractVoter2,
        data: dataTx,
        callBeforeFunc: callbackBeforeDone,
        callbackFunc: callbackAfterDone,
      };

      this.postBaseSendTxs(fromUserAddress, [withdrawData], true)
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          callbackRejected(err);
          console.log('withdrawReward - error: ', err);
          reject(err);
        });
    });
  }

  static async lockContract(
    fromUserAddress,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected,
  ) {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = ReduxServices.getContractAddress();

      let currentWeb3 = new Web3(web3Instance.currentProvider);
      const contract = new currentWeb3.eth.Contract(
        abiCDPRefactory,
        contractAddresses.contractCDPRefactory,
      );

      const dataTx = this.callGetDataWeb3(contract, 'setLockSystem', []);
      const lockData = {
        to: contractAddresses.contractCDPRefactory,
        data: dataTx,
        callBeforeFunc: callbackBeforeDone,
        callbackFunc: callbackAfterDone,
      };

      this.postBaseSendTxs(fromUserAddress, [lockData], true)
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          callbackRejected(err);
          console.log('setLockSystem - error: ', err);
          reject(err);
        });
    });
  }

  static async unlockContract(
    fromUserAddress,
    secret,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected,
  ) {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = ReduxServices.getContractAddress();

      let currentWeb3 = new Web3(web3Instance.currentProvider);
      const contract = new currentWeb3.eth.Contract(
        abiCDPRefactory,
        contractAddresses.contractCDPRefactory,
      );

      const dataTx = this.callGetDataWeb3(contract, 'setUnlockSystem', [secret]);
      const unlockData = {
        to: contractAddresses.contractCDPRefactory,
        data: dataTx,
        callBeforeFunc: callbackBeforeDone,
        callbackFunc: callbackAfterDone,
      };

      this.postBaseSendTxs(fromUserAddress, [unlockData], true)
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          callbackRejected(err);
          console.log('setUnlockSystem - error: ', err);
          reject(err);
        });
    });
  }

  /**
   * @param {number} interestRate
   * @param {number} feeBalanceSystem
   * @param {number} liquidationMinimum
   */
  static async configCDP(
    fromUserAddress,
    interestRate,
    feeBalanceSystem,
    liquidationMinimum,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected,
  ) {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = ReduxServices.getContractAddress();

      let currentWeb3 = new Web3(web3Instance.currentProvider);
      const contract = new currentWeb3.eth.Contract(
        abiCDPRefactory,
        contractAddresses.contractCDPRefactory,
      );

      const dataTx = this.callGetDataWeb3(contract, 'config', [interestRate, feeBalanceSystem, liquidationMinimum]);
      const configCDPData = {
        to: contractAddresses.contractCDPRefactory,
        data: dataTx,
        callBeforeFunc: callbackBeforeDone,
        callbackFunc: callbackAfterDone,
      };

      this.postBaseSendTxs(fromUserAddress, [configCDPData], true)
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          callbackRejected();
          console.log('changeConfig - error: ', err);
          reject(err);
        });
    });
  }

  /**
   * @param {string} tokenCampaign
   * @param {boolean} isCampaign
   * @param {number} amountTokenCampaign
   */
  static async setCampaign(
    fromUserAddress,
    tokenCampaign,
    isCampaign,
    amountTokenCampaign,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected,
  ) {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = ReduxServices.getContractAddress();

      let currentWeb3 = new Web3(web3Instance.currentProvider);
      const contract = new currentWeb3.eth.Contract(abiCDP, contractAddresses.contractCDP);

      const dataTx = this.callGetDataWeb3(contract, 'setCampaign', [tokenCampaign, isCampaign, amountTokenCampaign]);
      const setCampaignData = {
        to: contractAddresses.contractCDP,
        data: dataTx,
        callBeforeFunc: callbackBeforeDone,
        callbackFunc: callbackAfterDone,
      };

      this.postBaseSendTxs(fromUserAddress, [setCampaignData], true)
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          callbackRejected(err);
          console.log('setCampaign - error: ', err);
          reject(err);
        });
    });
  }

  /**
   * @param {boolean} isBonusTFI
   * @param {number} TFIBonusPercent
   */
  static async setTFIBonus(
    fromUserAddress,
    isBonusTFI,
    TFIBonusPercent,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected,
  ) {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = ReduxServices.getContractAddress();

      let currentWeb3 = new Web3(web3Instance.currentProvider);
      const contract = new currentWeb3.eth.Contract(abiCDP, contractAddresses.contractCDP);
      const dataTx = this.callGetDataWeb3(contract, 'setTFIBonus', [isBonusTFI, TFIBonusPercent]);

      const setTFIBonusData = {
        to: contractAddresses.contractCDP,
        data: dataTx,
        callBeforeFunc: callbackBeforeDone,
        callbackFunc: callbackAfterDone,
      };

      this.postBaseSendTxs(fromUserAddress, [setTFIBonusData], true)
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          callbackRejected(err);
          console.log('setTFIBonus - error: ', err);
          reject(err);
        });
    });
  }

  static async configStaking(
    fromUserAddress,
    minimumStakingAmount,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected,
  ) {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = ReduxServices.getContractAddress();

      let currentWeb3 = new Web3(web3Instance.currentProvider);
      const contract = new currentWeb3.eth.Contract(abiStaking, contractAddresses.tokenSTFI);
      const percentDecimal = await this.getPercentDecimal();
      const dataTx = this.callGetDataWeb3(contract, 'config', [Number(percentDecimal), convertBalanceToWei(Number(minimumStakingAmount))]);

      const setTFIBonusData = {
        to: contractAddresses.tokenSTFI,
        data: dataTx,
        callBeforeFunc: callbackBeforeDone,
        callbackFunc: callbackAfterDone,
      };

      this.postBaseSendTxs(fromUserAddress, [setTFIBonusData], true)
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          callbackRejected(err);
          console.log('configStaking - error: ', err);
          reject(err);
        });
    });
  }

  static async getMinimumStakingAmount() {
    return new Promise(async (resolve, reject) => {
      try {
        const contractAddresses = ReduxServices.getContractAddress();
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(abiStaking, contractAddresses.tokenSTFI);
        contract.methods.minimumStakingAmount().call((err, result) => {
          if (err) {
            resolve(null);
          }
          resolve(result ? convertWeiToBalance(result) : 0);
        });
      } catch (err) {
        resolve(null);
      }
    });
  }

  static async getCDPLockStatus() {
    return new Promise(async (resolve, reject) => {
      try {
        const contractAddresses = ReduxServices.getContractAddress();
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(abiCDP, contractAddresses.contractCDP);
        contract.methods.systemBlock().call((err, result) => {
          if (err) {
            resolve(null);
          }
          resolve(result);
        });
      } catch (err) {
        resolve(null);
      }
    });
  }

  static async toggleCDPStatus(
    fromUserAddress,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected,
  ) {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = ReduxServices.getContractAddress();

      let currentWeb3 = new Web3(web3Instance.currentProvider);
      const contract = new currentWeb3.eth.Contract(abiCDP, contractAddresses.contractCDP);

      const dataTx = this.callGetDataWeb3(contract, 'toggleSystemBlock', []);
      const toggleSystemBlockData = {
        to: contractAddresses.contractCDP,
        data: dataTx,
        callBeforeFunc: callbackBeforeDone,
        callbackFunc: callbackAfterDone,
      };

      this.postBaseSendTxs(fromUserAddress, [toggleSystemBlockData], true)
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          callbackRejected(err);
          console.log('toggleSystemBlock - error: ', err);
          reject(err);
        });
    });
  }

  /**
   * @param {string} secret
   * @param {string} ceo
   */
  static async changeCDPCeo(
    fromUserAddress,
    secret,
    ceo,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected,
  ) {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = ReduxServices.getContractAddress();

      let currentWeb3 = new Web3(web3Instance.currentProvider);
      const contract = new currentWeb3.eth.Contract(abiCDPRefactory, contractAddresses.contractCDPRefactory);

      const dataTx = this.callGetDataWeb3(contract, 'setCDPCEO', [secret, ceo]);
      const changeCeoData = {
        to: contractAddresses.contractCDPRefactory,
        data: dataTx,
        callBeforeFunc: callbackBeforeDone,
        callbackFunc: callbackAfterDone,
      };

      this.postBaseSendTxs(fromUserAddress, [changeCeoData], true)
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          callbackRejected(err);
          console.log('changeCDPCeo - error: ', err);
          reject(err);
        });
    });
  }

  static async liquidatedVault (
    fromUserAddress,
    address,
    unvoteIndex,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected,
  ) {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = ReduxServices.getContractAddress();
      let currentWeb3 = new Web3(web3Instance.currentProvider);
      const contract = new currentWeb3.eth.Contract(
        contractAddresses.contractCDPABI
          ? JSON.parse(contractAddresses.contractCDPABI)
          : abiCDP,
        contractAddresses.contractCDP,
      );
      const dataTx = this.callGetDataWeb3(contract, 'liquidatedVault', [
        address,
        unvoteIndex
      ]);
      const liquidateVaultData = {
        to: contractAddresses.contractCDP,
        data: dataTx,
        callBeforeFunc: callbackBeforeDone,
        callbackFunc: callbackAfterDone,
      };

      this.postBaseSendTxs(fromUserAddress, [liquidateVaultData], true)
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          callbackRejected(err);
          console.log('liquidateVault - error: ', err);
          reject(err);
        });
    });
  }

  static async bulkLiquidatedVaults (
    fromUserAddress,
    addresses,
    unvoteIndexs,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected,
  ) {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = ReduxServices.getContractAddress();
      let currentWeb3 = new Web3(web3Instance.currentProvider);
      const contract = new currentWeb3.eth.Contract(
        contractAddresses.contractCDPABI
          ? JSON.parse(contractAddresses.contractCDPABI)
          : abiCDP,
        contractAddresses.contractCDP,
      );
      const dataTx = this.callGetDataWeb3(contract, 'liquidatedVaults', [
        addresses,
        unvoteIndexs
      ]);
      const liquidateVaultData = {
        to: contractAddresses.contractCDP,
        data: dataTx,
        callBeforeFunc: callbackBeforeDone,
        callbackFunc: callbackAfterDone,
      };

      this.postBaseSendTxs(fromUserAddress, [liquidateVaultData], true)
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          callbackRejected(err);
          console.log('bulkLiquidatedVaults - error: ', err);
          reject(err);
        });
    });
  }

  static async burnOwnerTAI (
    fromUserAddress,
    wad,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected,
  ) {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = ReduxServices.getContractAddress();
      let currentWeb3 = new Web3(web3Instance.currentProvider);
      const contract = new currentWeb3.eth.Contract(abiCDPLiquidated, contractAddresses.contractCDPLiquidated);
      const dataTx = this.callGetDataWeb3(contract, 'burn', [convertBalanceToWei(Number(wad))]);
      const burnTAIData = {
        to: contractAddresses.contractCDPLiquidated,
        data: dataTx,
        callBeforeFunc: callbackBeforeDone,
        callbackFunc: callbackAfterDone,
      };

      let approveFee
      const allowance = await this.checkAllowance(contractAddresses.tokenTAI, fromUserAddress, contractAddresses.contractCDPLiquidated)
      const fiatAmountInWei = convertBalanceToWei(Number(wad))
      if (Number(allowance) < Number(fiatAmountInWei)) {
        approveFee = {
          to: contractAddresses.tokenTAI,
          data: this.encodeApproveTxs(
            contractAddresses.tokenTAI,
            contractAddresses.contractCDPLiquidated,
            fiatAmountInWei
          ),
          callbackData: [burnTAIData],
          isCallBackErr: true,
          callbackErrFunc: callbackRejected
        }
      }

      this.postBaseSendTxs(fromUserAddress, approveFee ? [approveFee] : [burnTAIData], true)
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          callbackRejected(err);
          console.log('burn TAI - error: ', err);
          reject(err);
        });
    });
  }

  static async burnLiquidatedTAI (
    fromUserAddress,
    wad,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected,
  ) {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = ReduxServices.getContractAddress();
      let currentWeb3 = new Web3(web3Instance.currentProvider);
      const contract = new currentWeb3.eth.Contract(abiCDPLiquidated, contractAddresses.contractCDPLiquidated);
      const dataTx = this.callGetDataWeb3(contract, '_burn', [convertBalanceToWei(Number(wad)), convertBalanceToWei(Number(wad))]);
      const burnTAIData = {
        to: contractAddresses.contractCDPLiquidated,
        data: dataTx,
        callBeforeFunc: callbackBeforeDone,
        callbackFunc: callbackAfterDone,
      };

      this.postBaseSendTxs(fromUserAddress, [burnTAIData], true)
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          callbackRejected(err);
          console.log('burn TAI - error: ', err);
          reject(err);
        });
    });
  }

  static async getOwner() {
    return new Promise(async (resolve, reject) => {
      try {
        const contractAddresses = ReduxServices.getContractAddress();
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(abiCDPRefactory, contractAddresses.contractCDPRefactory);
        contract.methods.contracts(CONTRACTS_NAME.CDP_CEO).call((err, result) => {
          if (err) {
            resolve(null);
          }
          resolve(result);
        });
      } catch (err) {
        resolve(null);
      }
    });
  }

  static async getProcessMN () {
    return new Promise(async (resolve, reject) => {
      try {
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contractAddresses = ReduxServices.getContractAddress();
        const contract = new currentWeb3.eth.Contract(abiCDPRefactory, contractAddresses.contractCDPRefactory)
        contract.methods.processMN().call((err, res) => {
          if (err) {
            resolve(false)
          }
          resolve(res)
        })
      } catch (err) {
        resolve(false)
      }
    })
  }

  static async getLockStatus() {
    return new Promise(async (resolve, reject) => {
      try {
        const contractAddresses = ReduxServices.getContractAddress();
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(
          abiCDPRefactory,
          contractAddresses.contractCDPRefactory,
        );
        contract.methods.lockSystem().call((err, result) => {
          if (err) {
            resolve(null);
          }
          resolve(result);
        });
      } catch (err) {
        resolve(null);
      }
    });
  }

  static async getUnvotesBySystems(address, currentVault) {
    return new Promise(async (resolve, reject) => {
      try {
        const contractAddresses = ReduxServices.getContractAddress();
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(
          abiCDP,
          contractAddresses.contractCDP,
        );
        let params = [
          address
        ]
        if (currentVault) {
          params.push(currentVault)
        }
        contract.methods.getUnvotesBySystems(address, currentVault).call((err, result) => {
          if (err) {
            resolve(null);
          }
          resolve(result);
        });
      } catch (err) {
        resolve(null);
      }
    });
  }

  static async getUserVault (address, currentVault = null) {
    return new Promise(async (resolve, reject) => {
      try {
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        let contractAddress = ReduxServices.getContractAddress()
        const contract = new currentWeb3.eth.Contract(abiCDP, contractAddress.contractCDP)
        contract.methods.vaults(address).call((err, res) => {
          if (err || !res) {
            return resolve(null)
          }
          contract.methods.getVault(address, currentVault !== null ? currentVault : res.currentVault).call((err, res2) => {
            if (err) {
              return resolve({ ...res })
            }
            contract.methods.getVault(address, currentVault !== null ? currentVault : res.currentVault, res2._currentBlock).call((err, res3) => {
              if (err) {
                return resolve({ ...res, ...res3 })
              }
              return resolve({ ...res, ...res2, ...res3 })
            })
          })
        })
      } catch (err) {
        return resolve(null)
      }
    })
  }

  static async getInterestInVault(fromBlock, taiAmount) {
    return new Promise(async (resolve, reject) => {
      try {
        let currentBlock = await this.getBlockNumber()
        const contractAddresses = ReduxServices.getContractAddress();
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(
          abiCDP,
          contractAddresses.contractCDP,
        );
        contract.methods.checkInteres(fromBlock, currentBlock, convertBalanceToWei(taiAmount)).call((err, result) => {
          if (err) {
            resolve(null);
          }
          resolve(result);
        });
      } catch (err) {
        resolve(null);
      }
    });
  }

  static async getInterestInVaults() {
    return new Promise(async (resolve, reject) => {
      try {
        const contractAddresses = ReduxServices.getContractAddress();
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(
          abiCDP,
          contractAddresses.contractCDP,
        );
        contract.methods.getInterestInVaults().call((err, result) => {
          if (err) {
            resolve(null);
          }
          resolve(result);
        });
      } catch (err) {
        resolve(null);
      }
    });
  }

  static async getRequestChangeConfigBlock() {
    return new Promise(async (resolve, reject) => {
      try {
        const contractAddresses = ReduxServices.getContractAddress();
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(
          abiCDPRefactory,
          contractAddresses.contractCDPRefactory,
        );
        contract.methods.requestChangeConfigBlock().call((err, result) => {
          if (err) {
            resolve(null);
          }
          resolve(result);
        });
      } catch (err) {
        resolve(null);
      }
    });
  }

  static async getRequestWithdrawBlock() {
    return new Promise(async (resolve, reject) => {
      try {
        const contractAddresses = ReduxServices.getContractAddress();
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(
          abiVoter,
          contractAddresses.contractVoter2,
        );
        contract.methods.requestWDRWBlock().call((err, result) => {
          if (err) {
            resolve(null);
          }
          resolve(result);
        });
      } catch (err) {
        resolve(null);
      }
    });
  }

  static async getBlockPerRequest() {
    return new Promise(async (resolve, reject) => {
      try {
        const contractAddresses = ReduxServices.getContractAddress();
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(
          abiCDPRefactory,
          contractAddresses.contractCDPRefactory,
        );
        contract.methods.BLOCK_PER_REQ().call((err, result) => {
          if (err) {
            resolve(null);
          }
          resolve(result);
        });
      } catch (err) {
        resolve(null);
      }
    });
  }

  static async getValidatorAddress() {
    return new Promise(async (resolve, reject) => {
      try {
        const contractAddresses = ReduxServices.getContractAddress();
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(
          abiVoter,
          contractAddresses.contractVoter2,
        );
        contract.methods.validator().call((err, result) => {
          if (err) {
            resolve(null);
          }
          resolve(result);
        });
      } catch (err) {
        resolve(null);
      }
    });
  }

  static async getVoterCap () {
    return new Promise(async (resolve, reject) => {
      try {
        const contractAddresses = ReduxServices.getContractAddress();
        const validatorAddress = await this.getValidatorAddress();
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(abiTomoValidator, validatorAddress);
        contract.methods.getVoterCap(contractAddresses.addressMasternode, contractAddresses.contractVoter2).call((err, cap) => {
          if (err) {
            resolve(null);
          }
          resolve(cap ? convertWeiToBalance(cap) : 0);
        });
      } catch (err) {
        resolve(null);
      }
    });
  }

  /*
   * TFI
   */
  static async getIsBonusTFI () {
    return new Promise(async (resolve, reject) => {
      try {
        const contractAddresses = ReduxServices.getContractAddress();
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(abiCDP, contractAddresses.contractCDP);
        contract.methods.isBonusTFI().call((err, result) => {
          if (err) {
            resolve(null);
          }
          resolve(result);
        });
      } catch (err) {
        resolve(null);
      }
    });
  }

  static async getTFIBousPercent() {
    return new Promise(async (resolve, reject) => {
      try {
        const contractAddresses = ReduxServices.getContractAddress();
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(abiCDP, contractAddresses.contractCDP);
        contract.methods.TFIBonusPercent().call((err, result) => {
          if (err) {
            resolve(null);
          }
          resolve(result);
        });
      } catch (err) {
        resolve(null);
      }
    });
  }

  /*
   * Campaign
   */
  static async getIsCampaign () {
        return new Promise(async (resolve, reject) => {
      try {
        const contractAddresses = ReduxServices.getContractAddress();
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(abiCDP, contractAddresses.contractCDP);
        contract.methods.isCampaign().call((err, result) => {
          if (err) {
            resolve(null);
          }
          resolve(result);
        });
      } catch (err) {
        resolve(null);
      }
    });
  }

  static async getTokenCampaignAddress(){
    return new Promise(async (resolve, reject) => {
      try {
        const contractAddresses = ReduxServices.getContractAddress();
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(abiCDP, contractAddresses.contractCDP);
        contract.methods.tokenCampaign().call((err, result) => {
          if (err) {
            resolve(null);
          }
          resolve(result);
        });
      } catch (err) {
        resolve(null);
      }
    });
  }

  static async getTokenCampaignAmount() {
    return new Promise(async (resolve, reject) => {
      try {
        const contractAddresses = ReduxServices.getContractAddress();
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(abiCDP, contractAddresses.contractCDP);
        contract.methods.amountTokenCampaign().call((err, result) => {
          if (err) {
            resolve(null);
          }
          resolve(result);
        });
      } catch (err) {
        resolve(null);
      }
    });
  }

  static async getInterestRate() {
    return new Promise(async (resolve, reject) => {
      try {
        const contractAddresses = ReduxServices.getContractAddress();
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(abiCDPRefactory, contractAddresses.contractCDPRefactory);
        contract.methods.interestRate().call((err, result) => {
          if (err) {
            resolve(null);
          }
          resolve(result);
        });
      } catch (err) {
        resolve(null);
      }
    });
  }

  static async getFeeBalanceSystem() {
    return new Promise(async (resolve, reject) => {
      try {
        const contractAddresses = ReduxServices.getContractAddress();
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(abiCDPRefactory, contractAddresses.contractCDPRefactory);
        contract.methods.Fee_balance_system().call((err, result) => {
          if (err) {
            resolve(null);
          }
          resolve(result);
        });
      } catch (err) {
        resolve(null);
      }
    });
  }

  static async getLiquidationRatio() {
    return new Promise(async (resolve, reject) => {
      try {
        const contractAddresses = ReduxServices.getContractAddress();
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(abiCDPRefactory, contractAddresses.contractCDPRefactory);
        contract.methods.LiquidationRatio().call((err, result) => {
          if (err) {
            resolve(null);
          }
          resolve(result);
        });
      } catch (err) {
        resolve(null);
      }
    });
  }

  static async getLiquidationMinimum() {
    return new Promise(async (resolve, reject) => {
      try {
        const contractAddresses = ReduxServices.getContractAddress();
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(abiCDPRefactory, contractAddresses.contractCDPRefactory);
        contract.methods.LiquidationMinimum().call((err, result) => {
          if (err) {
            resolve(null);
          }
          resolve(result);
        });
      } catch (err) {
        resolve(null);
      }
    });
  }

  static async getUsersStaking() {
    return new Promise(async (resolve, reject) => {
      try {
        const contractAddresses = ReduxServices.getContractAddress();
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(abiStaking, contractAddresses.tokenSTFI);
        contract.methods.getUsers().call((err, result) => {
          if (err) {
            resolve(null);
          }
          resolve(result);
        });
      } catch (err) {
        resolve(null);
      }
    });
  }

  static async getUserInfoTFI(address) {
    return new Promise(async (resolve, reject) => {
      try {
        const contractAddresses = ReduxServices.getContractAddress();
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(abiStaking, contractAddresses.tokenSTFI);
        contract.methods.getUserInfo(address).call((err, result) => {
          if (err) {
            resolve(null);
          }
          resolve(convertWeiToBalance(result.totalStaking));
        });
      } catch (err) {
        resolve(null);
      }
    });
  }

  static async getPercentDecimal () {
    return new Promise(async (resolve, reject) => {
      try {
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contractAddresses = ReduxServices.getContractAddress();
        const contract = new currentWeb3.eth.Contract(abiStaking, contractAddresses.tokenSTFI)
        contract.methods.percentDecimals().call((err, res) => {
          if (err || !res) {
            return resolve(0)
          }
          resolve(res)
        })
      } catch (err) {
        resolve(0)
      }
    })
  }

  static async getStackingPercent (address) {
    return new Promise(async (resolve, reject) => {
      try {
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contractAddresses = ReduxServices.getContractAddress();
        const contract = new currentWeb3.eth.Contract(abiStaking, contractAddresses.tokenSTFI)
        contract.methods.stakingPercent(address).call((err, res) => {
          if (err || !res) {
            return resolve(0)
          }
          resolve(convertWeiToBalance(res, 6))
        })
      } catch (err) {
        resolve(0)
      }
    })
  }

  static async calProfit (
    fromUserAddress,
    addresses,
    totalReward,
    totalProfit,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected,
  ) {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = ReduxServices.getContractAddress();
      let currentWeb3 = new Web3(web3Instance.currentProvider);
      const contract = new currentWeb3.eth.Contract(abiStaking, contractAddresses.tokenSTFI);
      const dataTx = this.callGetDataWeb3(contract, 'calProfit', [addresses, totalReward.toString()]);
      const profitData = {
        to: contractAddresses.tokenSTFI,
        data: dataTx,
        value: totalProfit.toString(),
        callBeforeFunc: callbackBeforeDone,
        callbackFunc: callbackAfterDone,
        isCallBackErr: true,
        callbackErrFunc: callbackRejected
      };

      let approveFee
      const allowance = await this.checkAllowance(contractAddresses.tokenSTFI, fromUserAddress, contractAddresses.tokenSTFI)
      if (Number(allowance) < Number(totalReward)) {
        approveFee = {
          to: contractAddresses.tokenSTFI,
          data: this.encodeApproveTxs(
            contractAddresses.tokenSTFI,
            contractAddresses.tokenSTFI,
            totalReward
          ),
          callbackData: [profitData],
          isCallBackErr: true,
          callbackErrFunc: callbackRejected
        }
      }

      this.postBaseSendTxs(fromUserAddress, approveFee ? [approveFee] : [profitData], false)
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          // callbackRejected(err);
          console.log('calProfit - error: ', err);
          reject(err);
        });
    });
  }
  // Create voting
  static async createGovernancesVoting (
    fromUserAddress,
    id,
    timeStart,
    timeEnd,
    minTFI,
    requireTFI,
    typeVote,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected
  ) {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = ReduxServices.getContractAddress()
      let currentWeb3 = new Web3(web3Instance.currentProvider);
      const contract = new currentWeb3.eth.Contract(
        contractAddresses.contractCDPGovernanceABI
          ? JSON.parse(contractAddresses.contractCDPGovernanceABI)
          : abiVoting
        , contractAddresses.contractCDPGovernance
      )
      const dataTx = this.callGetDataWeb3(contract, "createGovernances", [id, timeStart, timeEnd, convertBalanceToWei(Number(minTFI)), convertBalanceToWei(Number(requireTFI)), typeVote])
      //convertBalanceToWei(Number(minTFI)), convertBalanceToWei(Number(requireTFI))
      const votingData = {

        data: dataTx,
        to: contractAddresses.contractCDPGovernance,   callBeforeFunc: callbackBeforeDone,
        callbackFunc: callbackAfterDone
      }

     this.postBaseSendTxs(fromUserAddress, [votingData])
        .then((res) => {
          resolve(res[0])
        })
        .catch((err) => {
          callbackRejected()
          reject(err)
        })

    })
  }

  // Getting Vote
  static async getGovernancesVoting (_id) {
    return new Promise(async (resolve, reject) => {
      try {
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        let contractAddress = ReduxServices.getContractAddress()
        const contract = new currentWeb3.eth.Contract(abiVoting, contractAddress.contractCDPGovernance)
        contract.methods.getGovernances(_id).call((err, res) => {
          if (err || !res) {
            resolve(null)
            console.log("votingList: none")
          }
          if (res) {
            resolve(res)
            console.log("votingList",res)
          } else {
            resolve(0)
            console.log("votingList: 0")
          }
        })
      } catch (err) {
        resolve(null)
      }
    })
  }

  // Updating Vote
  static async updateGovernancesVoting (
    fromUserAddress,
    id,
    timeEnd,
    requireTFI,
    typeVote,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected,
  ) {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = ReduxServices.getContractAddress();
      let currentWeb3 = new Web3(web3Instance.currentProvider);
      const contract = new currentWeb3.eth.Contract(
        contractAddresses.contractCDPGovernanceABI
        ? JSON.parse(contractAddresses.contractCDPGovernanceABI)
        : abiVoting
      , contractAddresses.contractCDPGovernance
      );
      const dataTx = this.callGetDataWeb3(contract, 'updateGovernances', [Number(id), timeEnd, convertBalanceToWei(requireTFI), typeVote]);
      const updateGovernancesVotingData = {
        to: contractAddresses.contractCDPGovernance,
        data: dataTx,
        callBeforeFunc: callbackBeforeDone,
        callbackFunc: callbackAfterDone
      };

      this.postBaseSendTxs(fromUserAddress, [updateGovernancesVotingData])
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          callbackRejected(err);
          console.log('updateGovernancesVoting - error: ', err);
          reject(err);
        });
    });
  }

  // Get owner of contract
  static async getOwnerOfContract (contractAddresses) {
    return new Promise(async (resolve, reject) => {
      try {
        const minABI = [
          {
            constant: true,
            inputs: [],
            name: 'owner',
            outputs: [
              {
                name: '',
                type: 'address',
              },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
          },
        ];
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contract = new currentWeb3.eth.Contract(minABI, contractAddresses)
        contract.methods.owner().call((err, res) => {
          if (err) {
            resolve(null)
          }
          resolve(res)
        })
      } catch (err) {
        resolve(null)
      }
    })
  }

  // Get Guys Mint TAI
  static async getGuys () {
    return new Promise(async (resolve, reject) => {
      try {
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contractAddresses = ReduxServices.getContractAddress();
        const contract = new currentWeb3.eth.Contract(abiMint, contractAddresses.tokenTAI)
        contract.methods.getGuys().call((err, res) => {
          if (err) {
            resolve(false)
          }
          resolve(res)
        })
      } catch (err) {
        resolve(false)
      }
    })
  }

  // checkWards Guys Mint TAI
  static async checkWards (address) {
    return new Promise(async (resolve, reject) => {
      try {
        let currentWeb3 = new Web3(web3Instance.currentProvider);
        const contractAddresses = ReduxServices.getContractAddress();
        const contract = new currentWeb3.eth.Contract(abiMint, contractAddresses.tokenTAI)
        contract.methods.wards(address).call((err, res) => {
          if (err || !res) {
            return resolve(null)
          }
          resolve(res)
        })
      } catch (err) {
        resolve(null)
      }
    })
  }

  // rely user mint TAI
  static async relyUserMintTAI (
    fromUserAddress,
    address,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected,
  ) {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = ReduxServices.getContractAddress();
      let currentWeb3 = new Web3(web3Instance.currentProvider);
      const contract = new currentWeb3.eth.Contract(abiMint, contractAddresses.tokenTAI);
      const dataTx = this.callGetDataWeb3(contract, 'rely', [address]);
      const relyData = {
        to: contractAddresses.tokenTAI,
        data: dataTx,
        callBeforeFunc: callbackBeforeDone,
        callbackFunc: callbackAfterDone
      };

      this.postBaseSendTxs(fromUserAddress, [relyData])
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          callbackRejected(err);
          console.log('relyUserMintTAI - error: ',  err);
          reject(err);
        });
    });
  }

  // deny user mint TAI
  static async denyUserMintTAI (
    fromUserAddress,
    index,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected,
  ) {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = ReduxServices.getContractAddress();
      let currentWeb3 = new Web3(web3Instance.currentProvider);
      const contract = new currentWeb3.eth.Contract(abiMint, contractAddresses.tokenTAI);
      const dataTx = this.callGetDataWeb3(contract, 'deny', [index]);
      const denyData = {
        to: contractAddresses.tokenTAI,
        data: dataTx,
        callBeforeFunc: callbackBeforeDone,
        callbackFunc: callbackAfterDone
      };

      this.postBaseSendTxs(fromUserAddress, [denyData])
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          callbackRejected(err);
          console.log('denyUserMintTAI - error: ',  err);
          reject(err);
        });
    });
  }

  // mint TAI
  static async mintTAI (
    fromUserAddress,
    address,
    value,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected,
  ) {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = ReduxServices.getContractAddress();
      let currentWeb3 = new Web3(web3Instance.currentProvider);
      const contract = new currentWeb3.eth.Contract(abiMint, contractAddresses.tokenTAI);
      const dataTx = this.callGetDataWeb3(contract, 'mint', [address, convertBalanceToWei(value)]);
      const mintTAIData = {
        to: contractAddresses.tokenTAI,
        data: dataTx,
        callBeforeFunc: callbackBeforeDone,
        callbackFunc: callbackAfterDone
      };

      this.postBaseSendTxs(fromUserAddress, [mintTAIData])
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          callbackRejected(err);
          console.log('mintTAI - error: ',  err);
          reject(err);
        });
    });
  }
}




