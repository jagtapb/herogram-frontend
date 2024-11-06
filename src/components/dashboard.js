// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
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
    
    // Validate file type
    if (selectedFile) {
      const fileType = selectedFile.type;
      const validTypes = ['image/png', 'image/jpeg', 'application/pdf'];

      if (validTypes.includes(fileType)) {
        setFile(selectedFile);
        setUploadStatus('');
      } else {
        setUploadStatus('Invalid file type. Please upload PNG, JPEG, or PDF.');
      }
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/files', {
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
      const response = await fetch('http://localhost:8000/api/upload', {
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

       <div>
        <input
          type="file"
          accept=".png, .jpeg, .pdf"
          onChange={handleFileChange}
        />
        <button onClick={handleUpload}>Upload</button>

        <br/><br/>
        <br/><br/>

        {/* List of uploaded files */}
      <div>
        <h3>Uploaded Files:</h3>
        {uploadedFiles.length > 0 ? (
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index}>
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.filename}
                </a>
              </li>
            ))}
          </ul>
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
