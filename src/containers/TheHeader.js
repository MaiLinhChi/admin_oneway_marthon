import React, {useEffect} from 'react'
import {
    CHeader,
    CToggler,
    CHeaderNav,
    CHeaderNavItem,
    CHeaderNavLink,
    CSubheader,
    CBreadcrumbRouter, CButton,CLink
} from '@coreui/react'

// routes config
import routes from '../routes'
import Observer from "../common/observer";
import {OBSERVER_KEY} from "../common/constants";
import ReduxServices from "../common/redux";
import storeRedux from 'src/controller/Redux/store/configureStore'
import { convertAddressArrToString, detectAddress } from 'src/common/function';

const TheHeader = ({sidebarShow, setSidebarShow}) => {
    let isSigned;
    const { userData } = storeRedux.getState()
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
            {
            !isSigned
            ?
            <CButton active block color="info" aria-pressed="true" onClick={handleSignIn} style={{width: 100}}>Connect</CButton>
            :
            <CLink href={detectAddress(userData.address)} target="_blank">{convertAddressArrToString([userData.address])}</CLink>
            }

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
