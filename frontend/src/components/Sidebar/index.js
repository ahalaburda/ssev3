import React from 'react'

function Sidebar() {
	return (
		<div>
			<ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
				<a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
					<div className="sidebar-brand-icon rotate-n-15">
						<i className="fas fa-laugh-wink"></i>
					</div>
					<div className="sidebar-brand-text mx-3">SSE <sup>v3</sup></div>
				</a>
				<hr className="sidebar-divider my-0" />
				<li className="nav-item active">
					<a className="nav-link" href="index.html">
					<i className="fas fa-fw fa-tachometer-alt"></i>
					<span>Inicio</span></a>
				</li>

				<hr className="sidebar-divider" />

				<div className="sidebar-heading">
					Expedientes
				</div>

		        <hr className="sidebar-divider my-0" />

		        <li className="nav-item">
		            <a className="nav-link collapsed" href="#">
		                <i className="fas fa-fw fa-search"></i>
		                <span>Expedientes</span>
		            </a>
		        </li>

		        <li className="nav-item">
		            <a className="nav-link collapsed" href="#">
		                <i className="fas fa-fw fa-search"></i>
		                <span>Consultas</span>
		            </a>
		        </li>

		        <li className="nav-item">
		            <a className="nav-link collapsed" href="#">
		                <i className="fas fa-fw fa-folder"></i>
		                <span>Reportes</span>
		            </a>
		        </li>
		        <hr className="sidebar-divider d-none d-md-block" />

		        <li className="nav-item">
		            <a className="nav-link" href="#">
		                <i className="fas fa-fw fa-chart-area"></i>
		                <span>Tipos de<br />Expedientes</span></a>
		        </li>
		        <li className="nav-item">
		            <a className="nav-link" href="#">
		                <i className="fas fa-fw fa-chart-area"></i>
		                <span>Dependencias</span></a>
		        </li>
		        <li className="nav-item">
		            <a className="nav-link" href="#">
		                <i className="fas fa-fw fa-chart-area"></i>
		                <span>Objetos de Gastos</span></a>
		        </li>

				<hr className="sidebar-divider d-none d-md-block" />

				<div className="text-center d-none d-md-inline">
					<button className="rounded-circle border-0" id="sidebarToggle"></button>
				</div>

			</ul>
		</div>
	);
}

export default Sidebar;