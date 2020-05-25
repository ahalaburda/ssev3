import React from 'react';

import Sidebar from './components/Sidebar/index'
import Header from './components/Header/index'
import Footer from './components/Footer/index'

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faBell } from '@fortawesome/free-solid-svg-icons';


import './App.css';

function App() {
  library.add(faSearch, faBell);
  return (
    <div className="App">
      <div id="wrapper">
        <Sidebar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Header />
            <div className="container-fluid">
              <h1 className="h3 mb-4 text-gray-800">Blank Page</h1>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
