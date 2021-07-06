import React from 'react'
import ReduxServices from 'src/common/redux'
import { removeDataLocal } from 'src/common/function'
import CIcon from '@coreui/icons-react'

const _nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Users',
    to: '/users',
    icon: <CIcon name="cil-user" customClasses="c-sidebar-nav-icon"/>
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Games',
    to: '/games',
    icon: <CIcon name="cil-list" customClasses="c-sidebar-nav-icon"/>
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Bets',
    to: '/bets',
    icon: <CIcon name="cil-list" customClasses="c-sidebar-nav-icon"/>
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Setting',
    to: '/setting',
    icon: <CIcon name="cil-settings" customClasses="c-sidebar-nav-icon"/>
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Account',
    to: '/account',
    icon: <CIcon name="cil-user-follow" customClasses="c-sidebar-nav-icon"/>
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Logout',
    to: '/login',
    onClick: () => {
      removeDataLocal('userAuth')
      ReduxServices.resetUser()
    },
    icon: <CIcon name={'cil-x'} customClasses="c-sidebar-nav-icon"/>
  }
]

export default _nav
