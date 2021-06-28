import React, { Component } from 'react';
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom';
import ReduxServices from 'src/common/redux'
import Observer from 'src/common/observer'
import { OBSERVER_KEY, KEY_STORE } from 'src/common/constants'
import storageActions from 'src/controller/Redux/actions/storageActions'
import { checkLocalStoreToRedux } from 'src/controller/Redux/lib/reducerConfig'
import store from 'src/controller/Redux/store/configureStore'
import init from 'src/controller/Redux/lib/initState'
import 'antd/dist/antd.min.css'
import './scss/style.scss';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

class App extends Component {
  constructor (props) {
    super(props)
    this.currentInterval = null
  }
  async componentDidMount () {
    const tomochain = window.tomoWeb3
    if (tomochain) {
      ReduxServices.refreshMetaMask()
      tomochain.currentProvider.on('accountsChanged', function (accounts) {
        ReduxServices.refreshMetaMask()
        Observer.emit(OBSERVER_KEY.CHANGED_ACCOUNT)
      })
      tomochain.currentProvider.on('networkChanged', function (accounts) {
        ReduxServices.refreshMetaMask()
        ReduxServices.resetUser()
      })
      tomochain.currentProvider.on('chainChanged', function (accounts) {
        ReduxServices.refreshMetaMask()
      })
    }
    const storageRedux = [
      { key: KEY_STORE.SET_USER, action: storageActions.setUserData, init: init.userData },
      { key: KEY_STORE.SET_SETTING, action: storageActions.setSetting, init: init.setting }
    ]
    
    const promiseArr = storageRedux.map((item) => {
      return checkLocalStoreToRedux(store, item.key, item.action, item.init)
    })
    const initDataPromiseArr = [
      ReduxServices.getSettings(),
      ReduxServices.refreshUserBalance(),
      ReduxServices.refreshTomoPrice()
    ]
    Promise.all([...promiseArr, ...initDataPromiseArr])

    this.currentInterval = setInterval(() => {
      ReduxServices.refreshTomoPrice()
    }, 5000)
  }
  componentWillUnmount () {
    clearInterval(this.currentInterval)
  }
  render() {
    return (
      <HashRouter>
          <React.Suspense fallback={loading}>
            <Switch>
              <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
              <Route path="/" name="Home" render={props => <TheLayout {...props}/>} />
            </Switch>
          </React.Suspense>
      </HashRouter>
    );
  }
}

export default App;
