import React, { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  TheContent,
  TheSidebar,
  TheHeader
} from './index'
import storeRedux from 'src/controller/Redux/store/configureStore'
import { OBSERVER_KEY, CONNECTION_METHOD } from 'src/common/constants'
import { isMobile } from 'react-device-detect'
import MetaMaskServices from 'src/controller/MetaMask'
import StorageAction from 'src/controller/Redux/actions/storageActions'
import MyModal from 'src/components/MyModal'
import ConnectApp from 'src/components/ConnectApp'
import Observer from 'src/common/observer'

const TheLayout = () => {

  const [sidebarShow, setSidebarShow] = useState(true);

  const dispatch = useDispatch();
  const dispatchSetConnectionMethod = (method) => dispatch(StorageAction.setConnectionMethod(method))
  const myModal = useRef()
  
  useEffect(() => {
    Observer.on(OBSERVER_KEY.SIGN_IN, handleSignIn)
    const { metamaskRedux} = storeRedux.getState()

    if(metamaskRedux && metamaskRedux.address){
      dispatchSetConnectionMethod(CONNECTION_METHOD.METAMASK)
      MetaMaskServices.initialize()
    }
    return function cleanup() {
      Observer.removeListener(OBSERVER_KEY.SIGN_IN, handleSignIn)
    };
  // eslint-disable-next-line
  },[]);

  const closeModal = () => {
    myModal.current && myModal.current.closeModal()
  }

  const handleSignIn = async (callback = null, callbackErr = null) => {
    if (isMobile) {
      dispatchSetConnectionMethod(CONNECTION_METHOD.METAMASK)
      MetaMaskServices.initialize()
    } else {
      myModal.current.openModal(
        <ConnectApp
          closeModal={closeModal}
          callback={() => callback(callback)}
          callbackErr={() => callbackErr(callbackErr)}
        />, { modalWidth: 380 }
      )
    }
  }

  return (
    <div className="c-app c-default-layout">
      <TheSidebar sidebarShow={sidebarShow} setSidebarShow={setSidebarShow}/>
      <div className="c-wrapper">
        <TheHeader sidebarShow={sidebarShow} setSidebarShow={setSidebarShow}/>
        <div className="c-body">
          <TheContent/>
        </div>
      </div>
      <MyModal ref={myModal} />
    </div>
  )
}

export default TheLayout
