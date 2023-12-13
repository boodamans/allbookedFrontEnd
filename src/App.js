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
import BookPage from './pages/BookPage';
import ProfilePage from './pages/ProfilePage.js';
import EditReview from './pages/EditReview.js';


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
            <Route path="/book/:id" element={<BookPage />} />
            <Route path='/auth/register' element={<Signup onSignupSuccess={handleSignupSuccess}/>}/>
            <Route path='/auth/login' element={<Login onLoginSuccess={handleLoginSuccess}/>}/>
            <Route path='/editprofile' element={<EditProfile/>}/>
            <Route path='/profile/:username' element={<ProfilePage/>}/>
            <Route path='/editreview/:review_id' element={<EditReview/>}/>
          </Routes>  
          </div>
        </UserProvider>
    </BrowserRouter>
  );
}

export default App;
