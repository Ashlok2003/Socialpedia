import React, { useState, useEffect } from "react";
import Header from "./components/header/Header";
import Posts from "./components/posts/Posts";

import MessageWindow from "./components/messages/MessageWindow";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import Container from "react-bootstrap/Container";
import Footer from "./components/footer/Footer";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "./store/Authentication/authSlice";

function App() {

  const navigate = useNavigate();

  useEffect(() => {
    navigate('/welcome');
  }, []);

  const userData = useSelector(selectCurrentUser);
  return (
    <>
      <Header />
      <Outlet />
      {userData && <Footer />}
    </>
  );
}

export default App;
