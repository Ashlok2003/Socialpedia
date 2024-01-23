import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/js/bootstrap.js';
import { Provider } from 'react-redux';
import { store } from './store/store.js';

import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Home from './pages/Home.jsx';
import MessageWindow from './components/messages/MessageWindow.jsx';
import SearchProfile from './components/User/SearchProfile.jsx';
import Explore from './pages/Explore.jsx';
import FullPost from './components/posts/FullPost.jsx';
import Welcome from './pages/Welcome.jsx';
import VideoCalling from './components/VideoCall/VideoCalling.jsx';
import RequireAuth from './components/User/RequireAuth.jsx';
import Login from './components/Authentication/Login.jsx';
import Signup from './components/Authentication/Signup.jsx';
import Profile from './pages/Profile.jsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='Login' element={<Login />} />
      <Route path='SignUp' element={<Signup />} />
      <Route path='Welcome' element={<Welcome />} />
      <Route element={<RequireAuth />} >
        <Route path='Home' element={<Home />} />
        <Route path='Explore' element={<Explore />} />
        <Route path='Profile/:username/:userId' element={<SearchProfile />} />
        <Route path='Messages' element={<MessageWindow />} />
        <Route path='UserProfile' element={<Profile />} />
        <Route path="Fullpost/:postId" element={<FullPost />} />
        <Route path="videocall/:roomId" element={<VideoCalling />} />
      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
