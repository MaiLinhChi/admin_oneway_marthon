import React, { useState } from 'react'
import {
  TheContent,
  TheSidebar,
  TheFooter,
  TheHeader
} from './index'

const TheLayout = () => {

  const [sidebarShow, setSidebarShow] = useState(true);

  return (
    <div className="c-app c-default-layout">
      <TheSidebar sidebarShow={sidebarShow} setSidebarShow={setSidebarShow}/>
      <div className="c-wrapper">
        <TheHeader sidebarShow={sidebarShow} setSidebarShow={setSidebarShow}/>
        <div className="c-body">
          <TheContent/>
        </div>
        <TheFooter/>
      </div>
    </div>
  )
}

export default TheLayout
