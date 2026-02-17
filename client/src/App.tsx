


function App() {
  const fetchBackend = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/health")
      const data = await response.json()
      console.log(data)
    } catch (e) {
      console.error('connection failed', e)
    }
    
  }
  return (
    
    <>
      <div>Lite Box - The File Uploader</div>
      <p onClick={fetchBackend}>The message from server is </p>
    </>
  )
}

export default App
