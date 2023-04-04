import React from 'react'
import ReduxServices from 'src/common/redux'
import { removeDataLocal } from 'src/common/function'
import CIcon from '@coreui/icons-react'
import Observer from "../common/observer";
import { ADMIN_KEY } from "../common/constants";

const navBar =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Users',
    to: '/users',
    icon: <CIcon name="cil-user" customClasses="c-sidebar-nav-icon"/>
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Marathon',
    to: '/marathon',
    icon: <CIcon name='cil-running' customClasses="c-sidebar-nav-icon"/>
  }
]

const navUser = [
  {
    _tag: 'CSidebarNavItem',
    name: 'Change password',
    onClick: () => {
      Observer.emit(ADMIN_KEY.CHANGE_PASSWORD);
    },
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Log out',
    to: '/login',
    onClick: () => {
      removeDataLocal('userAuth')
      ReduxServices.resetUser()
    },
  }
]

export { navBar, navUser }
