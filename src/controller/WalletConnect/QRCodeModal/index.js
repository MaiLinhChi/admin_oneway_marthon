import React from 'react'
import ReactDOM from 'react-dom'
import QRCodeDisplay from './qrcodeDisplay'
import { getDocumentOrThrow } from '@walletconnect/utils'
import { Modal } from 'antd'
const CONFIG = {
  WALLETCONNECT_WRAPPER_ID: 'connect-app-container',
  WALLETCONNECT_MODAL_CLASS: 'connect-app-modal'
}

function renderWrapper () {
  const doc = getDocumentOrThrow()
  const wrapper = doc.createElement('div')
  wrapper.setAttribute('id', CONFIG.WALLETCONNECT_WRAPPER_ID)
  doc.body.appendChild(wrapper)
  return wrapper
}

function triggerClose () {
  const doc = getDocumentOrThrow()
  const modal = doc.getElementsByClassName(CONFIG.WALLETCONNECT_MODAL_CLASS)
  if (modal && modal[0]) {
    let parent = modal[0].parentNode
    parent.removeChild(modal[0])
    parent.innerHTML = ''
  }
  doc.body.classList.remove('ant-scrolling-effect')
  doc.body.style.width = '100%'
  doc.body.style.overflow = 'auto'
}

function getWrappedCallback (cb) {
  return () => {
    triggerClose()
    cb && cb()
  }
}

function open (uri, cb) {
  const wrapper = renderWrapper()
  if (wrapper) {
    ReactDOM.render(
      <Modal
        wrapClassName={CONFIG.WALLETCONNECT_MODAL_CLASS}
        title={null}
        footer={null}
        onOk={null}
        onCancel={triggerClose}
        centered
        visible
        width={686}
      >
        <QRCodeDisplay uri={uri} onClose={getWrappedCallback(cb)} />
      </Modal>,
      wrapper
    )
  }
}

function close () {
  triggerClose()
}

export default { open, close }
