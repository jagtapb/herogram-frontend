import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './api';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigating after successful login

  const handleSubmit = async (e) => {
    e.preventDefault();  
    setErrorMessage(''); // Reset error message on each submit attempt
    try {
        const data = await login(email, password); // Call the login function
        console.log("Login successful:", data);
        navigate('/dashboard'); // Redirect to Dashboard
      } catch (error) {
        console.error("Login failed:", error);
        setErrorMessage('Invalid credentials or network error');
      }  
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default SignIn;
