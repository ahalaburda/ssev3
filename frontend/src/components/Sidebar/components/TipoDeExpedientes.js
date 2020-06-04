import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";

function TipoDeExpedientes() {
  return (
    <li className="nav-item">
      <Link to='/tipos_de_expedientes/' className="nav-link">
        <FontAwesomeIcon icon="chart-area" size="sm"/>
        <span>&nbsp;Tipos de<br/>&emsp;&emsp;Expedientes</span>
      </Link>
    </li>
  );
}

export default TipoDeExpedientes;