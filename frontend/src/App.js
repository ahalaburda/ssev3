import React, {Component} from 'react';
import Sidebar from './components/Sidebar/index'
import Header from './components/Header/index'
import Footer from './components/Footer/index'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faBell } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import './styles/font.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import TiposDeExpedientes from "./core/TiposDeExpedientes/TiposDeExpedientes";

class App extends Component {
  render () {
    library.add(faSearch, faBell);
    return (
      <div className="App">
        <div id="wrapper">
          <Sidebar />
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <Header />
              <div className="container-fluid">
                <TiposDeExpedientes/>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
