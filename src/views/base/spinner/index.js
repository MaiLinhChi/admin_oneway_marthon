import React from 'react'

const Spinner = () => {
    return (
        <div className="vh-100 d-flex align-items-center justify-content-center">
            <div className="spinner-grow" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}

export default Spinner