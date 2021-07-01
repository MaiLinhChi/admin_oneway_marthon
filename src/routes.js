import React from 'react'

const Account = React.lazy(() => import('./views/account'));
const Setting = React.lazy(() => import('./views/setting'));
const Bet = React.lazy(() => import('./views/bet'));
const Game = React.lazy(() => import('./views/game'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/account', name: 'Account', component: Account },
  { path: '/setting', name: 'Setting', component: Setting },
  { path: '/games', name: 'Games', component: Game },
  { path: '/bets', name: 'Bets', component: Bet },
]

export default routes
