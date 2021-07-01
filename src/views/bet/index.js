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
import HTTP from 'src/controller/API/HTTP'
import { ellipsisAddress } from 'src/helper/addressHelper';
import {
    detectAddress,
    detectTransaction
} from 'src/common/function';
const getBadge = status => {
    switch (status) {
        case 1: return 'success'
        default: return 'danger'
    }
}

const fields = ['user','txhash', 'gameId', 'betAmount', 'winAmount', 'type', 'createdAt']

const View = () => {
  const [bets, setBets] = useState([]);

    const run = async () => {

        const res = await HTTP.fetchData('/bets', 'GET', {sort: 'desc', limit: 10000}, null);
        setBets(res.data)
        // setTotalPage(res.totalPage)
    }
    useEffect(() => {
        run()
    }, [])
  return (
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
                  itemsPerPage={20}
                  pagination
                  scopedSlots = {{
                      'user': (item) => (
                          <td><CLink href={detectAddress(item.user)} target="_blank">{`${ellipsisAddress(item.user)}`}</CLink></td>
                      ),
                    'txhash': (item) => (
                          <td><CLink href={detectTransaction(item.txhash)} target="_blank">{`${ellipsisAddress(item.txhash)}`}</CLink></td>
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
                          <td>{moment(item.createdAt).format()}</td>
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
