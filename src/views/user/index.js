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

const fields = ['user', 'totalbetAmount', 'totalWinAmount', 'createdAt']

const View = () => {
  const [loading, setLoading] = useState(false);
  const [bets, setBets] = useState([]);
  const [topWinner, setTopWinner] = useState([]);
  const [totalWinAmount, setTotalWinAmount] = useState(0);
  const [totalbetAmount, settotalbetAmount] = useState(0);

    const run = async () => {
        setLoading(true)
        const res = await HTTP.fetchData('/users', 'GET', {sort: 'desc', limit: 10000}, null);
        setBets(res.data)
        setTotalWinAmount(res.totalWinAmount)
        settotalbetAmount(res.totalbetAmount)
        setTopWinner(res.topWinner)
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
              Users
                <div className="text-muted float-right mt-1">
                    <p className="float-left"> Total Bet Amount: <b>{numeral(totalbetAmount).format('0,0.00')}</b> - Total Win Amount: <b>{numeral(totalWinAmount).format('0,0.00')}</b></p>
                </div>
            </CCardHeader>
            <CCardBody>
                <CCardHeader>Top Players </CCardHeader>
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
                      'totalbetAmount': (item) => (
                          <td>{numeral(item.totalbetAmount).format('0,0.00')}</td>
                      ),
                      'lockedPrice': (item) => (
                          <td>{numeral(item.totalWinAmount).format('0,0.00')}</td>
                      ),
                      'createdAt': (item)=>(
                          <td>{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</td>
                      ),
                  }}

              />

                <CCardHeader>Top Winners </CCardHeader>
                <CDataTable
                    items={topWinner}
                    fields={fields}
                    striped
                    columnFilter
                    itemsPerPage={20}
                    pagination
                    scopedSlots = {{
                        'user': (item) => (
                            <td><CLink href={detectAddress(item.user)} target="_blank">{`${ellipsisAddress(item.user)}`}</CLink></td>
                        ),
                        'totalbetAmount': (item) => (
                            <td>{numeral(item.totalbetAmount).format('0,0.00')}</td>
                        ),
                        'lockedPrice': (item) => (
                            <td>{numeral(item.totalWinAmount).format('0,0.00')}</td>
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
