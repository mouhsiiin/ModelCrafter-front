import React, { useState } from "react";
import axios from "axios";
import './UploadFile.css'; // Import the CSS file

const UploadFile = () => {
  const [file, setFile] = useState<File | null>(null); // Update the type to File | null
  const [status, setStatus] = useState<string>(""); // Explicitly type as string
  const [response, setResponse] = useState(null);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };


  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Uploading...");
      const result = await axios.post("http://localhost:8000/auto/craft", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResponse(result.data);
      setStatus("Upload successful!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setStatus("Error uploading file.");
    }
  };

  return (
    <div className="upload-container">
      <h1 className="title">Upload CSV File</h1>
      <div className="upload-box">
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          className="file-input"
        />
        <button onClick={handleUpload} className="upload-button">Upload</button>
      </div>
      <p className="status">{status}</p>
      {response && (
        <div className="response">
          <h2>Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadFile;
