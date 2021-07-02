import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import {
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
import ReduxServices from "src/common/redux";
import Observer from "src/common/observer";
import { OBSERVER_KEY } from "src/common/constants";
import Spinner from "../user";

const Account = () => {
  const [feePercent, setFeePercent] = useState(0);
  const [feePercentInput, setFeePercentInput] = useState('');
  const [isErrorFee, setIsErrorFee] = useState(true);
  const [errorMessageFee, setErrorMessageFee] = useState('');
  const [takeFee, setTakeFee] = useState('');
  const [isErrorTakeFeeInput, setIsErrorTakeFeeInput] = useState(true);
  const [errorMessageTakeFeeInput, setErrorMessageTakeFeeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = React.useState(true)

  const userData = useSelector(state => state.userData)

  useEffect(() => {
    setLoading(true)
    contractHightOrLow().methods.feePercent().call().then(rs => {
      setFeePercent(rs)
      setLoading(false)
    });
    // eslint-disable-next-line
  }, [])

  const handleSignIn = () => {
    Observer.emit(OBSERVER_KEY.SIGN_IN);
  };

  const onChangeFee = (value, isReset = false) => {
    setFeePercentInput(value.number)
    if (value.number !== '') {
      let isError = false
      let newValue = Number(value.number)
      if (newValue <= 0) {
        isError = true
        setErrorMessageFee(`The minimum should be greater than 0`)
      }else if(newValue > 100){
        isError = true
        setErrorMessageFee(`The maximum should be less or equal than 100`)
      }
      setIsErrorFee(isError)
    } else {
      if (!isReset) {
        setIsErrorFee(true)
        setErrorMessageFee('_feePercent cannot be empty')
      }
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
    const isSigned = ReduxServices.checkIsSigned()
    if (isSigned) {
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
        onChangeFee({ number: '' }, true);
        // setFeePercentInput('')
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
        callbackBeforeDone,
        callbackAfterDone,
        callbackRejected
      )
    } else {
      handleSignIn()
    }
  }

  return (
      loading
          ? <Spinner />
          : <CRow>
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
                        <CCol>
                          <b>Fee Percent:</b> {feePercent}%
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
                        </CFormGroup>

                        <Button
                          type='primary'
                          className="mt-3"
                          style={{ width: "100%" }}
                          onClick={() => handleSetFee()}
                          loading={loading}
                          disabled={isErrorTakeFeeInput || isErrorFee || loading}
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
