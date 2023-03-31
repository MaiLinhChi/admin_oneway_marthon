const Loading = () => {
    const style = {
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
    return (
      <div style={style}>
        <div className="spinner-grow text-primary" role="status">
          <span className="visually-hidden"></span>
        </div>
      </div>
    )
}

export default Loading