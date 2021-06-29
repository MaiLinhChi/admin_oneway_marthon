import React, {useEffect, useState} from 'react'
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
  CLink
} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import {detectAddress} from 'src/common/function';
import {contractHightOrLow} from 'src/controller/Web3'

const Account = () => {
  const [feePercent, setFeePercent] = useState(0);
  const [collapsed, setCollapsed] = React.useState(true)
  useEffect(() => {
    contractHightOrLow().methods.feePercent().call().then(setFeePercent);
  }, [])

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
                      <b>Fee Percent:</b> {feePercent}%
                      <div className="card-header-actions">
                        <CLink className="card-header-action" onClick={() => setCollapsed(!collapsed)}>
                          <CIcon name={collapsed ? 'cil-chevron-bottom':'cil-chevron-top'} />
                        </CLink>
                      </div>
                    </CCardHeader>
                    <CCollapse show={collapsed}>
                      <CCardBody>
                        <CLabel htmlFor="liquidation-ratio"> _feePercent (uint256) </CLabel>
                        <CInputGroup><CInput id="" placeholder="_feePercent (uint256)"/><br/></CInputGroup>
                        <br/>
                        <CButton active block color="info" aria-pressed="true">Set Fee</CButton>
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
