import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartBar} from "@fortawesome/free-solid-svg-icons/faChartBar";

function Graficos() {
  return (
    <li className="nav-item">
      <a className="nav-link collapsed" href="//google.com" aria-expanded="false">{/*TODO url graficos*/}
        <FontAwesomeIcon icon={faChartBar} size={'fw'}/>
        <span>&nbsp;Graficos</span>
      </a>
    </li>
  );
}

export default Graficos;