import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import ReduxServices from 'src/common/redux'
import { KEY_STORE } from 'src/common/constants'
import storageActions from 'src/controller/Redux/actions/storageActions'
import { checkLocalStoreToRedux } from 'src/controller/Redux/lib/reducerConfig'
import store from 'src/controller/Redux/store/configureStore'
import init from 'src/controller/Redux/lib/initState'
import 'antd/dist/antd.min.css'
import './scss/style.scss';
import Loading from './components/Loading';

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));
class App extends Component {
  constructor (props) {
    super(props)
    this.currentInterval = null
  }
  async componentDidMount () {
    try {
      if (process.env.MAINTENANCE_MODE === 'true') {
        this.setState({
          isLoading: false
        })
        return
      }

      const storageRedux = [
        { key: KEY_STORE.SET_LOCALE, action: storageActions.setLocale, init: init.lang },
        { key: KEY_STORE.SET_CONNECTION_METHOD, action: storageActions.setConnectionMethod, init: init.connectionMethod },
        { key: KEY_STORE.SET_USER, action: storageActions.setUserData, init: init.userData },
        { key: KEY_STORE.SET_TRANSFER_DATA, action: storageActions.setTransferData, init: init.transferData },
        { key: KEY_STORE.SET_SETTING, action: storageActions.setSetting, init: init.setting },
        { key: KEY_STORE.SET_CART, action: storageActions.setCart, init: init.cart },
        { key: KEY_STORE.SET_TOKENS, action: storageActions.setTokens, init: init.tokensRedux },
        { key: KEY_STORE.SET_GIFT_CARDS, action: storageActions.setGiftCards, init: init.giftCards },
        { key: KEY_STORE.SET_PAYMENT_DATA, action: storageActions.setPaymentData, init: init.paymentData }
      ]
      // eslint-disable-next-line
      const promiseArr = storageRedux.map((item) => {
        checkLocalStoreToRedux(store, item.key, item.action, item.init)
      })
      // const promiseArr = storageRedux.forEach((item) => {
      //   checkLocalStoreToRedux(store, item.key, item.action, item.init)
      // })
      await Promise.all(promiseArr)

      // in the case reload page: need to wait for detect connection method already in use before showing page
      await ReduxServices.detectConnectionMethod()

    } finally {
      this.setState({
        isLoading: false
      })
    }
    const storageRedux = [
      { key: KEY_STORE.SET_USER, action: storageActions.setUserData, init: init.userData },
      { key: KEY_STORE.SET_SETTING, action: storageActions.setSetting, init: init.setting }
    ]

    const promiseArr = storageRedux.map((item) => {
      return checkLocalStoreToRedux(store, item.key, item.action, item.init)
    })

    Promise.all([...promiseArr])

  }
  componentWillUnmount () {
    clearInterval(this.currentInterval)
  }
  render() {
    return (
      <HashRouter>
          <React.Suspense fallback={<Loading />}>
            <Switch>
              <Route exact path="/login" name="Login Page" render={props => <Login {...props} />} />
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
