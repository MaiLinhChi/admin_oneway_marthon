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
  CFormGroup,
  CCardFooter
} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { Button, Table } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
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

  const [feePercentSubInput, setFeePercentSubInput] = useState('');
  const [isErrorFeeSub, setIsErrorFeeSub] = useState(true);
  const [errorMessageFeeSub, setErrorMessageFeeSub] = useState('');

  const [takeFeeSubInput, setTakeFeeSubInput] = useState('');
  const [isErrorTakeFeeSubInput, setIsErrorTakeFeeSubInput] = useState(true);
  const [errorMessageTakeFeeSubInput, setErrorMessageTakeFeeSubInput] = useState('');

  const [commAddressList, setCommAddressList] = useState([]);

  const [collapsed, setCollapsed] = React.useState(true)
  const [collapsedAddressList, setCollapsedAddressList] = React.useState(true)
  const [isLoading, setLoading] = useState(false)
  const [isLoadingComm, setLoadingComm] = useState(false)

  const userData = useSelector(state => state.userData)

  const columns = [
    {
      title: 'Taker Address',
      dataIndex: 'takerAddress',
      key: 'takerAddress',
      render: (address) => (<CLink href={detectAddress(address)} target="_blank">
        {convertAddressArrToString([address], 8, 8)}
      </CLink>),
    },
    {
      title: 'Percent',
      dataIndex: 'percent',
      key: 'percent',
      align: 'center'
    },
    {
      title: '',
      dataIndex: 'deleteAddress',
      key: 'deleteAddress',
      align: 'center',
      render: (address) => (<span className="deleteButton" onClick={() => deleleFromCommList(address)}><DeleteOutlined /></span>)
    }
  ];

  useEffect(() => {
    contractHightOrLow().methods.feePercent().call().then(setFeePercent);
    // eslint-disable-next-line
    getCommData()
  }, [])

  const getCommData = async() => {
    let commAddressList = await contractHightOrLow().methods.getShareCommAddress().call();
    let commListTemp = []
    let result = []

    if (commAddressList != null && commAddressList.length && commAddressList.length > 0) {
      commListTemp = commAddressList.map(async (address, index) => {
        let percent = await contractHightOrLow().methods.commAddress(address).call();
        return { address, percent }
      })
    }

    if (commListTemp != null && commListTemp.length && commListTemp.length > 0) {
      result = await Promise.all(commListTemp)
    }
    setCommAddressList(result)
  }

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
      } else if (newValue > 100) {
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

  const onChangeFeeSub = (value, isReset = false) => {
    setFeePercentSubInput(value.number)
    if (value.number !== '') {
      let isError = false
      let newValue = Number(value.number)
      if (newValue <= 0) {
        isError = true
        setErrorMessageFeeSub(`The minimum should be greater than 0`)
      } else if (newValue > 100) {
        isError = true
        setErrorMessageFeeSub(`The maximum should be less or equal than 100`)
      }
      setIsErrorFeeSub(isError)
    } else {
      if (!isReset) {
        setIsErrorFeeSub(true)
        setErrorMessageFeeSub('_feePercent cannot be empty')
      }
    }
  }

  const onChangeTakeFeeSub = (e) => {
    let value = e.target.value.toString()
    setTakeFeeSubInput(value)
    if (value !== '') {
      let isError = false;
      if (!validateAddress(value)) {
        isError = true
        setErrorMessageTakeFeeSubInput(`Invalid Address`)
      }
      setIsErrorTakeFeeSubInput(isError)
    } else {
      setIsErrorTakeFeeSubInput(true)
      setErrorMessageTakeFeeSubInput('_takeFee cannot be empty')
    }
  }

  const setFee = async (
    fromAddress,
    feePercent,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected
  ) => {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = process.env.REACT_APP_CONTRACT
      const contract = contractHightOrLow()
      const dataTx = callGetDataWeb3(contract, 'setFee', [feePercent])
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
      setLoading(true)
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
        onChangeFee({ number: '' }, true);
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

  const convertRawToTableData = (rawList) => {
    return rawList.map((ele, index) => {
      return {
        key: index + 1,
        takerAddress: ele.address,
        percent: ele.percent,
        deleteAddress: ele.address
      }
    })
  }

  const addToCommAddressList = () => {
    if (commAddressList.some(ele => ele.address === takeFeeSubInput)) {
      showNotification(
        `Add Error`,
        'The Address has existed in Taker List',
        null,
        'error'
      )
      return
    }
    if (getRemainingPercent(commAddressList) < feePercentSubInput) {
      showNotification(
        `Add Error`,
        'Remaining Percent is not enough',
        null,
        'error'
      )
      return
    }
    let tempArr = [...commAddressList, { address: takeFeeSubInput, percent: feePercentSubInput }]
    setCommAddressList(tempArr);
    onChangeFeeSub({ number: '' }, true);
    setTakeFeeSubInput('');
  }

  const getRemainingPercent = (commList) => {
    return 100 - commList.reduce((totalPercent, ele) => totalPercent + (Number(ele.percent) || 0), 0)
  }

  const deleleFromCommList = (address) => {
    let tempCommList = commAddressList.filter((ele) => {
      return ele.address !== address;
    });
    setCommAddressList(tempCommList)
  }

  const setShareCommAddress = async (
    fromAddress,
    setShareCommAddress,
    percent,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected
  ) => {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = process.env.REACT_APP_CONTRACT
      const contract = contractHightOrLow()
      const dataTx = callGetDataWeb3(contract, 'setShareCommAddress', [setShareCommAddress,percent])
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

  const handleSetShareCommAddress= () => {
    // eslint-disable-next-line
    if(getRemainingPercent(commAddressList) != 0){
      showNotification(
        `Set Share Error`,
        'You must allocate 100%',
        null,
        'error'
      )
      return
    }
    const isSigned = ReduxServices.checkIsSigned()
    if (isSigned) {
      setLoadingComm(true)
      let addressArr = commAddressList.map(ele=> ele.address)
      let percentArr = commAddressList.map(ele=> ele.percent)
      const callbackBeforeDone = () => {
        showNotification(
          `Setting Share`,
          'Waiting for transaction signature...'
        )
      }
      const callbackAfterDone = async (res) => {
        destroyNotification()
        showNotification(
          `Setting Share`,
          'Successfully'
        )
        setLoadingComm(false)
      }
      const callbackRejected = (err) => {
        destroyNotification()
        if (isUserDeniedTransaction(err)) {
          showNotification(
            `Setting Share`,
            'Transaction denied'
          )
          setLoadingComm(false)
        } else {
          showNotification(
            `Setting Share`,
            'Transaction failed'
          )
          setLoadingComm(false)
        }
      }
      setShareCommAddress(
        userData.address,
        addressArr,
        percentArr,
        callbackBeforeDone,
        callbackAfterDone,
        callbackRejected
      )
    } else {
      handleSignIn()
    }
  }


  return (
    <CRow>
      {/* --------------------------------- Left form -------------------------------------------*/}
      <CCol xs="6" sm="6">
        <CCard>
          <CCardHeader>
            <b>Binary Option Contract: </b>
            {<CLink href={detectAddress(process.env.REACT_APP_CONTRACT)} target="_blank">
              {convertAddressArrToString([process.env.REACT_APP_CONTRACT], 8, 8)}
            </CLink>}
          </CCardHeader>
          <CCardBody>
            <CForm >
              <CCol xs="12" sm="12">
                <CFade>
                  <CCard>
                    <CCardHeader>
                      <CRow>
                        <CCol xs="11" sm="11">
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

                        <Button
                          type='primary'
                          className="mt-3"
                          style={{ width: "100%" }}
                          onClick={() => handleSetFee()}
                          loading={isLoading}
                          disabled={ isErrorFee || isLoading}
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
      {/* --------------------------------- Right form -------------------------------------------*/}
      <CCol xs="6" sm="6">
        <CCard>

          <CCardBody>
            <CForm >
              <CCol xs="12" sm="12">
                <CFade>
                  {/* List Taker Card */}
                  <CCard>

                    <CCardHeader>
                      <CRow>
                        <CCol xs="11" sm="11">
                          <b>Fee Taker List</b>
                        </CCol>
                        <CCol xs="1" sm="1">
                          <div className="card-header-actions">
                            <CLink className="card-header-action" onClick={() => setCollapsedAddressList(!collapsedAddressList)}>
                              <CIcon name={collapsedAddressList ? 'cil-chevron-bottom' : 'cil-chevron-top'} />
                            </CLink>
                          </div>
                        </CCol>
                      </CRow>
                    </CCardHeader>

                    <CCollapse show={collapsedAddressList}>
                      <CCardBody>
                        <Table dataSource={convertRawToTableData(commAddressList)} columns={columns} pagination={false} />
                      </CCardBody>
                    </CCollapse>
                    <CCardFooter style={{ textAlign: "right" }} >
                      <span className="deleteButton" onClick={() => setCommAddressList([])}>Clear All</span>
                    </CCardFooter>
                  </CCard>

                  {/* Add Form Card */}
                  <CCard>
                    <CCardBody>
                      <CFormGroup>
                        <CLabel htmlFor="liquidation-ratio"> _feePercent (uint256) </CLabel>
                        <CInputGroup>
                          <PriceInput
                            placeholder='_feePercent (uint256)'
                            suffix='%'
                            value={{
                              number: feePercentSubInput == null ? "" : feePercentSubInput
                            }}
                            maxDecimals={8}
                            onChange={onChangeFeeSub}
                            isError={isErrorFeeSub}
                            errorMessage={errorMessageFeeSub}
                            onlyInteger={true}
                          />
                        </CInputGroup>
                      </CFormGroup>

                      <CFormGroup style={{ marginTop: '1.5rem' }}>
                        <CLabel htmlFor="liquidation-ratio"> _takeFee (address) </CLabel>
                        <CInputGroup>
                          <CInput type="text" placeholder="_takeFee (address)" onChange={onChangeTakeFeeSub} value={takeFeeSubInput} style={{ color: "black" }} />
                          {isErrorTakeFeeSubInput && <span className='address-input-error'>{errorMessageTakeFeeSubInput}</span>}
                        </CInputGroup>
                      </CFormGroup>

                      <CFormGroup style={{ marginTop: '1.5rem' }}>
                        <CRow>
                          <CCol xs="9" sm="9" style={{ textAlign: "left" }}>
                            <span className="font-weight-bold">{`Remaining Percent: ${getRemainingPercent(commAddressList)}%`}</span>
                          </CCol>
                          <CCol xs="3" sm="3" style={{ textAlign: "right" }}>
                            <Button type="primary" shape="circle" icon={<PlusOutlined />} size="small" className="addItemButton"
                              disabled={isErrorTakeFeeSubInput || isErrorFeeSub} onClick={() => addToCommAddressList()}
                            />
                          </CCol>
                        </CRow>
                      </CFormGroup>

                      <Button
                        type='primary'
                        className="mt-2"
                        style={{ width: "100%" }}
                        loading={isLoadingComm}
                        disabled={ commAddressList.length === 0 || isLoadingComm}
                        onClick={handleSetShareCommAddress}
                      >
                        Save
                      </Button>

                    </CCardBody>
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
