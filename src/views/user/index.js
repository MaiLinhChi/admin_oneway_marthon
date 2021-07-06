import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
    CLink,
    CButton
} from '@coreui/react'
import moment from 'moment'
import numeral from 'numeral'
import { CSVLink } from "react-csv";
import HTTP from 'src/controller/API/HTTP'
import { ellipsisAddress } from 'src/helper/addressHelper';
import {
    detectAddress
} from 'src/common/function';
import Spinner from 'src/views/base/spinner';

const fields = ['user', 'totalbetAmount', 'totalWinAmount', 'createdAt']

const View = () => {
  const [loading, setLoading] = useState(false);
  const [bets, setBets] = useState([]);
  const [topWinner, setTopWinner] = useState([]);
  const [totalWinAmount, setTotalWinAmount] = useState(0);
  const [totalbetAmount, settotalbetAmount] = useState(0);
    const csvDataAll = [
        { label: "Address", key: "user" },
        { label: "Total Bet Amount", key: "totalbetAmount" },
        { label: "Total Win Amount", key: "totalWinAmount" },
        { label: "createdAt", key: "createdAt" },
    ];
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
                <CRow>
                <CCol xs="12" lg="6">
                <CCardHeader style={{padding: '0 10px 5px 10px'}}>
                    <b>Top Players</b>
                    <CButton color="secondary" style={{marginLeft: 20}}>
                        <CSVLink
                            filename={moment().format("YYYY-MM-DD_HH-mm-ss") + "_top_players.csv"}
                            headers={csvDataAll}
                            data={bets}
                        >
                            Export CSV
                        </CSVLink>
                    </CButton>

                </CCardHeader>
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
                      'totalWinAmount': (item) => (
                          <td>{numeral(item.totalWinAmount).format('0,0.00')}</td>
                      ),
                      'lockedPrice': (item) => (
                          <td>{numeral(item.totalWinAmount).format('0,0.00')}</td>
                      ),
                      'createdAt': (item)=>(
                          <td>{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</td>
                      ),
                  }}

              />
                </CCol>
                <CCol xs="12" lg="6">
                <CCardHeader style={{padding: '0 10px 5px 10px'}}>
                    <b>Top Winners</b>
                    <CButton color="secondary" style={{marginLeft: 20}}>
                        <CSVLink
                            filename={moment().format("YYYY-MM-DD_HH-mm-ss") + "_top_winners.csv"}
                            headers={csvDataAll}
                            data={topWinner}
                        >
                            Export CSV
                        </CSVLink>
                    </CButton>
                </CCardHeader>
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
                        'totalWinAmount': (item) => (
                            <td>{numeral(item.totalWinAmount).format('0,0.00')}</td>
                        ),
                        'lockedPrice': (item) => (
                            <td>{numeral(item.totalWinAmount).format('0,0.00')}</td>
                        ),
                        'createdAt': (item)=>(
                            <td>{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</td>
                        ),
                    }}

                />
                </CCol>
                </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
  )
}

export default View
