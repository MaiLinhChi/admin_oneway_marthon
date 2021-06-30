import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CLabel,
  CInput,
  CInputGroup,
  CCard,
  CRow,
  CCollapse,
  CFade,
  CLink,
  CFormGroup
} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { Button } from 'antd'
import { detectAddress, convertAddressArrToString, validateAddress, showNotification, destroyNotification, isUserDeniedTransaction } from 'src/common/function';
import { contractHightOrLow, callGetDataWeb3, postBaseSendTxs } from 'src/controller/Web3'
import PriceInput from 'src/components/PriceInput'
import storeRedux from 'src/controller/Redux/store/configureStore'

const Account = () => {
  const [feePercent, setFeePercent] = useState(0);
  const [feePercentInput, setFeePercentInput] = useState('');
  const [isErrorFee, setIsErrorFee] = useState(true);
  const [errorMessageFee, setErrorMessageFee] = useState('');

  const [takeFee, setTakeFee] = useState('');
  const [takeFeeInput, setTakeFeeInput] = useState('');
  const [isErrorTakeFeeInput, setIsErrorTakeFeeInput] = useState(true);
  const [errorMessageTakeFeeInput, setErrorMessageTakeFeeInput] = useState('');

  const [collapsed, setCollapsed] = React.useState(true)
  const [isLoading, setLoading] = useState(false)

  const { userData } = storeRedux.getState()

  useEffect(() => {
    contractHightOrLow().methods.feePercent().call().then(setFeePercent);
    contractHightOrLow().methods.takeFee().call().then(setTakeFee);
    console.log(takeFee)
  }, [])

  const onChangeFee = (value, isReset = false) => {
    setFeePercentInput(value.number)
    if (value.number !== '') {
      let isError = false
      let newValue = Number(value.number)
      if (newValue <= 0) {
        isError = true
        setErrorMessageFee(`The minimum should be greater than 0`)
      }
      setIsErrorFee(isError)
    } else {
      if(!isReset){
        setIsErrorFee(true)
      setErrorMessageFee('_feePercent cannot be empty')
      }
    }
  }

  const onChangeTakeFee = (e) => {
    let value = e.target.value.toString()
    setTakeFeeInput(value)
    if (value !== '') {
      let isError = false;
      if (!validateAddress(value)) {
        isError = true
        setErrorMessageTakeFeeInput(`Invalid Address`)
      }
      setIsErrorTakeFeeInput(isError)
    } else {
      setIsErrorTakeFeeInput(true)
      setErrorMessageTakeFeeInput('_takeFee cannot be empty')
    }
  }
  const setFee = async (
    fromAddress,
    feePercent,
    takeFee,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected
  ) => {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = process.env.REACT_APP_CONTRACT
      const contract = contractHightOrLow()
      const dataTx = callGetDataWeb3(contract, 'setFee', [feePercent, takeFee])
      const setFeeData = {
        from: userData.address,
        to: contractAddresses,
        data: dataTx,
        callBeforeFunc: callbackBeforeDone,
        callbackFunc: callbackAfterDone,
        isCallBackErr: true,
        callbackErrFunc: callbackRejected
      }
      postBaseSendTxs(fromAddress, [setFeeData], true)
        .then((res) => {
          resolve(res[0])
        })
        .catch((err) => {
          callbackRejected(err)
          reject(err)
        })
    })
  }

  const handleSetFee = () => {
    const callbackBeforeDone = () => {
      showNotification(
        `Setting Fee`,
        'Waiting for transaction signature...'
      )
    }
    const callbackAfterDone = async (res) => {
      destroyNotification()
      showNotification(
        `Setting Fee`,
        'Successfully'
      )
      contractHightOrLow().methods.feePercent().call().then(setFeePercent);
      contractHightOrLow().methods.takeFee().call().then(setTakeFee);
      onChangeFee({number: ''},true);
      // setFeePercentInput('')
      setTakeFeeInput('');
      setLoading(false)
    }
    const callbackRejected = (err) => {
      destroyNotification()
      if (isUserDeniedTransaction(err)) {
        showNotification(
          `Setting Fee`,
          'Transaction denied'
        )
        setLoading(false)
      } else {
        showNotification(
          `Setting Fee`,
          'Transaction failed'
        )
        setLoading(false)
      }
    }
    setFee(
      userData.address,
      feePercentInput,
      takeFeeInput,
      callbackBeforeDone,
      callbackAfterDone,
      callbackRejected
    )
  }

  return (
    <CRow>
      <CCol xs="12" sm="12">
        <CCard>
          <CCardHeader>
            <b>Binary Option Contract: </b>{<CLink href={detectAddress(process.env.REACT_APP_CONTRACT)} target="_blank">{process.env.REACT_APP_CONTRACT}</CLink>}
          </CCardHeader>
          <CCardBody>
            <CForm >
              <CCol xs="12" sm="6">
                <CFade>
                  <CCard>
                    <CCardHeader>
                      <CRow>
                        <CCol xs="5" sm="5">
                          <b>Fee Percent:</b> {feePercent}%
                        </CCol>
                        <CCol xs="6" sm="6">
                          <b>Fee Address:</b> {<CLink href={detectAddress(takeFee)} target="_blank">{convertAddressArrToString([takeFee],8,8)}</CLink>}
                        </CCol>
                        <CCol xs="1" sm="1">
                          <div className="card-header-actions">
                            <CLink className="card-header-action" onClick={() => setCollapsed(!collapsed)}>
                              <CIcon name={collapsed ? 'cil-chevron-bottom' : 'cil-chevron-top'} />
                            </CLink>
                          </div>
                        </CCol>
                      </CRow>
                    </CCardHeader>
                    <CCollapse show={collapsed}>
                      <CCardBody>
                        <CFormGroup>
                          <CLabel htmlFor="liquidation-ratio"> _feePercent (uint256) </CLabel>
                          <CInputGroup>
                            <PriceInput
                              placeholder='_feePercent (uint256)'
                              suffix='%'
                              value={{
                                number: feePercentInput == null ? "" : feePercentInput
                              }}
                              maxDecimals={8}
                              onChange={onChangeFee}
                              isError={isErrorFee}
                              errorMessage={errorMessageFee}
                              onlyInteger={true}
                            />
                          </CInputGroup>
                        </CFormGroup>

                        <CFormGroup style={{ marginTop: '1.5rem' }}>
                          <CLabel htmlFor="liquidation-ratio"> _takeFee (address) </CLabel>
                          <CInputGroup>
                            <CInput type="text" placeholder="_takeFee (address)" onChange={onChangeTakeFee} value={takeFeeInput} style={{ color: "black" }} />
                            {isErrorTakeFeeInput && <span className='address-input-error'>{errorMessageTakeFeeInput}</span>}
                          </CInputGroup>
                        </CFormGroup>

                        <Button
                          type='primary'
                          className="mt-3"
                          style={{ width: "100%" }}
                          onClick={() => handleSetFee()}
                          loading={isLoading}
                          disabled={isErrorTakeFeeInput || isErrorFee || isLoading}
                        >
                          Set Fee
                        </Button>

                      </CCardBody>
                    </CCollapse>
                  </CCard>
                </CFade>
              </CCol>

            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Account
