import React, {Component} from 'react'
import './Sidebar.css'
import Logo from "./components/Logo";
import Inicio from "./components/Inicio";
import Graficos from "./components/Graficos";
import Consultas from "./components/Consultas";
import Reportes from "./components/Reportes";
import TipoDeExpedientes from "./components/TipoDeExpedientes";
import ObjetoDeGastos from "./components/ObjetoDeGastos";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import $ from "jquery";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: true
    }
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu = () => {
    $('#sidebar').toggleClass('active');
    this.setState({toggle: !this.state.toggle});
  }

  render() {
    return (
      <>
        <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark" id="sidebar">
          <Logo toggleIcon={this.state.toggle}/>
          {/* Divider */}
          <hr className="sidebar-divider my-0"/>
          {/* Nav Item - Inicio */}
          <Inicio/>
          {/* Nav Item - Graficos */}
          <Graficos/>
          {/* Nav Item - Consultas */}
          <Consultas/>
          {/* Nav Item - Reportes */}
          <Reportes/>
          {/* Nav Item - Tipos de expedientes */}
          <TipoDeExpedientes/>
          {/* Nav Item - Tipos de expedientes */}
          <ObjetoDeGastos/>
          <hr className="sidebar-divider d-none d-md-block"/>
          {/* Sidebar Toggler */}
          <div className="text-center">
            <button className="btn" onClick={this.toggleMenu}>
              {this.state.toggle ? <FontAwesomeIcon icon="greater-than" className="text-white"/> :
                <FontAwesomeIcon icon="less-than" className="text-white"/>}
            </button>
          </div>
        </ul>
      </>
    );
  }
}

export default Sidebar;