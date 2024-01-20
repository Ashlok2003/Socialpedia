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
import Profile from './pages/Profile.jsx';
import Explore from './pages/Explore.jsx';
import FullPost from './components/posts/FullPost.jsx';
import Registration from './pages/Registration.jsx';
import Welcome from './pages/Welcome.jsx';
import { extendedApiSlice } from './store/Posts/PostSliceRedux.js';
import VideoCalling from './components/VideoCall/VideoCalling.jsx';

store.dispatch(extendedApiSlice.endpoints.getPosts.initiate());

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='Home' element={<Home />} />
      <Route path='Explore' element={<Explore />} />
      <Route path='Messages' element={<MessageWindow />} />
      <Route path='Profile' element={<Profile />} />
      <Route path='Registration' element={<Registration />} />
      <Route path='Welcome' element={<Welcome />} />
      <Route path="Fullpost/:postId" element={<FullPost />} />
      <Route path="videocall/:roomId" element={<VideoCalling />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
