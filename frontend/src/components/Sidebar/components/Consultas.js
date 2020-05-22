import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons/faSearch";

function Consultas() {
  return (
    <li className="nav-item">
      <a className="nav-link collapsed" href="//google.com">{/*TODO url consultas*/}
        <FontAwesomeIcon icon={faSearch} size={'fw'}/>
        <span>&nbsp;Consultas</span>
      </a>
    </li>
  );
}

export default Consultas;