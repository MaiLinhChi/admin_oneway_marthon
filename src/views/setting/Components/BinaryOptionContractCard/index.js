import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
  CCardFooter,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { Button, Radio, Table } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  detectAddress,
  convertAddressArrToString,
  validateAddress,
  showNotification,
  destroyNotification,
  isUserDeniedTransaction,
} from "src/common/function";
import {
  contractHightOrLow,
  callGetDataWeb3,
  postBaseSendTxs,
} from "src/controller/Web3";
import PriceInput from "src/components/PriceInput";
import ReduxServices from "src/common/redux";
import Observer from "src/common/observer";
import { OBSERVER_KEY } from "src/common/constants";

const BinaryOptionContractCard = (props) => {
  const { onChange } = props
  const [feePercent, setFeePercent] = useState(0);
  const [feePercentInput, setFeePercentInput] = useState('');
  const [isErrorFee, setIsErrorFee] = useState(true);
  const [errorMessageFee, setErrorMessageFee] = useState('');

  const [collapsed, setCollapsed] = React.useState(true);

  const [isLoading, setLoading] = useState(false);

  const userData = useSelector((state) => state.userData);

  useEffect(() => {
    contractHightOrLow().methods.feePercent().call().then(setFeePercent);
    // eslint-disable-next-line
  }, []);

  const handleSignIn = () => {
    Observer.emit(OBSERVER_KEY.SIGN_IN);
  };

  const onChangeFee = (value, isReset = false) => {
    setFeePercentInput(value.number);
    if (value.number !== "") {
      let isError = false;
      let newValue = Number(value.number);
      if (newValue <= 0) {
        isError = true;
        setErrorMessageFee(`The minimum should be greater than 0`);
      } else if (newValue >= 100) {
        isError = true;
        setErrorMessageFee(`The maximum should be less than 100`);
      }
      setIsErrorFee(isError);
    } else {
      if (!isReset) {
        setIsErrorFee(true);
        setErrorMessageFee("_feePercent cannot be empty");
      }
    }
  };

  const setFee = async (
    fromAddress,
    feePercent,
    callbackBeforeDone,
    callbackAfterDone,
    callbackRejected
  ) => {
    return new Promise(async (resolve, reject) => {
      const contractAddresses = process.env.REACT_APP_CONTRACT;
      const contract = contractHightOrLow();
      const dataTx = callGetDataWeb3(contract, 'setFee', [feePercent]);
      const setFeeData = {
        from: userData.address,
        to: contractAddresses,
        data: dataTx,
        callBeforeFunc: callbackBeforeDone,
        callbackFunc: callbackAfterDone,
        isCallBackErr: true,
        callbackErrFunc: callbackRejected,
      };
      postBaseSendTxs(fromAddress, [setFeeData], true)
        .then((res) => {
          resolve(res[0]);
        })
        .catch((err) => {
          callbackRejected(err);
          reject(err);
        });
    });
  };

  const handleSetFee = () => {
    const isSigned = ReduxServices.checkIsSigned();
    if (isSigned) {
      setLoading(true);
      const callbackBeforeDone = () => {
        showNotification(`Setting Fee`, 'Waiting for transaction signature...');
      };
      const callbackAfterDone = async (res) => {
        destroyNotification();
        showNotification(`Setting Fee`, 'Successfully');
        const data =  await contractHightOrLow().methods.feePercent().call()
        setFeePercent(data)
        onChange && onChange(data)
        onChangeFee({ number: '' }, true);
        setLoading(false);
      };
      const callbackRejected = (err) => {
        destroyNotification();
        if (isUserDeniedTransaction(err)) {
          showNotification(`Setting Fee`, 'Transaction denied');
          setLoading(false);
        } else {
          showNotification(`Setting Fee`, 'Transaction failed');
          setLoading(false);
        }
      };
      setFee(
        userData.address,
        feePercentInput,
        callbackBeforeDone,
        callbackAfterDone,
        callbackRejected
      );
    } else {
      handleSignIn();
    }
  };

  return (
    <CCard>
      <CCardHeader>
        <b>Binary Option Contract: </b>
        {
          <CLink
            href={detectAddress(process.env.REACT_APP_CONTRACT)}
            target='_blank'
          >
            {convertAddressArrToString([process.env.REACT_APP_CONTRACT], 8, 8)}
          </CLink>
        }
      </CCardHeader>
      <CCardBody>
        <CForm>
          <CCol xs='12' sm='12'>
            <CFade>
              <CCard>
                <CCardHeader>
                  <CRow>
                    <CCol xs='11' sm='10'>
                      <b>Fee Percent:</b> {feePercent}%
                    </CCol>
                    <CCol xs='1' sm='2'>
                      <div className='card-header-actions'>
                        <CLink
                          className='card-header-action'
                          onClick={() => setCollapsed(!collapsed)}
                        >
                          <CIcon
                            name={
                              collapsed
                                ? 'cil-chevron-bottom'
                                : 'cil-chevron-top'
                            }
                          />
                        </CLink>
                      </div>
                    </CCol>
                  </CRow>
                </CCardHeader>
                <CCollapse show={collapsed}>
                  <CCardBody>
                    <CFormGroup>
                      <CLabel htmlFor='liquidation-ratio'>
                        _feePercent (uint256)
                      </CLabel>
                      <CInputGroup>
                        <PriceInput
                          placeholder='_feePercent (uint256)'
                          suffix='%'
                          value={{
                            number:
                              feePercentInput == null ? '' : feePercentInput,
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
                      className='mt-3'
                      style={{ width: '100%' }}
                      onClick={() => handleSetFee()}
                      loading={isLoading}
                      disabled={isErrorFee || isLoading}
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
  );
};

export default BinaryOptionContractCard;
