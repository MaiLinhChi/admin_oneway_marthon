export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'

export const REQUEST_TYPE = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
}

export const METAMASK_INFO = {
  status: {
    Loading: 'loading',
    NoWeb3: 'noweb3',
    Error: 'error',
    Locked: 'locked',
    ChangeAccount: 'changeaccount',
    Ready: 'ready'
  },
  network: {
    1: 'Mainnet',
    2: 'Morden',
    3: 'Ropsten',
    4: 'Rinkeby',
    42: 'Kovan',
    88: 'TomoChain',
    89: 'TestNetTomoChain',
    5777: 'Private'
  }
}

export const OBSERVER_KEY = {
  SIGN_IN: 'SIGN_IN',
  ALREADY_SIGNED: 'ALREADY_SIGNED',
  CHANGED_ACCOUNT: 'CHANGED_ACCOUNT',
  DEPOSIT_TOMO: 'DEPOSIT_TOMO',
  GENERATE_TAI: 'GENERATE_TAI',
  PAYBACK_TAI: 'PAYBACK_TAI'
}

export const KEY_STORE = {
  SET_LOCALE: 'SET_LOCALE',
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  SET_SETTING: 'SET_SETTING',
  SET_TRANSFER_DATA: 'SET_TRANSFER_DATA',
  SET_CONNECTION_METHOD: 'SET_CONNECTION_METHOD',
  SET_CDP: 'SET_CDP'
}

export const STATUS = {
  SUCCESS: 'success',
  PENDING: 'pending'
}

export const COLORS = {
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info',
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  LIGHT: 'light',
  BLACK: '#000000'
}

export const PAGE = {
  LIMIT: 20,
}

export const DATE = {
  FORMAT: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD hh:mm:ss a'
}

export const WEB3_RPC = {
  88: 'https://rpc.tomochain.com',
  89: 'https://rpc.testnet.tomochain.com'
}

export const CONNECTION_METHOD = {
  METAMASK: 'METAMASK',
  WALLET_CONNECT: 'WALLET_CONNECT'
}

export const TIME = {
  WAITING_SECONDS: 1800, // 30 * 60
  TOMO_BLOCK_MINED_SECONDS:  2,
}

export const API_ROUTES = {
  DEPOSITS: '/deposits',
  GENERATES: '/generates',
  PAYBACKS: '/paybacks',
  WITHDRAWS: '/withdraws',
  GET_VOTES: '/admin/voters',
  POST_VOTES: '/admin/voter',
  VAULTS: '/vaults'
}

export const VOTER_ACTIONS = {
  REQUEST_WITHDRAW: 'requestWD',
  WITHDRAW: 'withdraw',
  REQUEST_CONFIG: 'requestConfig',
  CONFIG: 'config'
}

export const ACTIONS_MEANING = {
  requestWD: 'Request for withdrawing rewards',
  withdraw: 'Withdraw rewards',
  requestConfig: `Request for changing the config addresses`,
  requestConfigCDP: `Request for changing CDP's config`,
  config: `Change config addresses`,
}

export const CDP_STATUS = {
  OPEN: 'open',
  LIQUIDATING: 'liquidating',
  LIQUIDATED: 'liquidated'
}

export const COLLATERALIZATION_STATUS = {
  SAFE: 150,
  WARNING: 130,
  LIQUIDATION: 110
}

export const CONTRACTS_NAME = {
  TAI: 'TAI',
  TFI: 'TFI',
  STFI: 'STFI',
  FIAT: 'FIAT',
  CDP: 'CDP',
  VOTER: 'VOTER',
  CDP_LIQUIDATED: 'CDP_liquidated',
  CDP_CEO: 'CDP_ceo',
  MASTER_NODE: 'MN',
  VOTER_ADDRESS30: 'VOTER_address30',
  VOTER_ADDRESS70: 'VOTER_address70',
  TAKE_INTERESTOR: 'takeInterestor',
  LIQUIDATIOR: 'Liquidatior'
}

export const RPC = {
  56: {
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    chainId: '0x38',
    chainName: 'Binance Smart Chain Mainnet',
    nativeCurrency: {
      name: 'Binance',
      symbol: 'BNB',
      decimals: 18
    },
    blockExplorerUrls: ['https://bscscan.com']
  },
  97: {
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    chainId: '0x61',
    chainName: 'Binance Smart Chain Testnet',
    nativeCurrency: {
      name: 'Binance',
      symbol: 'BNB',
      decimals: 18
    },
    blockExplorerUrls: ['https://testnet.bscscan.com']
  },
  88: {
    rpcUrls: ['https://rpc.tomochain.com'],
    chainId: '0x58',
    chainName: 'TomoChain Mainnet',
    nativeCurrency: {
      name: 'TomoChain',
      symbol: 'TOMO',
      decimals: 18
    },
    blockExplorerUrls: ['https://scan.tomochain.com/']
  },
  89: {
    rpcUrls: ['https://rpc.testnet.tomochain.com'],
    chainId: '0x59',
    chainName: 'TomoChain Testnet',
    nativeCurrency: {
      name: 'TomoChain',
      symbol: 'TOMO',
      decimals: 18
    },
    blockExplorerUrls: ['https://scan.testnet.tomochain.com']
  }
}

export const TOMO_RPC = {
  88: {
    rpcUrls: ['https://rpc.tomochain.com'],
    chainId: '88',
    chainName: 'TomoChain Mainnet',
    nativeCurrency: {
      name: 'TomoChain',
      symbol: 'TOMO',
      decimals: 18
    },
    blockExplorerUrls: ['https://scan.tomochain.com/']
  },
  89: {
    rpcUrls: ['https://rpc.testnet.tomochain.com'],
    chainId: '89',
    chainName: 'TomoChain Testnet',
    nativeCurrency: {
      name: 'TomoChain',
      symbol: 'TOMO',
      decimals: 18
    },
    blockExplorerUrls: ['https://scan.testnet.tomochain.com']
  }
}