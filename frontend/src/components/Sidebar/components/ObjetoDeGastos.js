import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";

function ObjetoDeGastos() {
  return (
    <li className="nav-item">
      <Link to="/objetos_de_gastos/" className="nav-link">
        <FontAwesomeIcon icon="comment-dollar" size="sm"/>
        <span>&nbsp;Objetos de Gastos</span>
      </Link>
    </li>
  );
}

export default ObjetoDeGastos;