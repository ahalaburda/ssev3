import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function Graficos() {
  return (
    <li className="nav-item">
      <a className="nav-link collapsed" href="//google.com" aria-expanded="false">{/*TODO url graficos*/}
        <FontAwesomeIcon icon="chart-bar" size="sm"/>
        <span>&nbsp;Graficos</span>
      </a>
    </li>
  );
}

export default Graficos;