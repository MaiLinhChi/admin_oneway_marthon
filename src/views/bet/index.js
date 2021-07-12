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
  CPagination
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
  "user",
  "txhash",
  "gameId",
  "lockedPrice",
  "closePrice",
  "result",
  "betSide",
  "betAmount",
  "winAmount",
  "type",
  "createdAt",
];

const View = () => {
  const [loading, setLoading] = useState(false);
  const [bets, setBets] = useState([]);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)


  const run = async () => {
    setLoading(true);
    let res;

    if (fromDate && toDate) {
      res = await HTTP.fetchData(
        "/bets",
        "GET",
        { sort: "desc", fromDate, toDate, limit: 50, skip: (currentPage - 1) },
        null
      );
    } else {
      res = await HTTP.fetchData(
        "/bets",
        "GET",
        { sort: "desc", limit: 50, skip: (currentPage - 1) },
        null
      );
    }
    setBets(res.data);
    setTotalPage(res.totalPage)
    setLoading(false);
  };
  useEffect(() => {
    run();
  }, []);

  useEffect(() => {
    run();
  }, [currentPage]);

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

  const onChangePage = (page) => {
    if(page === 0){
      setCurrentPage(1)
    }else{
      setCurrentPage(page)
    }
  }

  const onSearch = () => {
    if(currentPage != 1)
    {
      setCurrentPage(1)
    }else{
      run()
    }
  }

  return (
    <CRow>
      <CCol xs="12" lg="12">
        <CCard>
          <CCardHeader>
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <span>Bets</span>

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
                        marginTop: "10px",
                        minWidth: "80px",
                      }}
                      onClick={() => onSearch()}
                    >
                      Search
                    </CButton>
                  </CCol>
                </CRow>
              </CFormGroup>
            </div>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={bets}
              fields={fields}
              striped
              columnFilter
              loading={loading}
              scopedSlots={{
                user: (item) => (
                  <td>
                    <CLink
                      href={detectAddress(item.user)}
                      target="_blank"
                    >{`${ellipsisAddress(item.user)}`}</CLink>
                  </td>
                ),
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
                // eslint-disable-next-line
                closePrice: (item) => (
                  // eslint-disable-next-line
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
                betSide: (item) => (
                  <td>
                    <CBadge color={getBadge(item.betSide)}>
                      {item.betSide}
                    </CBadge>
                  </td>
                ),
                type: (item) => (
                  <td>
                    <CBadge color={getBadge(item.type)}>
                      {item.type === 1 ? "Player" : "Bot"}
                    </CBadge>
                  </td>
                ),
                createdAt: (item) => (
                  <td>
                    {moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                  </td>
                ),
              }}
            />
            <div className={'mt-2'} >
              <CPagination
                activePage={currentPage}
                pages={totalPage}
                onActivePageChange={(page) => onChangePage(page)}
              ></CPagination>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default View;
