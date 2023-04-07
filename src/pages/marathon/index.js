import { CCard, CCol } from "@coreui/react";
import { MARATHON_KEY } from "src/common/constants"
import Observer from "src/common/observer"
import React, { useState, useEffect, useRef } from "react";
import HTTP from "src/controller/API/HTTP";

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
      <h2 className="text-center">Marathons</h2>
        <div className="d-flex justify-content-between align-items-center m-3">
        <div className="input-group w-25">
            {/* <input type="text" className="form-control" placeholder="Search" value={searchValue} onChange={(e) => handleSearch(e.target.value)} /> */}
            {/* <button type="button" className="btn btn-info">Search</button> */}
        </div>
        <button type="button" className="btn btn-info" onClick={() => Observer.emit(MARATHON_KEY.MARATHON, {type: "ADD", payload: {getData}})}>Add Marathon</button>
        </div>
        <table className="table">
            <thead className="table-dark">
                <tr>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Description</th>
                    <th>Start time</th>
                    <th>Status</th>
                    <th>Location</th>
                    <th>Created at</th>
                    <th>Option</th>
                </tr>
            </thead>
            <tbody>
                {marathons?.map((item, index) => (
                <tr key={index}>
                    <td>{item.name}</td>
                    <td>
                        <img src={item.image} alt="" style={{width: 50}} />
                    </td>
                    <td>{item.description}</td>
                    <td>{item.startTime}</td>
                    <td>{item.status}</td>
                    <td style={{wordBreak: 'break-all'}}>{item.location}</td>
                    <td>{item.createdAt}</td>
                    <td onClick={() => Observer.emit(MARATHON_KEY.MARATHON, {type: "EDIT", payload: {data: item, getData}})} style={{textDecoration: "underline", color: 'blue', cursor: 'pointer'}}>Edit</td>
                </tr>
                ))}
            </tbody>
        </table>
      </CCard>
    </CCol>
  );
};

export default Marathon;
