import React, { useState, useEffect } from 'react'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
    CLink
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

    const run = async () => {
        setLoading(true)
        const res = await HTTP.fetchData('/bets', 'GET', {sort: 'desc', limit: 10000}, null);
        setBets(res.data)
        // setTotalPage(res.totalPage)
        setLoading(false)
    }
    useEffect(() => {
        run()
    }, [])
  return (
      loading
          ? <Spinner />
          :
      <CRow>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>
              Bets
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
                    'closePrice': (item) => (
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
