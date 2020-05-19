import React, {Component} from 'react';

import Sidebar from './components/Sidebar/index'
import Header from './components/Header/index'
import Footer from './components/Footer/index'
import Estados from "./components/estados/Estados";
import axios from 'axios';


import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      estados: {}
    }
  }

  getEstados() {
    axios.get('http://localhost:8000/api/estados/?format=json')
      .then(response => {
        this.setState({ estados: response.data });
        console.log(response);
      })
      .catch(console.log);
  }

  componentDidMount() {
    this.getEstados();
  }

  render () {
    return (
      <div className="App">
        <div id="wrapper">
          <Sidebar />
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <Header />
              <div className="container-fluid">
                <h1 className="h3 mb-4 text-gray-800">Blank Page</h1>
                <Estados estados={this.state.estados.results}/>
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
