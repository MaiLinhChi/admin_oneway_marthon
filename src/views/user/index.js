import React, { useState, useEffect } from "react";
import HTTP from "src/controller/API/HTTP";
import { CCard, CCol } from "@coreui/react";
import { Pagination } from "antd";
import Table from "src/components/Table";

const View = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(1);
  const [searchValue, setSearchValue] = useState("")

  const getData = async (value) => {
    setLoading(true);
    setSearchValue(value);
    const params = {
        keyword: value || "",
        pageSize: perPage,
        pageIndex: currentPage
    };
    const res = await HTTP.getUserList("admin/users", params);
    setUsers(res.data);
    setTotalRecord(res.totalRecord);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [perPage, currentPage]);

  return (
    <CCol xs="12" lg="12">
      <CCard>
        <Table label="User" data={users} searchValue={searchValue} handleSearch={getData} />
        <Pagination
          pageSize={perPage}
          total={totalRecord}
          showQuickJumper
          showLessItems
          className="text-center mb-3"
          onChange={(currentPage) => setCurrentPage(currentPage)}
        />
      </CCard>
    </CCol>
  )
};

export default View;
