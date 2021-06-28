import React from 'react'
import { Modal } from 'antd'
import './style.scss'
class MyModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isShowModal: false,
      modalContent: null,
      config: {
        modalWidth: 480,
        closable: true,
        wrapClassName: ''
      }
    }
  }

  componentDidMount () {
    // code here
  }

  openModal = (modalContent, config = { modalWidth: 600, closable: true, wrapClassName: '', maskStyle: {} }) => {
    this.setState({
      isShowModal: true,
      modalContent,
      config
    })
  }

  closeModal = () => {
    this.setState({
      isShowModal: false,
      modalContent: null
    })
    const { customClose } = this.props
    customClose && customClose()
  }

  render () {
    const { isShowModal, modalContent, config } = this.state
    return (
      <Modal
        wrapClassName={config.wrapClassName}
        width={config.modalWidth}
        title={null}
        footer={null}
        centered
        visible={isShowModal}
        onOk={null}
        onCancel={this.closeModal}
        closable={config.closable}
        maskClosable={config.closable}
        maskStyle={config.maskStyle}
      >
        {modalContent && modalContent}
      </Modal>
    )
  }
}

export default MyModal
