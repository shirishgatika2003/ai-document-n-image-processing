import { useState } from "react";
import Header from "./components/Header";
import FileUpload from "./components/FileUpload";
import Summary from "./components/Summary";
import Chat from "./components/Chat";
function App() {
  const [fileUploaded, setFileUploaded] = useState(null);
  return (
    <>
      <main className="container">
        <Header />
        {fileUploaded ? (
          <>
            <Summary fileUploaded={fileUploaded} />
            <Chat fileUploaded={fileUploaded} />
          </>
        ) : (
          <FileUpload setFile={setFileUploaded} fileName={fileUploaded?.name} />
        )}
      </main>
    </>
  );
}

export default App;
