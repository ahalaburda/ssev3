import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function ObjetosDeGastos() {
  return (
    <li className="nav-item">
      <a className="nav-link" href="//google.com">{/*TODO url objeto de gasto*/}
      <FontAwesomeIcon icon="comment-dollar" size="sm"/>
      <span>&nbsp;Objetos de<br/>&emsp;&emsp;Gastos</span></a>
    </li>
  );
}

export default ObjetosDeGastos;