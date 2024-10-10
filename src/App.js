import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/navBar/navBar.js';
import { AuthProvider } from './components/authContext/authContext.js';
import PrivateRoute from './components/privateRoute/privateRoute.js';
import Home from './views/home/home';
import SignUp from './views/signUp/signUp.js';
import Login from './views/logIn/logIn.js';
import Slots from './views/slots/slots.js';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<><NavBar /><h1>Not Found</h1></>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/slots" element={<PrivateRoute><Slots /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
