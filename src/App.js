import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './NavBar';
import Home from './pages/Home.js'
import SearchBooks from './pages/SearchBooks.js';
import Login from './pages/Login.js'
import Signup from './pages/Signup.js'
import EditProfile from './pages/EditProfile.js';
import UserProvider from './context/UserProvider';


function App() {
  const handleLoginSuccess = (token) => {
    console.log('Login success! Token:', token);
  };

  const handleSignupSuccess = (token) => {
    console.log('Signup success! Token:', token);
  };
  return (
    <BrowserRouter>
        <UserProvider>
                <NavBar/>
          <div className="App">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/search" element={<SearchBooks/>}/>
            <Route path='/auth/register' element={<Signup onSignupSuccess={handleSignupSuccess}/>}/>
            <Route path='/auth/login' element={<Login onLoginSuccess={handleLoginSuccess}/>}/>
            <Route path='/editprofile' element={<EditProfile/>}/>
          </Routes>  
          </div>
        </UserProvider>
    </BrowserRouter>
  );
}

export default App;
