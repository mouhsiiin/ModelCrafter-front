import React, { useState } from "react";
import axios from "axios";
import './UploadFile.css'; // Import the CSS file

const UploadFile = () => {
  const [file, setFile] = useState<File | null>(null); // Update the type to File | null
  const [status, setStatus] = useState<string>(""); // Explicitly type as string
  const [response, setResponse] = useState<any>(null); // Explicitly type as any

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

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

  const renderTable = (data: Record<string, any>, title = "Main Table") => { // Explicitly type the data parameter
    if (!data || typeof data !== "object") return null;


    const headers = Object.keys(data).filter(key => typeof data[key] !== "object");
    const nestedObjects = Object.keys(data).filter(key => typeof data[key] === "object");

    return (
      <div className="rounded-lg bg-white shadow p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      {headers.length > 0 && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {headers.map((header, index) => (
                <th key={index} className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {headers.map((header, index) => (
                <td key={index} className="border border-gray-300 px-4 py-2 text-gray-700">
                  {Array.isArray(data[header]) || typeof data[header] === "object"
                    ? JSON.stringify(data[header], null, 2)
                    : data[header]}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
      {nestedObjects.map((key, index) => (
        <div key={index}>
          {renderTable(data[key], key)}
        </div>
      ))}
    </div>
  );
  };

  return (
    <div className="upload-container p-6 max-w-7xl mx-auto space-y-6 relative py-20 px-4">
      <h1 className="text-3xl font-bold text-gray-800 text-center">Upload CSV File</h1>
      <div className="flex flex-col items-center gap-4">
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          className="block w-full max-w-md text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-gray-700 hover:file:bg-gray-100"
        />
        <button 
          onClick={handleUpload} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
        >
          Upload
        </button>
      </div>
      <p className="text-center text-gray-600">{status}</p>
      {response && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Response</h2>
          {renderTable(response)}
        </div>
      )}
    </div>
  );
};

export default UploadFile;
