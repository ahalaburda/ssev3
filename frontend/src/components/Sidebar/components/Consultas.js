import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function Consultas() {
  return (
    <li className="nav-item">
      <a className="nav-link collapsed" href="//google.com">{/*TODO url consultas*/}
        <FontAwesomeIcon icon="search" size="fw"/>
        <span>&nbsp;Consultas</span>
      </a>
    </li>
  );
}

export default Consultas;