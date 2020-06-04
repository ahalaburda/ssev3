import React, {Component} from 'react';
import Sidebar from './components/Sidebar/index'
import Header from './components/Header/index'
import Footer from './components/Footer/index'
import Expedientes from "./core/Expedientes/Expedientes";
import TiposDeExpedientes from "./core/TiposDeExpedientes/TiposDeExpedientes";
import Consultas from "./core/Consultas/Consultas";
import Graficos from "./core/Graficos/Graficos";
import Reportes from "./core/Reportes/Reportes";
import ObjetosDeGastos from "./core/ObjetosDeGastos/ObjetosDeGastos";
import './App.css';
import './styles/font.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import {library} from '@fortawesome/fontawesome-svg-core';
import {
  faSearch,
  faBell,
  faCogs,
  faUser,
  faSignOutAlt,
  faChartBar, faPlus, faPencilAlt,
  faCommentDollar, faFolder, faChartArea, faTachometerAlt, faBars
} from '@fortawesome/free-solid-svg-icons';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

class App extends Component {
  render() {
    library.add(faSearch, faBell, faCogs, faUser, faSignOutAlt, faChartBar, faPlus, faPencilAlt, faTachometerAlt,
      faCommentDollar, faFolder, faChartArea, faBars);
    return (
      <Router>
        <div className="App">
          <div id="wrapper">
            <Sidebar/>
            <div id="content-wrapper" className="d-flex flex-column">
              <div id="content">
                <Header/>
                <div className="container-fluid">
                  <Switch>
                    <Route exact path='/' component={Expedientes}/>
                    <Route exact path='/graficos/' component={Graficos}/>
                    <Route exact path='/consultas/' component={Consultas}/>
                    <Route exact path='/reportes/' component={Reportes}/>
                    <Route exact path='/tipos_de_expedientes/' component={TiposDeExpedientes}/>
                    <Route exact path='/objetos_de_gastos/' component={ObjetosDeGastos}/>
                  </Switch>
                </div>
              </div>
              <Footer/>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
