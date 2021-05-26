import React from 'react';
import './Header.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Configuraciones from "./components/Configuraciones";
import UserInfo from "./components/UserInfo";
import helper from '../../utils/helper';
import SeleccionarTema from './components/SeleccionarTema';

function setTheme() {
	let theme = helper.getTheme() === 'dark' ? "navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow bg-black " :
	"navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow";
	console.log(theme);
	return theme
}

function Header(props) {
	return (
		<nav className={setTheme()}>
			{/* Sidebar Toggle (Topbar) */}
			<button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
				<FontAwesomeIcon icon="bars" />
			</button>

			{/* Topbar Navbar */}
			<div style={{ alignItems: 'center' }} className='ml-auto'>{(helper.getCurrentYearSetting())}</div>
			<ul className="navbar-nav ">

				{/* Nav Item - Configuraciones */}
				<Configuraciones />
				{/* Nav Item - SeleccionarTema */}
				<SeleccionarTema />
				{/* Nav Divider */}
				<div className="topbar-divider d-none d-sm-block" />
				{/* Nav Item - User Information */}
				<UserInfo username={props.username} logout={props.handleLogout} />
			</ul>
		</nav>
	);
}

export default Header;
