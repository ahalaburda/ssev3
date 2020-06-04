import React from 'react'
import './Sidebar.css'
import Logo from "./components/Logo";
import Inicio from "./components/Inicio";
import Graficos from "./components/Graficos";
import Consultas from "./components/Consultas";
import Reportes from "./components/Reportes";
import TipoDeExpedientes from "./components/TipoDeExpedientes";
import ObjetoDeGastos from "./components/ObjetoDeGastos";

function Sidebar() {
  return (
    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark" id="sidebar-width">
      <Logo/>
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
    </ul>
  );
}

export default Sidebar;