import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import './index.css';
import { UserProvider } from "./UserContext";

ReactDOM.render(
  <BrowserRouter>
    <UserProvider>
      <Router />
    </UserProvider>
  </BrowserRouter>,
  document.getElementById('root')
);