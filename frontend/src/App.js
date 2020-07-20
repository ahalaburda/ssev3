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
import Login from "./components/Forms/Login";
import './App.css';
import './styles/font.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import ReactNotification from "react-notifications-component";
import {library} from '@fortawesome/fontawesome-svg-core';
import {
  faSearch, faBell, faCogs, faUser,
  faSignOutAlt, faChartBar, faPlus, faPencilAlt,
  faCommentDollar, faFolder, faChartArea, faTachometerAlt,
  faBars, faEye, faEdit, faTrashAlt,
  faCheck, faLessThan, faGreaterThan
} from '@fortawesome/free-solid-svg-icons';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import axiosBase from "./services/http-common";
import Popups from "./components/Popups";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: !!localStorage.getItem('access_token'),
      username: localStorage.getItem('username')
    }
    this.handleLogin = this.handleLogin.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
  }


  /**
   * Solicitar al api el par de tokens de acuerdo a las credenciales.
   * Si la api devuelve correctamente el par, se setea el localstorage con los tokens y
   * modifica el header por defecto de axios.
   * Si no, loggea y muestra un error.
   * @param e Evento del input
   * @param data Datos del usuario (usuario y contrasenha)
   */
  handleLogin = (e, data) => {
    e.preventDefault();
    axiosBase.post('/token/', {
      username: data.username,
      password: data.password
    }).then(response => {
      if (response.status === 200 && response.statusText === 'OK') {
        this.setState({
          loggedIn: true,
          username: data.username
        });
        axiosBase.defaults.headers['Authorization'] = 'JWT ' + response.data.access;
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('username', data.username);
        Popups.success('Sesión iniciada correctamente.');
      }
    }).catch(e => {
      Popups.error('Usuario o contraseña incorrectas.');
      console.log(e);
    })
  }


  /**
   * Setear el campo username
   * @param e Evento del input
   */
  handleUserChange = e => {
    this.setState({username: e.target.value});
  }

  /**
   * Agregar a la blacklist el token utilizado
   * Borrar el access y refresh token del local storage
   * Setear el estado 'loggedIn' a false
   */
  handleLogout = () => {
    axiosBase.post('/token/blacklist/', {
      "refresh_token": localStorage.getItem('refresh_token')
    }).then(response => {
      if (response.status === 205) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        axiosBase.defaults.headers['Authorization'] = null;
        this.setState({loggedIn: false});
        Popups.success('Sesion cerrada.')
      }
    }).catch(e => {
      console.log(e);
    })
  }

  render() {
    library.add(faSearch, faBell, faCogs, faUser,
      faSignOutAlt, faChartBar, faPlus, faPencilAlt,
      faTachometerAlt, faCommentDollar, faFolder, faChartArea,
      faBars, faEye, faEdit, faTrashAlt,
      faCheck, faLessThan, faGreaterThan);

    let page;
    const homePage = (
      <div id="wrapper">
        <Sidebar/>
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Header username={this.state.username} handleLogout={this.handleLogout}/>
            <div className="container-fluid">
              <Route exact path='/' component={Expedientes}/>
              <Route exact path='/graficos/' component={Graficos}/>
              <Route exact path='/consultas/' component={Consultas}/>
              <Route exact path='/reportes/' component={Reportes}/>
              <Route exact path='/tipos_de_expedientes/' component={TiposDeExpedientes}/>
              <Route exact path='/objetos_de_gastos/' component={ObjetosDeGastos}/>
            </div>
          </div>
          <Footer/>
        </div>
      </div>);
    const loginPage = <Login handleLogin={this.handleLogin} username={this.state.username} handleUserChange={this.handleUserChange}/>

    //De acuerdo al estado redirige a la pagina de login o al homepage
    switch (this.state.loggedIn) {
      case true:
        page =  homePage;
        break;
      case false:
        page = loginPage;
        break;
      default:
        page = loginPage;
    }

    return (
      <>
        <ReactNotification/>
        <Router>
          <div className="App">
            <Switch>
              {page}
            </Switch>
          </div>
        </Router>
      </>
    );
  }
}

export default App;
