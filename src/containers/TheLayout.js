import React, { useState, useRef, useEffect } from 'react'
import {
  TheContent,
  TheSidebar,
  TheHeader
} from './index'
import { ADMIN_KEY, BIB_KEY, MARATHON_KEY } from 'src/common/constants'
import MyModal from 'src/components/MyModal'
import Observer from 'src/common/observer'
import ChangePasswordModal from 'src/modal/user/change-password'
import AddBibModal from 'src/modal/bib/add-bib'
import AddMarathonModal from 'src/modal/marathons/add-marathon'
import EditMarathonModal from 'src/modal/marathons/edit-marathon'
import EditBibModal from 'src/modal/bib/edit-bib'

const TheLayout = () => {
  const [sidebarShow, setSidebarShow] = useState(true);
  const myModal = useRef()

  useEffect(() => {
    Observer.on(ADMIN_KEY.CHANGE_PASSWORD, handleAdmin)
    Observer.on(BIB_KEY.BIB, handleBib)
    Observer.on(MARATHON_KEY.MARATHON, handleMarathons)
  }, []);

  const closeModal = () => {
    myModal.current && myModal.current.closeModal()
  }

  const handleAdmin = async () => {
    myModal.current.openModal(
      <ChangePasswordModal closeModal={closeModal} />
    )
  }

  const handleBib = async ({type, payload}) => {
    if(type === "ADD") {
      myModal.current.openModal(
        <AddBibModal closeModal={closeModal} />
      )
    } else {
      myModal.current.openModal(
        <EditBibModal closeModal={closeModal} />
      )
    }
  }

  const handleMarathons = async ({type, payload}) => {
    if(type === "ADD") {
      myModal.current.openModal(
        <AddMarathonModal closeModal={closeModal} getData={payload.getData} />
      )
    } else {
      myModal.current.openModal(
        <EditMarathonModal closeModal={closeModal} data={payload.data} getData={payload.getData} />
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
