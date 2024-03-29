import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductPage from './pages/Product';
import { UserProvider } from './context/UserContext';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Product from './pages/Products';
import Category from './pages/Category';

function App() {

  return (
    
      <Router>
        <UserProvider>
        <Routes>
              <Route
                element={
                    <Home />
                }
                exact
                path="/"
              />
              <Route
                element={
                    <Login />
                }
                exact
                path="/login"
              />
              <Route
                element={
                    <Signup />
                }
                exact
                path="/signup"
              />
              <Route
                element={
                    <Product />
                }
                exact
                path="/product/:id"
              />
              <Route
                element={
                    <ProductPage />
                }
                exact
                path="/product"
              />
              <Route
                element={
                    <Profile />
                }
                exact
                path="/profile"
              />
              <Route
                element={
                    <Admin />
                }
                exact
                path="/admin"
              />
              <Route
                element={
                    <Category />
                }
                exact
                path="/category/:cat"
              />
         </Routes>
         </UserProvider>
      </Router>
      
  )
}

export default App
