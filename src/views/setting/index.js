import React, { useEffect, useState } from "react";
import {
  CCol,
  CRow,
} from "@coreui/react";
import {
  contractHightOrLow,
} from "src/controller/Web3";
import SettingMaintenanceCard from "./Components/SettingMaintenanceCard";
import BinaryOptionContractCard from "./Components/BinaryOptionContractCard";
import TakerListCard from "./Components/TakerListCard";

const Account = () => {
  const [feePercent,setFeePercent] = useState(0)

  useEffect(() => {
    contractHightOrLow().methods.feePercent().call().then(setFeePercent);
    // eslint-disable-next-line
  }, []);

  return (
    <CRow>
      {/* --------------------------------- Left form -------------------------------------------*/}
      <CCol xs="6" sm="6">
        <BinaryOptionContractCard onChange={setFeePercent} />
        <SettingMaintenanceCard />
      </CCol>
      {/* --------------------------------- Right form -------------------------------------------*/}
      <CCol xs="6" sm="6">
        <TakerListCard feePercent={feePercent} />
      </CCol>
    </CRow>
  );
};

export default Account;
