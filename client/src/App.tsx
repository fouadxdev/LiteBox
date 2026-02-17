import { fetchBackend } from "./lib/api";

function App() {
  return (
    <>
      <div>Lite Box - The File Uploader</div>
      <p onClick={fetchBackend}>The message from server is </p>
    </>
  );
}

export default App;
