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
  faCheck, faLessThan, faGreaterThan, faPrint,
  faComment, faPenAlt, faCalendarCheck, faCommentAlt
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
      username: localStorage.getItem('username') === null ? '' : localStorage.getItem('username')
    }
    this.handleLogin = this.handleLogin.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    // interceptor para que al momento de que el refresh token expire, borre los datos de la sesion y sea necesario
    // iniciar de nuevo sesion y asi actualizar los tokens de acceso
    axiosBase.interceptors.response.use(
      response => response,
      error => {
        if (error.response.status === 401 && error.response.statusText === "Unauthorized"
          && error.response.data.code === "token_not_valid") {
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
            const now = Math.ceil(Date.now() / 1000);
            if (tokenParts.exp < now) {
              this.setState({loggedIn: false});
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('username');
              Popups.error('Debes iniciar sesión.');
            }
          }
        }
      }
    );
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
      axiosBase.defaults.headers['Authorization'] = 'JWT ' + response.data.access;
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('username', data.username);
      Popups.success('Sesión iniciada correctamente.');
      this.setState({
        loggedIn: true,
        username: data.username
      });
    }).catch(e => {
      Popups.error('Usuario o contraseña incorrectas.');
      console.log(e);
    });
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
        localStorage.removeItem('username');
        axiosBase.defaults.headers['Authorization'] = null;
        this.setState({
          loggedIn: false,
          username: ''
        });
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
      faCheck, faLessThan, faGreaterThan, faPrint,
      faComment, faPenAlt, faCalendarCheck, faCommentAlt);
    //TODO error de computedMatch por tener el Redirect fuera del Switch
    return (
      <>
        <ReactNotification/>
        <Router>
          {this.state.loggedIn ? <Redirect to='/'/> : <Redirect to='/login'/>}
          <Switch>
            <div id="wrapper">
              {this.state.loggedIn && <Sidebar/>}
              <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                  {this.state.loggedIn && <Header username={this.state.username} handleLogout={this.handleLogout}/>}
                  <div className="container-fluid">
                    <Route exact path='/' component={Expedientes}/>
                    <Route exact path='/graficos/' component={Graficos}/>
                    <Route exact path='/consultas/' component={Consultas}/>
                    <Route exact path='/reportes/' component={Reportes}/>
                    <Route exact path='/tipos_de_expedientes/' component={TiposDeExpedientes}/>
                    <Route exact path='/objetos_de_gastos/' component={ObjetosDeGastos}/>
                    <Route exact path='/login'>
                      <Login handleLogin={this.handleLogin} username={this.state.username}
                             handleUserChange={this.handleUserChange}/>
                    </Route>
                  </div>
                </div>
                <Footer/>
              </div>
            </div>
          </Switch>
        </Router>
      </>
    );
  }
}

export default App;
