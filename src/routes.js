import React from 'react'

const User = React.lazy(() => import('./pages/user'));
const Marathon = React.lazy(() => import('./pages/marathon'));
const Bib = React.lazy(() => import('./pages/bib'));

const routes = [
  { path: '/', exact: true, name: 'User', component: User },
  { path: '/users', name: 'Users', component: User },
  { path: '/marathon', name: 'Marathon', component: Marathon },
  { path: '/bib', name: 'Bib', component: Bib },
]

export default routes
