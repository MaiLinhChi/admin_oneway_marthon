import React from 'react'
import {
  CHeader,
  CToggler,
  CHeaderNav,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CSidebarNavItem,
  CCreateElement,
} from '@coreui/react'
import {navUser} from './_nav'

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
    <CHeader withSubheader style={{zIndex: 2}}>
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
      <CHeaderNav className="d-md-down-none ml-auto pr-4">
        <CDropdown>
          <CDropdownToggle color="secondary">Account</CDropdownToggle>
          <CDropdownMenu>
          <CCreateElement
            items={navUser}
            components={{
              CSidebarNavItem,
            }}
          />
          </CDropdownMenu>
        </CDropdown>
      </CHeaderNav>
    </CHeader>
  )
}

export default TheHeader
