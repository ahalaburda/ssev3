import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTachometerAlt} from "@fortawesome/free-solid-svg-icons/faTachometerAlt";

function Inicio() {
  return (
    <li className="nav-item">
      <a className="nav-link" href="//google.com">{/*TODO url inicio*/}
        <FontAwesomeIcon icon={faTachometerAlt} size={'fw'}/>
        <span>&nbsp;Inicio</span></a>
    </li>
  );
}

export default Inicio;