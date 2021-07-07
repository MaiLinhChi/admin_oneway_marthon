import React, { useState, useEffect } from "react";
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
  CButton,
} from "@coreui/react";
import moment from "moment";
import numeral from "numeral";
import HTTP from "src/controller/API/HTTP";
import { ellipsisAddress } from "src/helper/addressHelper";
import { detectAddress, detectTransaction } from "src/common/function";
import Spinner from "src/views/base/spinner";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

const getBadge = (status) => {
  switch (status) {
    case "UP":
    case 1:
      return "success";
    default:
      return "danger";
  }
};

const fields = [
  "gameId",
  "txhash",
  "lockedPrice",
  "closePrice",
  "result",
  "totalbetAmount",
  "comm",
  "createdAt",
];

const View = () => {
  const [loading, setLoading] = useState(false);
  const [bets, setBets] = useState([]);
  const [totalComm, setTotalComm] = useState(0);
  const [totalbetAmount, settotalbetAmount] = useState(0);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const run = async () => {
    setLoading(true);
    let res
    if(fromDate && toDate){
      res = await HTTP.fetchData(
        "/games",
        "GET",
        {
          sort: "desc",
          fromDate,
          toDate,
          limit: 10000000000,
        },
        null
      );
    } else{
      res = await HTTP.fetchData(
        "/games",
        "GET",
        {
          sort: "desc",
          limit: 10000000000,
        },
        null
      );
    }
    
    setBets(res.data);
    setTotalComm(res.totalComm);
    settotalbetAmount(res.totalbetAmount);
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
                Games
              </span>

              <CFormGroup style={{ marginLeft: "10px", display: "flex" }}>
                <CInputGroup>
                  <RangePicker
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
                  disabled={!fromDate || !toDate}
                  onClick={() => run()}
                >
                  Search
                </CButton>
              </CFormGroup>
            </div>
            <div className="text-muted float-right mt-1">
              <p className="float-left">
                {" "}
                Total Bet Amount:{" "}
                <b>{numeral(totalbetAmount).format("0,0.00")}</b> - Total
                Commission: <b>{numeral(totalComm).format("0,0.00")}</b>
              </p>
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
              scopedSlots={{
                txhash: (item) => (
                  <td>
                    <CLink
                      href={detectTransaction(item.txhash)}
                      target="_blank"
                    >{`${ellipsisAddress(item.txhash)}`}</CLink>
                  </td>
                ),
                lockedPrice: (item) => (
                  <td>{numeral(item.lockedPrice / 100).format("0,0.00")}</td>
                ),

                closePrice: (item) => (
                  <td>
                    {item.closePrice && item.closePrice != 0
                      ? numeral(item.closePrice / 100).format("0,0.00")
                      : "--/--"}
                  </td>
                ),
                result: (item) => (
                  <td>
                    {item.result ? (
                      <CBadge color={getBadge(item.result)}>
                        {item.result}
                      </CBadge>
                    ) : (
                      "--/--"
                    )}
                  </td>
                ),
                comm: (item) => <td>{numeral(item.comm).format("0,0.00")}</td>,
                createdAt: (item) => (
                  <td>
                    {moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                  </td>
                ),
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default View;
