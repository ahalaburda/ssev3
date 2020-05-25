import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function UserInfo() {
  return (
    <li className="nav-item dropdown no-arrow">
      <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown"
         aria-haspopup="true" aria-expanded="false">
        <span className="mr-2 d-none d-lg-inline text-gray-600 small">user</span>
        <img className="img-profile rounded-circle" src="https://source.unsplash.com/kmTq5GU6c-0/60x60" alt=""/>
      </a>
      {/* Dropdown - User Information */}
      <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
        <a className="dropdown-item" href="//google.com">{/*TODO url cambiar contrasenha*/}
          <FontAwesomeIcon icon="user" size="sm"/>
            &nbsp;Cambiar contraseña
        </a>
        <a className="dropdown-item" href="//google.com" data-toggle="modal" data-target="#logoutModal">{/*TODO url cerrar sesion*/}
          <FontAwesomeIcon icon="sign-out-alt" size="sm"/>
            &nbsp;Cerrar Sesion
        </a>
      </div>
    </li>
  );
}

export default UserInfo;