import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function Notificaciones() {
  return (
    <li className="nav-item dropdown no-arrow mx-1">
      <a className="nav-link dropdown-toggle" href="#" id="messagesDropdown" role="button" data-toggle="dropdown"
         aria-haspopup="true" aria-expanded="false">
        <FontAwesomeIcon icon="bell" size="sm"/>
        {/* Counter - Messages */}
        <span className="badge badge-danger badge-counter">2</span>
      </a>
      {/* Dropdown - Messages */}
      <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
           aria-labelledby="messagesDropdown">
        <h6 className="dropdown-header">
          Notificaciones
        </h6>
        <a className="dropdown-item d-flex align-items-center" href="//google.com">{/*TODO url para una notificacion*/}
          <div className="dropdown-list-image mr-3">
            <img className="rounded-circle" src="https://source.unsplash.com/fn_BT9fwg_E/60x60" alt=""/>
              <div className="status-indicator bg-success"/>
          </div>
          <div>
            <div className="text-truncate">Nuevo Expediente recibido.</div>
            <div className="small text-gray-500">Mesa de entrada</div>
          </div>
        </a>
        <a className="dropdown-item text-center small text-gray-500" href="//google.com">Read More Messages</a>{/*TODO url mas notificaciones*/}
      </div>
    </li>
  );
}

export default Notificaciones;