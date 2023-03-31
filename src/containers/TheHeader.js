import React from 'react'
import {
  CHeader,
  CToggler,
  CHeaderNav,
} from '@coreui/react'

const TheHeader = ({sidebarShow, setSidebarShow}) => {
  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    setSidebarShow(val);
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    setSidebarShow(val);
  }

  return (
    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderNav className="d-md-down-none mr-auto">
      </CHeaderNav>
    </CHeader>
  )
}

export default TheHeader
