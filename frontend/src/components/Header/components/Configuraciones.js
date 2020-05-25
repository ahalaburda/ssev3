import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function Configuraciones() {
  return (
    <li className="nav-item dropdown no-arrow mx-1">
      <a className="nav-link dropdown-toggle" href="//google.com" role="button">{/*TODO url configuraciones*/}
        <FontAwesomeIcon icon="cogs" size="fw"/>
      </a>
    </li>
  );
}

export default Configuraciones;