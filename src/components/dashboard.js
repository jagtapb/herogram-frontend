// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token) {
      // If no token is found, redirect to the login page
      navigate('/signin');
    } else {
        // Retrieve user data from localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUserInfo(storedUser);
        } else {
            navigate('/signin'); // If no user data is found, redirect to login
        }
        fetchFiles();
    }
  }, [navigate]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    handleFile(selectedFile);
  };

  const handleFile = (selectedFile) => {
    const validTypes = ['image/png', 'image/jpeg', 'application/pdf'];
    if (selectedFile && validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setUploadStatus('');
    } else {
      setUploadStatus('Invalid file type. Please upload PNG, JPEG, or PDF.');
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://207.154.218.245:8000/api/files', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token in the header for authentication
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch files.');
      }

      const data = await response.json();
      setUploadedFiles(data.files); // Update state with the fetched files
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  // Drag-and-Drop Handlers
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    const droppedFile = event.dataTransfer.files[0];
    handleFile(droppedFile);
  };


  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('Please select a file to upload.');
      return;
    }

    // Example: You can upload the file to the server here using FormData
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Replace with your API endpoint for file upload
      const response = await fetch('http://207.154.218.245:8000/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setUploadStatus('File uploaded successfully!');
        const files = await response.json();
        setUploadedFiles(files);
      } else {
        setUploadedFiles([]);
        setUploadStatus('Failed to upload file. Please try again.');
      }
      await fetchFiles();
    } catch (error) {
      setUploadedFiles([]);
      setUploadStatus('Error uploading file. Please try again.');
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {userInfo ? (
        <div>
          <button onClick={logout}>Logout</button>
          <p>Welcome, {userInfo.username}</p>
          <p>Email: {userInfo.email}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}

      {/* Drag-and-Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: dragging ? '2px dashed #3f51b5' : '2px dashed #cccccc',
          padding: '20px',
          borderRadius: '5px',
          marginBottom: '20px',
          textAlign: 'center',
          color: dragging ? '#3f51b5' : '#999999',
        }}
      >
        {dragging ? "Drop file here..." : "Drag and drop a file, or click to select"}
      </div>

       <div>
        <input
          type="file"
          accept=".png, .jpeg, .jpg, .pdf"
          onChange={handleFileChange}
        />
        <button onClick={handleUpload}>Upload</button>

        <br/><br/>
        <br/><br/>

        
      {/* Display Thumbnails of Uploaded Files */}
      <div>
        <h3>Uploaded Files:</h3>
        {uploadedFiles.length > 0 ? (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {uploadedFiles.map((file, index) => (
              <div key={index} style={{ textAlign: 'center', width: '100px', marginRight: '30px' }}>
                {file.url.endsWith('.png') || file.url.endsWith('.jpeg') || file.url.endsWith('.jpg') ? (
                  // Display image preview for PNG and JPEG files
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    <img
                        src={file.url}
                        alt={file.filename}
                        style={{ width: '100%', height: 'auto', borderRadius: '5px' }}
                    />
                  </a>
                ) : (
                  // Display PDF icon for PDF files
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={`${process.env.PUBLIC_URL}/pdf.png`}
                      alt="PDF Icon"
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </a>
                )}
                <p style={{ fontSize: '10px' }}>{file.filename}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>

        {uploadStatus && <p>{uploadStatus}</p>}
      </div>

    </div>
  );
}

export default Dashboard;
