import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/navBar/navBar.js';
import { AuthProvider } from './components/authContext/authContext.js';
import PrivateRoute from './components/privateRoute/privateRoute.js';
import Home from './views/home/home';
import SignUp from './views/signUp/signUp.js';
import Login from './views/logIn/logIn.js';
import Currencies from './views/currencies/currencies.js';
import Slots from './views/slots/slots.js';
import CardColorGame from './views/cardColorGame/cardColorGame.js';
import Baccarat from './views/baccarat/baccarat.js';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<><NavBar /><h1>Not Found</h1></>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/currencies" element={<PrivateRoute><Currencies /></PrivateRoute>} />
          <Route path="/slots" element={<PrivateRoute><Slots /></PrivateRoute>} />
          <Route path="/cardcolorgame" element={<PrivateRoute><CardColorGame /></PrivateRoute>} />
          <Route path="/baccarat" element={<PrivateRoute><Baccarat /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
