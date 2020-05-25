import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function Reportes() {
  return (
    <li className="nav-item">
      <a className="nav-link" href="//google.com">{/*TODO url reportes*/}
        <FontAwesomeIcon icon="folder" size="fw"/>
        <span>&nbsp;Reportes</span>
      </a>
    </li>
  );
}

export default Reportes;