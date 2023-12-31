import React, { useState, useEffect, icons } from 'react'
import { useHistory } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { saveDataLocal } from 'src/common/function'
import TomoFinanceServices from 'src/controller/API/HTTP'

const { EyeOn, EyeOff } = icons;

const Login = () => {
  let history = useHistory()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [processing, setProcessing] = useState(false)
  const [visiblePass, setVisiblePass] = useState(false);
  const [error, setError] = useState(false)
  useEffect(() => {
    checkUserAuthentication()
  }, [])
  const checkUserAuthentication = async () => {
    localStorage.removeItem('userAuth')
  }

  const onChangeUsername = (e) => {
    let value = e.target.value
    setUsername(value)
    if (value === '') {
      setError(false)
    }
  }
  const onChangePassword = (e) => {
    let value = e.target.value
    setPassword(value)
    if (value === '') {
      setError(false)
    }
  }
  const onSubmit = async (event) => {
    event.preventDefault()
    setProcessing(true)
    try {
      let res = await TomoFinanceServices.authenticate(username, password)
      if (res && res.token) {
        saveDataLocal('userAuth', res)
        history.push('/')
      } else {
        setError('Username or password is wrong!')
        setProcessing(false)
      }
    } catch (error) {
      console.log(error)
      setError('Username or password is wrong!')
      setProcessing(false)
    }

  }
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="4">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={onSubmit}>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" name="username" placeholder="Username" autoComplete="username" onChange={onChangeUsername} />
                    </CInputGroup>
                    <CInputGroup className="mb-4" style={{position: 'relative'}}>
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type={visiblePass ? "text" : "password"} name="password" placeholder="Password" autoComplete="current-password" onChange={onChangePassword} style={{paddingRight: 30}} />
                      <div 
                        style={{cursor: 'pointer', position: 'absolute', right: 10, top: '45%', transform: "translateY(-50%)", zIndex: 99, userSelect: 'none'}}
                        onClick={() => setVisiblePass(!visiblePass)}
                      >
                        {visiblePass ? <EyeOn width={12} height={12} /> : <EyeOff width={12} height={12} />}
                      </div>
                    </CInputGroup>
                    {error && <CAlert color="danger">{error}</CAlert>}
                    <CRow>
                      <CCol xs="6">
                        <CButton color="primary" className="px-4" type="submit" disabled={processing}>Login</CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
