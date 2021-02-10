import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function UserInfo(props) {
  return (
    <>
      <li className="nav-item dropdown no-arrow">
        <div className="nav-link dropdown-toggle" id="userDropdown" role="button" data-toggle="dropdown"
           aria-haspopup="true" aria-expanded="false">
          <span className="mr-2 d-none d-lg-inline text-gray-600 small">{props.username}</span>
         </div>
        {/* Dropdown - User Information */}
        <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
          <button className="dropdown-item" onClick={() => {
            if (window.confirm('Estás seguro?')) props.logout()
          }}>
            <FontAwesomeIcon icon="sign-out-alt" size="sm"/>
            &nbsp;Cerrar Sesion
          </button>
        </div>
      </li>
    </>
  );
}

export default UserInfo;