import React from 'react'
import MetaMaskServices from 'src/controller/MetaMask'
import WalletConnectServices from 'src/controller/WalletConnect'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import StorageAction from 'src/controller/Redux/actions/storageActions'
import { CONNECTION_METHOD } from 'src/common/constants'
import { Button } from 'antd'
import walletconnect from 'src/assets/img/Download/walletconnect.svg'
import metamask from 'src/assets/img/Download/metamask.png'
import './style.scss'

const ConnectApp = (props) => {
  const { messages } = props.locale
  const onConnectViaWalletConnect = () => {
    props.setConnectionMethod(CONNECTION_METHOD.WALLET_CONNECT)
    props.closeModal()
    WalletConnectServices.initialize()
  }
  const onConnectViaMetaMask = async () => {
    props.setConnectionMethod(CONNECTION_METHOD.METAMASK)
    props.closeModal()
    MetaMaskServices.initialize()
  }
  return (
    <div className='connect-app-container'>
      <h2 className='text text-title text-left MB30'>{messages.connectApp.connectTo}</h2>
      <Button block type='default' className='ant-big-btn btn-connect-extension MB10' onClick={onConnectViaMetaMask}>
        <span style={{float:'left',marginLeft:'10px'}}>{messages.connectApp.metamask}</span>
        <img src={metamask} style={{float:'right',marginRight:'5px'}}/>
      </Button>
      <Button block className='ant-big-btn btn-wallet-connect ' onClick={onConnectViaWalletConnect}>
        <span style={{float:'left',marginLeft:'10px'}}>WalletConnect</span>
        <img src={walletconnect} className='MR7' width={20} style={{float:'right',marginTop:'5px',marginRight:'5px'}} />
      </Button>
    </div>
  )
}

const mapStateToProps = (state) => ({
  locale: state.locale,
  userData: state.userData,
  metamaskRedux: state.metamaskRedux
})

const mapDispatchToProps = (dispatch) => {
  return {
    setConnectionMethod: bindActionCreators(StorageAction.setConnectionMethod, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectApp)
