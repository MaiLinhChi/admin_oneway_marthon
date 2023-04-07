import { CCard, CCol } from "@coreui/react";
import { Pagination } from "antd";
import React, { useState, useEffect } from "react";
import { BIB_KEY } from "src/common/constants";
import HTTP from "src/controller/API/HTTP";
import Observer from "../../common/observer";

const Bib = () => {
  const [bib, setBib] = useState([]);
  const [perPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(1);
  const [searchValue, setSearchValue] = useState("")

  const getData = async (value) => {
    setSearchValue(value);
    const params = {
        keyword: value,
        limit: perPage,
        skip: currentPage
    };
    const res = await HTTP.getBib("bib", params);
    setBib(res.data);
    setTotalRecord(res.totalRecord);
  };

  useEffect(() => {
    getData();
  }, [perPage, currentPage]);
  return (
    <CCol xs="12" lg="12">
      <CCard>
      <h2 className="text-center">Bibs</h2>
        <div className="d-flex justify-content-end align-items-center m-3">
        {/* <div className="input-group w-25">
            <input type="text" className="form-control" placeholder="Search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
            <button type="button" className="btn btn-info">Search</button>
        </div> */}
        <button type="button" className="btn btn-info" onClick={() => Observer.emit(BIB_KEY.BIB, {type: "ADD"})}>Add Bibs</button>
        </div>
        <table className="table">
            <thead className="table-dark">
                <tr>
                  <th>Email</th>
                  <th>Marathon</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Distance</th>
                  <th>FullName</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Created at</th>
                  <th>Option</th>
                </tr>
            </thead>
            <tbody>
                {bib?.map((item, index) => (
                <tr key={index}>
                    <td>{item.email}</td>
                    <td>{item.marathon}</td>
                    <td>{item.status}</td>
                    <td>{item.price}</td>
                    <td>{item.distance}</td>
                    <td>{item.fullName}</td>
                    <td>{item.phone}</td>
                    <td>{item.address}</td>
                    <td>{item.createdAt}</td>
                    <td onClick={() => Observer.emit(BIB_KEY.BIB, {type: "EDIT", payload: {data: item, getData}})} style={{textDecoration: "underline", color: 'blue', cursor: 'pointer'}}>Edit</td>
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
  );
};

export default Bib;
