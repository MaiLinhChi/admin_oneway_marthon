import createReducer from '../lib/reducerConfig'
import { KEY_PAGE } from '../lib/constants'
import initState from '../lib/initState'

export const internetRedux = createReducer(initState.internet, {
  [KEY_PAGE.SET_INTERNET] (state, action) {
    return action.payload
  }
})

export const metamaskRedux = createReducer(initState.metamaskRedux, {
  [KEY_PAGE.SET_METAMASK_INFO] (state, action) {
    return action.payload
  }
})

export const balanceRedux = createReducer(initState.balanceRedux, {
  [KEY_PAGE.SET_BALANCE] (state, action) {
    return action.payload
  }
})

export const tomoPrice = createReducer(initState.tomoPrice, {
  [KEY_PAGE.SET_TOMO_PRICE] (state, action) {
    return action.payload
  }
})
