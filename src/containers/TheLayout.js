import React, { useState, useRef, useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {
  TheContent,
  TheSidebar,
  TheHeader
} from './index'
import { ADMIN_KEY } from 'src/common/constants'
import MyModal from 'src/components/MyModal'
import Observer from 'src/common/observer'
import ChangePasswordModal from 'src/modal/changePasswordModal'

const TheLayout = () => {

  const [sidebarShow, setSidebarShow] = useState(true);

  const dispatch = useDispatch();
  const myModal = useRef()

  
  useEffect(() => {
    Observer.on(ADMIN_KEY.CHANGE_PASSWORD, handleAdmin)
  },[]);

  const closeModal = () => {
    myModal.current && myModal.current.closeModal()
  }

  const handleAdmin = async (callback = null, callbackErr = null) => {
    myModal.current.openModal(
      <ChangePasswordModal closeModal={closeModal} />
    )
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
