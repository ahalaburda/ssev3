import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFolder} from "@fortawesome/free-solid-svg-icons/faFolder";

function Reportes() {
  return (
    <li className="nav-item">
      <a className="nav-link collapsed" href="//google.com">{/*TODO url reportes*/}
        <FontAwesomeIcon icon={faFolder} size={'fw'}/>
        <span>&nbsp;Reportes</span>
      </a>
    </li>
  );
}

export default Reportes;