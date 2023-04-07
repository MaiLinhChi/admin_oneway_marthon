import React, { useState, useEffect } from "react";
import HTTP from "src/controller/API/HTTP";
import { CCard, CCol } from "@coreui/react";
import { Pagination } from "antd";

const View = () => {
  const [users, setUsers] = useState([]);
  const [perPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(1);
  const [searchValue, setSearchValue] = useState("")

  const getData = async (value) => {
    setSearchValue(value);
    const params = {
        keyword: value || "",
        pageSize: perPage,
        pageIndex: currentPage
    };
    const res = await HTTP.getUserList("admin/users", params);
    setUsers(res.data);
    setTotalRecord(res.totalRecord);
  };

  useEffect(() => {
    getData();
  }, [perPage, currentPage]);

  return (
    <CCol xs="12" lg="12">
      <CCard>
        <h2 className="text-center">Users</h2>
        <div className="d-flex justify-content-between align-items-center m-3">
        <div className="input-group w-25">
            <input type="text" className="form-control" placeholder="Search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
            <button type="button" className="btn btn-info">Search</button>
        </div>
        </div>
        <table className="table">
            <thead className="table-dark">
                <tr>
                <th>User name</th>
                <th>Email</th>
                <th>Full name</th>
                <th>Mobile</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created at</th>
                <th>Avatar</th>
                </tr>
            </thead>
            <tbody>
                {users?.map((item, index) => (
                <tr key={index}>
                    <td>{item.username}</td>
                    <td>{item.email}</td>
                    <td>{item.fullname}</td>
                    <td>{item.mobile}</td>
                    <td>{item.role}</td>
                    <td>{item.status}</td>
                    <td>{item.createdAt}</td>
                    <td>{item.avatar}</td>
                </tr>
                ))}
            </tbody>
        </table>
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
