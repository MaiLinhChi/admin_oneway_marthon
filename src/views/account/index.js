import React, { useState } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormGroup, CLabel, CInput, CInputGroup, CInputGroupPrepend, CInputGroupText, CRow, CInvalidFeedback } from '@coreui/react'
import CIcon from '@coreui/icons-react';
import TomoFinanceServices from 'src/controller/API/TomoFinance'
import { showNotification } from 'src/common/function';

const Account = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isMatch, setIsMatch] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    try {
      const res = await TomoFinanceServices.changePassword(oldPassword, newPassword); 
      showNotification('Change password success!!!', 'success');
      console.log(res);
      setOldPassword('');
      setNewPassword('');
      setRepeatPassword('');
      setLoading(false)
    } catch (error) {
      showNotification('Invalid credential!!!');
      setLoading(false)
    }
  };

  const onRepeatPassword = (e) => {
    const value = e.target.value;
    setRepeatPassword(value);
    value !== newPassword ? setIsMatch(false) : setIsMatch(true);
  };

  return (
    <CRow>
      <CCol xs="12" sm="6">
        <CCard>
          <CCardHeader>
            Change password
          </CCardHeader>
          <CCardBody>
            <CForm >
              <CFormGroup>
                <CLabel htmlFor="liquidation-ratio"> Old password </CLabel>
                <CInputGroup>
                  <CInputGroupPrepend>
                    <CInputGroupText><CIcon name="cil-asterisk" /></CInputGroupText>
                  </CInputGroupPrepend>
                  <CInput type="password" id="old-password" name="password1" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}/>
                </CInputGroup>
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="liquidation-ratio"> New password </CLabel>
                <CInputGroup>
                  <CInputGroupPrepend>
                    <CInputGroupText><CIcon name="cil-asterisk" /></CInputGroupText>
                  </CInputGroupPrepend>
                  <CInput type="password" id="new-password" name="password2" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                </CInputGroup>
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="liquidation-ratio"> Confirm new password </CLabel>
                <CInputGroup>
                  <CInputGroupPrepend>
                    <CInputGroupText><CIcon name="cil-asterisk" /></CInputGroupText>
                  </CInputGroupPrepend>
                  <CInput invalid={ newPassword.length > 0 && repeatPassword.length > 0 && !isMatch} type="password" id="repeat-password" name="password3" value={repeatPassword} onChange={(e) => onRepeatPassword(e)}/>
                  <CInvalidFeedback>Password and confirm password does not match!</CInvalidFeedback>                  
                </CInputGroup>
              </CFormGroup>
              <CFormGroup className="form-actions">
              <CButton block variant="outline" color={'info'} onClick={onSubmit} disabled={loading || !isMatch}>
                {loading && (
                  <i className="fa fa-refresh fa-spin" style={{ marginRight: '5px' }}/>
                )}
                <span> {'Update'} </span>
                </CButton>
              </CFormGroup>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Account
