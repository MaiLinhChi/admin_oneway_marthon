import React, {useEffect} from 'react'
import { useSelector } from 'react-redux';
import {
  CHeader,
  CToggler,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CSubheader,
  CBreadcrumbRouter, CButton
} from '@coreui/react'

// routes config
import routes from '../routes'
import Observer from "../common/observer";
import { OBSERVER_KEY } from "../common/constants";
import ReduxServices from "../common/redux";
import TheHeaderDropdown from 'src/containers/TheHeaderDropdown';

const TheHeader = ({sidebarShow, setSidebarShow}) => {
    let isSigned;
  const userData = useSelector(state => state.userData)
  const handleSignIn = () => {
    Observer.emit(OBSERVER_KEY.SIGN_IN);
  };
  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    setSidebarShow(val);
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    setSidebarShow(val);
  }
  useEffect(() => {
      if(userData) isSigned = ReduxServices.checkIsSigned()
  })

  const renderConnect = () => {
    const isSigned = ReduxServices.checkIsSigned()
    if (isSigned) {
      return <TheHeaderDropdown userData={userData} />
    } else {
      return <CButton active block color="info" aria-pressed="true" onClick={handleSignIn} style={{ width: 100 }}>Connect</CButton>
    }
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
        <CHeaderNavItem className="px-3" >
          <CHeaderNavLink to="/dashboard">Dashboard</CHeaderNavLink>
        </CHeaderNavItem>
      </CHeaderNav>
      <CHeaderNav className="px-3">
        {renderConnect()}
      </CHeaderNav>
      <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter
          className="border-0 c-subheader-nav m-0 px-0 px-md-3"
          routes={routes}
        />
      </CSubheader>

    </CHeader>
  )
}

export default TheHeader
