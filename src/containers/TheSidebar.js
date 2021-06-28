import React from 'react'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CImg
} from '@coreui/react'

// sidebar nav config
import navigation from './_nav'

const TheSidebar = ({sidebarShow, setSidebarShow}) => {
  return (
    <CSidebar
      show={sidebarShow}
      onShowChange={(val) => setSidebarShow(val)}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        <CImg
          src={'logo.svg'}
          // width={'150'}
        />
        <h5 style={{marginLeft: 10, color: '#fff', fontWeight: 'bold'}}>Binary Option</h5>
      </CSidebarBrand>
      <CSidebarNav>

        <CCreateElement
          items={navigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
