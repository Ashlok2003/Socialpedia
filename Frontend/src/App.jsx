import React, { useState } from "react";
import Header from "./components/header/Header";
import Posts from "./components/posts/Posts";

import MessageWindow from "./components/messages/MessageWindow";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import Container from "react-bootstrap/Container";
import Footer from "./components/footer/Footer";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
