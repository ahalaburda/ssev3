import React, {Component} from 'react'
import './Sidebar.css'
import Logo from "./components/Logo";
import Item from "./components/Item";
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
        <ul className="navbar-nav bg-gradient-primary sidebar active sidebar-dark" id="sidebar">
          <Logo toggleIcon={this.state.toggle}/>
          {/* Divider */}
          <hr className="sidebar-divider my-0"/>

          {/* Nav Item - Inicio */}
          <Item link="/" icon="tachometer-alt" text="Inicio"/>

          {/* Nav Item - Graficos */}
          <Item link="/graficos/" icon="chart-bar" text="Gráficos"/>

          {/* Nav Item - Consultas */}
          <Item link="/consultas/" icon="search" text="Consultas"/>

          {/* Nav Item - Reportes */}
          <Item link="/reportes/" icon="folder" text="Reportes"/>

          {/* Nav Item - Tipos de expedientes */}
          <Item link="/tipos_de_expedientes/" icon="chart-area" text="Tipos de Expedientes"/>

          {/* Nav Item - Objetos de tastos */}
          <Item link="/objetos_de_gastos/" icon="comment-dollar" text="Objetos de Gastos"/>

          <hr className="sidebar-divider d-none d-md-block"/>
          {/* Sidebar Toggler */}
          <div className="text-center">
            <button className="btn" onClick={this.toggleMenu}>
              {this.state.toggle ? <FontAwesomeIcon icon="less-than" className="text-white"/> :
                <FontAwesomeIcon icon="greater-than" className="text-white"/>}
            </button>
          </div>
        </ul>
      </>
    );
  }
}

export default Sidebar;