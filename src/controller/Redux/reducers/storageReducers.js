import createReducer from '../lib/reducerConfig'
import { KEY_STORE } from 'src/common/constants'
import initState from '../lib/initState'

export const userData = createReducer(initState.userData, {
  [KEY_STORE.SET_USER] (state, action) {
    return action.payload
  }
})

export const settingRedux = createReducer(initState.setting, {
  [KEY_STORE.SET_SETTING] (state, action) {
    return action.payload
  }
})
