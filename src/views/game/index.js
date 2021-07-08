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
import { TextField } from "@material-ui/core";

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
    let res;
    if (fromDate && toDate) {
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
    } else {
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

  const onChangeFromDate = (e) => {
    const value = new Date(e.target.value);
    value.setSeconds(0,0)
    if (value > toDate) {
      setToDate(value);
    }
    setFromDate(value);
  };

  const onChangeToDate = (e) => {
    const value = new Date(e.target.value);
    value.setSeconds(59,59)
    if (value < fromDate) {
      setFromDate(value);
    }
    setToDate(value);
  };

  return (
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
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <span>Games</span>

              <CFormGroup
                style={{
                  marginLeft: "10px",
                  paddingLeft: "10px",
                  borderLeft: "2px solid #c9c9c9",
                }}
              >
                <CRow>
                  <CCol lg={5} xs={12}>
                    <TextField
                      type="datetime-local"
                      label="From date"
                      value={
                        fromDate
                          ? moment(fromDate).format("YYYY-MM-DDTHH:mm")
                          : ""
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={onChangeFromDate}
                    />
                  </CCol>
                  <CCol lg={5} xs={12}>
                    <TextField
                      type="datetime-local"
                      label="To date"
                      value={
                        toDate ? moment(toDate).format("YYYY-MM-DDTHH:mm") : ""
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={onChangeToDate}
                    />
                  </CCol>
                  <CCol
                    style={{ display: "flex", alignItems: "flex-end" }}
                    xs={12}
                    lg={2}
                  >
                    <CButton
                      color="secondary"
                      style={{
                        marginTop: '10px',
                        minWidth: "80px",
                      }}
                      onClick={() => run()}
                    >
                      Search
                    </CButton>
                  </CCol>
                </CRow>
              </CFormGroup>
            </div>
            <div className="text-muted float-right mt-1">
              <p className="float-left">
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
              loading={loading}
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
