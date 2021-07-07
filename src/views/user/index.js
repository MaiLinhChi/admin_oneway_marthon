import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CLink,
  CButton,
  CFormGroup,
  CLabel,
  CInputGroup,
  CInput,
} from "@coreui/react";
import moment from "moment";
import numeral from "numeral";
import { CSVLink } from "react-csv";
import HTTP from "src/controller/API/HTTP";
import { ellipsisAddress } from "src/helper/addressHelper";
import { detectAddress } from "src/common/function";
import Spinner from "src/views/base/spinner";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

const fields = ["user", "totalbetAmount", "totalWinAmount", "createdAt"];

const View = () => {
  const [loading, setLoading] = useState(false);
  const [bets, setBets] = useState([]);
  const [topWinner, setTopWinner] = useState([]);
  const [totalWinAmount, setTotalWinAmount] = useState(0);
  const [totalbetAmount, settotalbetAmount] = useState(0);


  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null);

  const csvDataAll = [
    { label: "Address", key: "user" },
    { label: "Total Bet Amount", key: "totalbetAmount" },
    { label: "Total Win Amount", key: "totalWinAmount" },
    { label: "createdAt", key: "createdAt" },
  ];
  const run = async () => {
    setLoading(true);
    let res
    
    if(fromDate && toDate){
      res = await HTTP.fetchData(
        "/users",
        "GET",
        {
          sort: "desc",
          fromDate: moment(fromDate).format('YYYY-MM-DD'),
          toDate: moment(toDate).format('YYYY-MM-DD'),
          limit: 10000000000,
        },
        null
      );
    } else {
      res = await HTTP.fetchData(
        "/users",
        "GET",
        {
          sort: "desc",
          limit: 10000000000,
        },
        null
      );
    }
    setBets(res.data);
    setTotalWinAmount(res.totalWinAmount);
    settotalbetAmount(res.totalbetAmount);
    setTopWinner(res.topWinner);
    setLoading(false);
  };
  useEffect(() => {
    run();
  }, []);

  const handleChangeSearchTime = (e) => {
    if (e !== null) {
      setFromDate(e[0]._d);
      setToDate(e[1]._d);
    } else {
      setFromDate(null)
      setToDate(null)
    }
  };

  return loading ? (
    <Spinner />
  ) : (
    <CRow>
      <CCol xs="12" lg="12">
        <CCard>
          <CCardHeader
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span
                style={{
                  borderRight: "2px solid #c9c9c9",
                  paddingRight: "10px",
                }}
              >
                Users
              </span>

              <CFormGroup style={{ marginLeft: "10px", display: "flex" }}>
                <CInputGroup>
                  <RangePicker
                    onChange={handleChangeSearchTime}
                    style={{ width: "100%" }}
                  />
                </CInputGroup>

                <CButton
                  color="secondary"
                  style={{
                    marginLeft: "10px",
                    minWidth: "100px",
                  }}
                  disabled={!fromDate || !toDate}
                  onClick={() => run()}
                >
                  Search
                </CButton>
              </CFormGroup>
            </div>
            <div className="text-muted float-right mt-1">
              <p className="float-left">
                Total Bet Amount:
                <b>{numeral(totalbetAmount).format("0,0.00")}</b> - Total Win
                Amount: <b>{numeral(totalWinAmount).format("0,0.00")}</b>
              </p>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs="12" lg="6">
                <CCardHeader style={{ padding: "0 10px 5px 10px" }}>
                  <b>Top Players</b>
                  <CButton color="secondary" style={{ marginLeft: 20 }}>
                    <CSVLink
                      filename={
                        moment().format("YYYY-MM-DD_HH-mm-ss") +
                        "_top_players.csv"
                      }
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
                  scopedSlots={{
                    user: (item) => (
                      <td>
                        <CLink
                          href={detectAddress(item.user)}
                          target="_blank"
                        >{`${ellipsisAddress(item.user)}`}</CLink>
                      </td>
                    ),
                    totalbetAmount: (item) => (
                      <td>{numeral(item.totalbetAmount).format("0,0.00")}</td>
                    ),
                    totalWinAmount: (item) => (
                      <td>{numeral(item.totalWinAmount).format("0,0.00")}</td>
                    ),
                    lockedPrice: (item) => (
                      <td>{numeral(item.totalWinAmount).format("0,0.00")}</td>
                    ),
                    createdAt: (item) => (
                      <td>
                        {moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                      </td>
                    ),
                  }}
                />
              </CCol>
              <CCol xs="12" lg="6">
                <CCardHeader style={{ padding: "0 10px 5px 10px" }}>
                  <b>Top Winners</b>
                  <CButton color="secondary" style={{ marginLeft: 20 }}>
                    <CSVLink
                      filename={
                        moment().format("YYYY-MM-DD_HH-mm-ss") +
                        "_top_winners.csv"
                      }
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
                  scopedSlots={{
                    user: (item) => (
                      <td>
                        <CLink
                          href={detectAddress(item.user)}
                          target="_blank"
                        >{`${ellipsisAddress(item.user)}`}</CLink>
                      </td>
                    ),
                    totalbetAmount: (item) => (
                      <td>{numeral(item.totalbetAmount).format("0,0.00")}</td>
                    ),
                    totalWinAmount: (item) => (
                      <td>{numeral(item.totalWinAmount).format("0,0.00")}</td>
                    ),
                    lockedPrice: (item) => (
                      <td>{numeral(item.totalWinAmount).format("0,0.00")}</td>
                    ),
                    createdAt: (item) => (
                      <td>
                        {moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                      </td>
                    ),
                  }}
                />
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default View;
