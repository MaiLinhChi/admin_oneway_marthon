import React, { useState, useEffect } from 'react'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
    CLink,
    CFormGroup,
    CInputGroup,
    CButton
} from '@coreui/react'
import moment from 'moment'
import numeral from 'numeral'
import HTTP from 'src/controller/API/HTTP'
import { ellipsisAddress } from 'src/helper/addressHelper';
import {
    detectAddress,
    detectTransaction
} from 'src/common/function';
import Spinner from 'src/views/base/spinner';
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

const getBadge = status => {
    switch (status) {
        case 'UP':
        case 1: return 'success'
        default: return 'danger'
    }
}

const fields = ['user','txhash', 'gameId', 'lockedPrice', 'closePrice', 'result', 'betSide', 'betAmount', 'winAmount', 'type', 'createdAt']

const View = () => {
  const [loading, setLoading] = useState(false);
  const [bets, setBets] = useState([]);

  const currentDate = new Date();
  const [fromDate, setFromDate] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  );
  const [toDate, setToDate] = useState(currentDate);

    const run = async () => {
        setLoading(true)
        const res = await HTTP.fetchData('/bets', 'GET', {sort: 'desc', 
        fromDate: moment(fromDate).format("YYYY-MM-DD HH:mm:ss"),
        toDate: moment(toDate).format("YYYY-MM-DD HH:mm:ss"),
        limit: 10000000000}, null);
        setBets(res.data)
        // setTotalPage(res.totalPage)
        setLoading(false)
    }
    useEffect(() => {
        run()
    }, [])

    const handleChangeSearchTime = (e) => {
      if (e !== null) {
        setFromDate(e[0]._d);
        setToDate(e[1]._d);
      }
    };
  return (
      loading
          ? <Spinner />
          :
      <CRow>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span
                style={{
                  borderRight: "2px solid #c9c9c9",
                  paddingRight: "10px",
                }}
              >
                Bets
              </span>

              <CFormGroup style={{ marginLeft: "10px", display: "flex" }}>
                <CInputGroup>
                  <RangePicker
                    defaultValue={[moment(fromDate), moment(toDate)]}
                    onChange={handleChangeSearchTime}
                    style={{ width: "100%" }}
                    showTime
                  />
                </CInputGroup>

                <CButton
                  color="secondary"
                  style={{
                    marginLeft: "10px",
                    minWidth: "100px",
                  }}
                  onClick={() => run()}
                >
                  Search
                </CButton>
              </CFormGroup>
            </div>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                  items={bets}
                  fields={fields}
                  striped
                  columnFilter
                  itemsPerPage={20}
                  pagination
                  scopedSlots = {{
                      'user': (item) => (
                          <td><CLink href={detectAddress(item.user)} target="_blank">{`${ellipsisAddress(item.user)}`}</CLink></td>
                      ),
                    'txhash': (item) => (
                          <td><CLink href={detectTransaction(item.txhash)} target="_blank">{`${ellipsisAddress(item.txhash)}`}</CLink></td>
                      ),
                    'lockedPrice': (item) => (
                          <td>{numeral(item.lockedPrice/100).format('0,0.00')}</td>
                      ),
                    // eslint-disable-next-line
                    'closePrice': (item) => (
                          // eslint-disable-next-line
                          <td>{item.closePrice && item.closePrice != 0 ? numeral(item.closePrice/100).format('0,0.00') : '--/--'}</td>
                      ),
                    'result': (item) => (
                          <td>{item.result ? <CBadge color={getBadge(item.result)}>
                              {item.result}
                          </CBadge> : '--/--'}</td>
                      ),
                    'betSide':
                        (item)=>(
                            <td>
                              <CBadge color={getBadge(item.betSide)}>
                                {item.betSide}
                              </CBadge>
                            </td>
                        ),
                      'type':
                        (item)=>(
                            <td>
                              <CBadge color={getBadge(item.type)}>
                                {item.type === 1 ? 'Player' : 'Bot'}
                              </CBadge>
                            </td>
                        ),
                      'createdAt': (item)=>(
                          <td>{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</td>
                      ),

                  }}

              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
  )
}

export default View
