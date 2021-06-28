import React, { useState, useEffect } from 'react'
import ReduxServices from 'src/common/redux'
import QRCode from 'qrcode'
import { Tooltip, Row, Col } from 'antd'
import { images } from 'config/images'

async function formatQRCodeImage (data) {
  let result = ''
  const dataString = await QRCode.toString(data, { margin: 0, type: 'svg', width: 230 })
  if (typeof dataString === 'string') {
    result = dataString.replace('<svg', `<svg class="walletconnect-qrcode__image"`)
  }
  return result
}

const QRCodeDisplay = (props) => {
  const [notification, setNotification] = useState(false)
  const [svg, setSvg] = useState('')
  useEffect(() => {
    (async () => {
      setSvg(await formatQRCodeImage(props.uri))
    })()
  }, [])
  const copyToClipboard = () => {
    const tmp = document.createElement('input')
    tmp.value = props.uri
    document.body.appendChild(tmp)
    tmp.select()
    document.execCommand('copy')
    tmp.remove()
    setNotification(true)
    setInterval(() => {
      setNotification(false)
    }, 2000)
  }
  const onVisibleChange = (visible) => {
    setNotification(visible)
  }
  const locale = ReduxServices.getLocale()
  const { messages } = locale
  return (
    <div className='qrcode-display'>
      <div>
        <img src={images.scanQRCode} className='scan-in-app' />
      </div>
      <div className='PT40 PR20 PL20 PB20' style={{ flex: '1 auto' }}>
        <p className='text text-center text-color-4 text-size-sm'>{messages.connectApp.useAppToScanQRcode}</p>
        <div className='MT20 MB15 text text-center' dangerouslySetInnerHTML={{ __html: svg }}></div>
        {/* <Row align='middle' gutter={20}>
          <Col span={13}>
            <div className='flex' style={{ lineHeight: '15px' }}>
              <img src={images.logo} className='MR5' width={25} />
              <span className='text text-bold text-size-sm'>YOSHIMOTO DIGITAL KOREKA</span>
            </div>
          </Col>
          <Col span={11}>
            <img src={images.download.keyring} className='scan-logo-app ML20 MR5' width={25} />
            <span className='text text-bold text-size-sm'>KEYRING PRO</span>
          </Col>
        </Row> */}
        <div className='flex justify-center'>
          <div className='flex' style={{ lineHeight: '15px', width: '160px' }}>
            <img src={images.logo} className='MR5' width={25} />
            <span className='text text-bold text-size-sm'>YOSHIMOTO DIGITAL KOREKA</span>
          </div>
          <div className='ML20'>
            <img src={images.download.keyring} className='scan-logo-app MR5' width={25} />
            <span className='text text-bold text-size-sm'>KEYRING PRO</span>
          </div>
        </div>
        {/* <p className='text text-color-4 text-size-1x MB5'>{messages.connectApp.qrCodeWillUnavailable}</p>
        <Tooltip
          placement='bottom'
          title='Copied to clipboard'
          trigger='click'
          visible={notification}
          onVisibleChange={onVisibleChange}
        >
          <a className='text text-color-1 text-size-1x' onClick={copyToClipboard}>
            <span className='flex inline-flex justify-center'>
              <img src={images.icDocument} className='MR5' />
              <span>{messages.connectApp.copyToClipboard}</span>
            </span>
          </a>
        </Tooltip> */}
      </div>
    </div>
  )
}

export default QRCodeDisplay
