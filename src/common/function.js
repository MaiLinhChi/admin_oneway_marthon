import bigdecimal from 'bigdecimal'
import { notification } from 'antd'

export const saveDataLocal = (key, data) => {
  // eslint-disable-next-line no-undef
  localStorage.setItem(key, JSON.stringify(data))
}

export const getDataLocal = (key) => {
  // eslint-disable-next-line no-undef
  return JSON.parse(localStorage.getItem(key))
}

export const removeDataLocal = (key) => {
  // eslint-disable-next-line no-undef
  localStorage.removeItem(key)
}

export const scientificToDecimal = (num) => {
  const sign = Math.sign(num)
  // if the number is in scientific notation remove it
  if (/\d+\.?\d*e[+-]*\d+/i.test(num)) {
    const zero = '0'
    const parts = String(num).toLowerCase().split('e') // split into coeff and exponent
    const e = parts.pop() // store the exponential part
    let l = Math.abs(e) // get the number of zeros
    const direction = e / l // use to determine the zeroes on the left or right
    const coeffArray = parts[0].split('.')

    if (direction === -1) {
      coeffArray[0] = Math.abs(coeffArray[0])
      num = zero + '.' + new Array(l).join(zero) + coeffArray.join('')
    } else {
      const dec = coeffArray[1]
      if (dec) l = l - dec.length
      num = coeffArray.join('') + new Array(l + 1).join(zero)
    }
  }

  if (sign < 0) {
    num = -num
  }

  return num
}

export const roundingNumber = (number, rounding = 7) => {
  const powNumber = Math.pow(10, parseInt(rounding))
  return Math.floor(number * powNumber) / powNumber
}

export const convertBalanceToWei = (strValue, iDecimal = 18) => {
  var multiplyNum = new bigdecimal.BigDecimal(Math.pow(10, iDecimal))
  var convertValue = new bigdecimal.BigDecimal(String(strValue))
  return multiplyNum.multiply(convertValue).toString().split('.')[0]
}

export const convertWeiToBalance = (strValue, iDecimal = 18) => {
  var multiplyNum = new bigdecimal.BigDecimal(Math.pow(10, iDecimal))
  var convertValue = new bigdecimal.BigDecimal(String(strValue))
  return scientificToDecimal(convertValue.divide(multiplyNum).toString())
}

export const detectTransaction = (txhash) => {
  if (parseInt(process.env.REACT_APP_NETWORK_ID) === 88) {
    return `https://scan.tomochain.com/txs/${txhash}`
  } else {
    return `https://scan.testnet.tomochain.com/txs/${txhash}`
  }
}

export const detectAddress = (address) => {
  if (parseInt(process.env.REACT_APP_NETWORK_ID) === 88) {
    return `https://scan.tomochain.com/address/${address}`
  } else {
    return `https://scan.testnet.tomochain.com/address/${address}`
  }
}

/**
 *
 * @param {string} description
 * @param {string} title
 * @param {string} type success|error|info|warn|open|close| at https://ant.design/components/notification/
 */
export const showNotification = (title = null, type = 'error', description = '', className = 'notification-error', icon = '', ) => {
  notification[type]({
    message: title,
    description: description || '',
    placement: 'bottomRight',
    className,
    icon,
    bottom: 54,
    duration: 5
  })
}

export const destroyNotification = () => {
  notification.destroy()
}

export const checkIsSigned = (userData, metamaskRedux) => {
  if (userData && metamaskRedux) {
    return lowerCase(metamaskRedux.account) === lowerCase(userData.address) && userData.isSigned
  } else {
    return false
  }
}

export const lowerCase = (value) => {
  return value ? value.toLowerCase() : value
}

export const isObject = (value) => {
  return value && typeof value === 'object' && value.constructor === Object
}

export const isUserDeniedTransaction = (err = null) => {
  err = isObject(err) ? err : {}
  const deninedMsg = 'User denied transaction signature'
  return (err.message && err.message.includes(deninedMsg)) || (err.stack && err.stack.includes(deninedMsg))
}

export const numberWithCommas = (x) => {
  var parts = x.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export const formatDecimalJavascript = (number) => {
  return Math.round(number * 1e12) / 1e12
}

export const countDots = (strString, strLetter) => {
  let string = strString.toString()
  return (string.match(RegExp(strLetter, 'g')) || []).length
}

export const validateAddress = (strAddress) => {
  var reg = ''
  if (!strAddress.startsWith('0x')) {
    return false
  }

  if (countDots(strAddress, '\\x') > 1) {
    reg = /^([A-Fa-f0-9_]+)$/
  } else {
    reg = /^([A-Fa-f0-9_x]+)$/
  }

  return reg.test(strAddress)
}
export const validateNumber = (strNumber) => {
  const reg = /^[0-9]+(\.)?[0-9]*$/
  return reg.test(scientificToDecimal(strNumber))
}

export const getCurrentBrowserLanguage = () => {
  let language = navigator.language.toLowerCase()
  switch (language) {
  case 'en-us':
  case 'en':
    language = 'en'
    break
  case 'ja-jp':
  case 'ja':
  case 'jp':
    language = 'ja'
    break
  case 'zh-cn':
  case 'zh':
  case 'cn':
    language = 'cn'
    break
  case 'vi-vn':
  case 'vi':
    language = 'vi'
    break
  }
  return language
}

export const convertAddressArrToString = (arrAddress, numStart = 4, numEnd = 4) => {
  if (arrAddress.length === 1) {
    return arrAddress[0].substring(0, numStart) + '...' + arrAddress[0].substring(arrAddress[0].length - numEnd, arrAddress[0].length)
  } else if ((arrAddress.length > 1)) {
    let stringTemp = ''
    arrAddress.map((item, index) => {
      index !== arrAddress.length - 1 ? stringTemp += convertAddressArrToString([item]) + '\n' : stringTemp += convertAddressArrToString([item])
    })
  }
}
