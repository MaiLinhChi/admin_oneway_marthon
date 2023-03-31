import React, { useState, useRef, useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {
  TheContent,
  TheSidebar,
  TheHeader
} from './index'
import { OBSERVER_KEY, CONNECTION_METHOD } from 'src/common/constants'
import { isMobile } from 'react-device-detect'
import MyModal from 'src/components/MyModal'
import Observer from 'src/common/observer'

const TheLayout = () => {

  const [sidebarShow, setSidebarShow] = useState(true);

  const metamaskRedux = useSelector(state => state.metamaskRedux)
  const dispatch = useDispatch();
  const myModal = useRef()

  
  useEffect(() => {
    Observer.on(OBSERVER_KEY.SIGN_IN, handleSignIn)

    if(metamaskRedux && metamaskRedux.address){
    }
    return function cleanup() {
      Observer.removeListener(OBSERVER_KEY.SIGN_IN, handleSignIn)
    };
  // eslint-disable-next-line
  },[]);

  useEffect(() => {
    if(metamaskRedux && metamaskRedux.address){
    }

  // eslint-disable-next-line
  },[metamaskRedux.address]);

  const closeModal = () => {
    myModal.current && myModal.current.closeModal()
  }

  const handleSignIn = async (callback = null, callbackErr = null) => {
    if (isMobile) {
    } else {
      myModal.current.openModal(
        <h1>hello</h1>
      )
    }
  }

  return (
    <div className="c-app c-default-layout">
      <TheSidebar sidebarShow={sidebarShow} setSidebarShow={setSidebarShow}/>
      <div className="c-wrapper">
        {/* <TheHeader sidebarShow={sidebarShow} setSidebarShow={setSidebarShow}/> */}
        <div className="c-body">
          <TheContent/>
        </div>
      </div>
      <MyModal ref={myModal} />
    </div>
  )
}

export default TheLayout
