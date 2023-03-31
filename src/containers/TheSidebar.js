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
      <CSidebarBrand className="d-md-down-none d-flex align-items-center" to="/">
        <CImg
          src={'logo.svg'}
          width={40}
          className="mr-2"
        />
        <h5 style={{margin: 0, color: '#fff', fontWeight: 'bold'}}>OneWay Option</h5>
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
