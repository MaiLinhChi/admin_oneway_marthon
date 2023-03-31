const Table = ({label, data, searchValue, handleSearch}) => {
    return (
        <>
            <h2 className="text-center">{label || "Data"} list</h2>
            <div className="d-flex justify-content-between align-items-center m-3">
            <div className="input-group w-25">
                <input type="text" className="form-control" placeholder="Search" value={searchValue} onChange={(e) => handleSearch(e.target.value)} />
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
                    {data?.map((item, index) => (
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
        </>
    )
}

export default Table