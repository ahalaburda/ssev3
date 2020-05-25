import React from 'react';
import './Header.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons/faBars";
import Configuraciones from "./components/Configuraciones";
import Notificaciones from "./components/Notificaciones";
import UserInfo from "./components/UserInfo";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Header() {
	return (
		<nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
			{/* Sidebar Toggle (Topbar) */}
			<button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
				<FontAwesomeIcon icon={faBars}/>
			</button>

			<form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
				<div className="input-group">
					<input type="text" className="form-control class-light border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" />
					<div className="input-group-append">
						<button className="btn btn-primary" type="button">
							{/*<i className="fas fa-search fa-sm"></i>*/}
							 <FontAwesomeIcon icon="search" size="xs"/>
						</button>
					</div>
				</div>
			</form>

			{/* Topbar Navbar */}
			<ul className="navbar-nav ml-auto">
				{/* Nav Item - Configuraciones */}
				<Configuraciones/>
				{/* Nav Item - Notificaciones */}
				<Notificaciones/>
				{/* Nav Divider */}
				<div className="topbar-divider d-none d-sm-block"/>
				{/* Nav Item - User Information */}
				<UserInfo/>
			</ul>
		</nav>
	);
}

export default Header;