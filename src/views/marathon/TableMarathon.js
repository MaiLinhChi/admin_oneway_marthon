import moment from "moment/moment"
import { useRef } from "react"
import MyModal from "src/components/MyModal"
import MarathonEditModal from "src/modal/editModal"
import MarathonModal from "src/modal/marathonModal"

const TableMarathon = ({label, data, searchValue, handleSearch, getData}) => {
    const refModal = useRef()
    const refModalEdit = useRef()
    const handleOpenModal = () => {
        refModal.current.openModal(
            <MarathonModal modalWidth={1000} getData={getData} />
        )
    }

    const handleEditModal = (item) => {
        refModalEdit.current.openModal(
            <MarathonEditModal modalWidth={800} data={item} getData={getData} />
        )
    }
    return (
        <>
            <h2 className="text-center">{label || "Data"} list</h2>
            <div className="d-flex justify-content-between align-items-center m-3">
            <div className="input-group w-25">
                <input type="text" className="form-control" placeholder="Search" value={searchValue} onChange={(e) => handleSearch(e.target.value)} />
                <button type="button" className="btn btn-info">Search</button>
            </div>
            <button type="button" className="btn btn-info" onClick={handleOpenModal}>Add Marathon</button>
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
                    {data?.map((item, index) => (
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
                        <td onClick={() => handleEditModal(item)} style={{textDecoration: "underline", color: 'blue', cursor: 'pointer'}}>Edit</td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <MyModal ref={refModal} />
            <MyModal ref={refModalEdit} />
        </>
    )
}

export default TableMarathon