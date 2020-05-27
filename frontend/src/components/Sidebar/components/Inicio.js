import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";

function Inicio() {
  return (
    <li className="nav-item">
      <Link to='/' className="nav-link">
        <FontAwesomeIcon icon="tachometer-alt" size="sm"/>
        <span>&nbsp;Inicio</span>
      </Link>
    </li>
  );
}

export default Inicio;