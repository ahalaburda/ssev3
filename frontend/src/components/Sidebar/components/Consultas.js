import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";

function Consultas() {
  return (
    <li className="nav-item">
      <Link to='/consultas/' className='nav-link'>
        <FontAwesomeIcon icon="search" size="sm"/>
        <span>&nbsp;Consultas</span>
      </Link>
    </li>
  );
}

export default Consultas;