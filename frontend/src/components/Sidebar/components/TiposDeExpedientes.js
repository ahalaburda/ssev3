import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function TiposDeExpedientes() {
  return (
    <li className="nav-item">
      <a className="nav-link" href="//google.com">{/*TODO url tipo de expediente*/}
        <FontAwesomeIcon icon="chart-area" size="fw"/>
        <span>&nbsp;Tipos de<br/>&emsp;&emsp;Expedientes</span></a>
    </li>
  );
}

export default TiposDeExpedientes;