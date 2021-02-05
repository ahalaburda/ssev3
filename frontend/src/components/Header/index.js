import React from 'react';
import './Header.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Configuraciones from "./components/Configuraciones";
// import Notificaciones from "./components/Notificaciones";
import UserInfo from "./components/UserInfo";

function Header(props) {
	return (
		<nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
			{/* Sidebar Toggle (Topbar) */}
			<button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
				<FontAwesomeIcon icon="bars"/>
			</button>
			{/* Topbar Navbar */}
			<ul className="navbar-nav ml-auto">
				{/* Nav Item - Configuraciones */}
				<Configuraciones/>
				{/* Nav Item - Notificaciones */}
				{/* <Notificaciones/> */}
				{/* Nav Divider */}
				<div className="topbar-divider d-none d-sm-block"/>
				{/* Nav Item - User Information */}
				<UserInfo username={props.username} logout={props.handleLogout}/>
			</ul>
		</nav>
	);
}

export default Header;