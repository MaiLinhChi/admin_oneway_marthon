import { CCard, CCol } from "@coreui/react";
import { Modal } from "antd";
import React, { useState, useEffect, useRef } from "react";
import HTTP from "src/controller/API/HTTP";
import TableMarathon from "./TableMarathon";
import MyModal from "src/components/MyModal";

const Marathon = () => {
  const [loading, setLoading] = useState(false);
  const [marathons, setMarathons] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const refModal = useRef();

  const getData = async (value) => {
    setLoading(true);
    setSearchValue(value);
    const params = {
        keyword: value || "",
        pageSize: perPage,
        pageIndex: currentPage
    };
    const res = await HTTP.getUserList("marathons");
    setMarathons(res.data);
    setTotalRecord(res.totalRecord);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [perPage, currentPage]);

  return (
    <CCol xs="12" lg="12">
      <CCard>
        <TableMarathon label="Marathon" data={marathons} getData={getData} />
      </CCard>
    </CCol>
  );
};

export default Marathon;
