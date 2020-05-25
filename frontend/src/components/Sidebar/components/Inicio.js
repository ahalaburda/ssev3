import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function Inicio() {
  return (
    <li className="nav-item">
      <a className="nav-link" href="//google.com">{/*TODO url inicio*/}
        <FontAwesomeIcon icon="tachometer-alt" size="fw"/>
        <span>&nbsp;Inicio</span></a>
    </li>
  );
}

export default Inicio;