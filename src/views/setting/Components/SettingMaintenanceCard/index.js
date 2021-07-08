import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CLabel,
  CInput,
  CInputGroup,
  CCard,
  CRow,
  CCollapse,
  CFade,
  CLink,
  CFormGroup,
  CCardFooter,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { Button, Radio, Table } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  detectAddress,
  convertAddressArrToString,
  validateAddress,
  showNotification,
  destroyNotification,
  isUserDeniedTransaction,
} from "src/common/function";
import {
  contractHightOrLow,
  callGetDataWeb3,
  postBaseSendTxs,
} from "src/controller/Web3";
import PriceInput from "src/components/PriceInput";
import ReduxServices from "src/common/redux";
import Observer from "src/common/observer";
import { OBSERVER_KEY } from "src/common/constants";
import moment from "moment";
import HTTP from "src/controller/API/HTTP";
import { TextField } from "@material-ui/core";

const SettingMaintenanceCard = () => {
  const [maintenanceList, setMaintenanceList] = useState([]);

  const [message, setMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [status, setStatus] = useState("suspense");

  const [collapsedMaintenanceList, setCollapsedMaintenanceList] =
    React.useState(true);
  const [loadingSettingMaintenance, setLoadingSettingMaintenance] =
    useState(false);
  const [loadingListMaintenance, setLoadingListMaintenance] = useState(false);

  const columnsMaintenanceList = [
    {
      title: "Message",
      dataIndex: "data",
      key: "message",
      render: (data) => <span>{data?.message}</span>,
    },
    {
      title: "Start time",
      dataIndex: "data",
      key: "startTime",
      render: (data) => <span>{data?.startTime}</span>,
    },
    {
      title: "End Time",
      dataIndex: "data",
      key: "endTime",
      render: (data) => <span>{data?.endTime}</span>,
    },
    {
      title: "Status",
      dataIndex: "data",
      key: "status",
      align: "center",
      render: (data) => (
        <span style={{ textTransform: "capitalize" }}>{data?.status}</span>
      ),
    },
  ];

  const getListMaintenance = async () => {
    setLoadingListMaintenance(true);
    const res = await HTTP.fetchData(
      "/configs",
      "GET",
      {
        key: "maintenance",
      },
      null
    );
    setMaintenanceList(res);
    setLoadingListMaintenance(false);
  };

  useEffect(() => {
    getListMaintenance();
  }, []);

  const onChangeMessage = (value) => {
    setMessage(value);
    if (value.trim() === "") {
      setIsErrorMessage(true);
      setErrorMessage("Message is required");
    } else {
      setIsErrorMessage(false);
      setErrorMessage("");
    }
  };

  const onChangeStartTime = (e) => {
    const value = new Date(e.target.value);
    if (value > endTime) {
      setEndTime(value);
    }
    setStartTime(value);
  };

  const onChangeEndTime = (e) => {
    const value = new Date(e.target.value);
    if (value < startTime) {
      setStartTime(value);
    }
    setEndTime(value);
  };

  const clearData = () => {
    setMessage("");
    setStartTime(null);
    setEndTime(null);
    setStatus("suspense");
  };

  const handleSettingMaintenance = async () => {
    if (message.trim() === "" || startTime === null || endTime === null) {
      showNotification(
        `Setting maintenance`,
        "Setting maintenance cannot be blank!"
      );
    } else {
      setLoadingSettingMaintenance(true);
      HTTP.fetchData(`/config/maintenance`, `POST`, null, {
        data: {
          message,
          startTime: moment(startTime).format("YYYY-MM-DD HH:mm:ss"),
          endTime: moment(endTime).format("YYYY-MM-DD HH:mm:ss"),
          status,
        },
      })
        .then((res) => {
          showNotification(`Setting maintenance`, "Successfully!");
          clearData();
          getListMaintenance();
          setLoadingSettingMaintenance(false);
        })
        .catch((err) => {
          showNotification(`Setting maintenance`, "Fail!");
          setLoadingSettingMaintenance(false);
        });
    }
  };

  const setSettingMaintenance = (setting) => {
    setMessage(setting.data.message);
    setStartTime(setting.data.startTime);
    setEndTime(setting.data.endTime);
    setStatus(setting.data.status);
  };

  return (
    <CCard>
      <CCardHeader>
        <b>Setting maintenance: </b>
      </CCardHeader>
      <CCardBody>
        <CForm>
          <CCol xs="12" sm="12">
            <CFade>
              {/* List Maintenance */}
              <CCard>
                <CCardHeader>
                  <CRow>
                    <CCol xs="11" sm="10">
                      <b>List maintenance:</b>
                    </CCol>
                    <CCol xs="1" sm="2">
                      <div className="card-header-actions">
                        <CLink
                          className="card-header-action"
                          onClick={() =>
                            setCollapsedMaintenanceList(
                              !collapsedMaintenanceList
                            )
                          }
                        >
                          <CIcon
                            name={
                              collapsedMaintenanceList
                                ? "cil-chevron-bottom"
                                : "cil-chevron-top"
                            }
                          />
                        </CLink>
                      </div>
                    </CCol>
                  </CRow>
                </CCardHeader>

                <CCollapse show={collapsedMaintenanceList}>
                  <CCardBody>
                    <Table
                      loading={loadingListMaintenance}
                      dataSource={maintenanceList}
                      columns={columnsMaintenanceList}
                      pagination={false}
                      onRow={(record) => {
                        return {
                          onClick: () => setSettingMaintenance(record),
                        };
                      }}
                    />
                  </CCardBody>
                </CCollapse>
              </CCard>

              {/* Add Form Card */}
              <CCard>
                <CCardBody>
                  <CFormGroup>
                    <CLabel>Message:</CLabel>
                    <CInputGroup>
                      <CInput
                        value={message}
                        onChange={(e) => onChangeMessage(e.target.value)}
                        placeholder="Message"
                      />
                      {isErrorMessage && (
                        <span className="input-error">{errorMessage}</span>
                      )}
                    </CInputGroup>
                  </CFormGroup>

                  <CFormGroup
                    style={{
                      marginTop: "1.5rem",
                    }}
                  >
                    <TextField
                      type="datetime-local"
                      label="Start time"
                      value={
                        startTime
                          ? moment(startTime).format("YYYY-MM-DDTHH:mm")
                          : ""
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      onChange={onChangeStartTime}
                    />
                  </CFormGroup>

                  <CFormGroup
                    style={{
                      marginTop: "1.5rem",
                    }}
                  >
                    <TextField
                      type="datetime-local"
                      label="End time"
                      fullWidth
                      value={
                        endTime
                          ? moment(endTime).format("YYYY-MM-DDTHH:mm")
                          : ""
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={onChangeEndTime}
                    />
                  </CFormGroup>

                  <CFormGroup style={{ marginTop: "1.5rem" }}>
                    <CLabel>Status:</CLabel>
                    <CInputGroup>
                      <Radio.Group
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <Radio value="suspense">Suspense</Radio>
                        <Radio value="active">Active</Radio>
                      </Radio.Group>
                    </CInputGroup>
                  </CFormGroup>

                  <Button
                    onClick={handleSettingMaintenance}
                    type="primary"
                    className="mt-2"
                    style={{ width: "100%" }}
                    loading={loadingSettingMaintenance}
                  >
                    Save
                  </Button>
                </CCardBody>
              </CCard>
            </CFade>
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default SettingMaintenanceCard;
