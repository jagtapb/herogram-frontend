import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/dashboard';

function App() {
  const isAuthenticated = localStorage.getItem('token');

  return (
    <Router>
      <div>
        <nav>
          <ul>
          {!isAuthenticated && (
            <>
              <li><Link to="/signin">Sign In</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </>
          )}
            {isAuthenticated && 
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
              </>
            }
          </ul>
        </nav>

        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;