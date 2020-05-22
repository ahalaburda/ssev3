import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCommentDollar} from "@fortawesome/free-solid-svg-icons/faCommentDollar";

function ObjetosDeGastos() {
  return (
    <li className="nav-item">
      <a className="nav-link" href="//google.com">{/*TODO url objeto de gasto*/}
      <FontAwesomeIcon icon={faCommentDollar} size={'fw'}/>
      <span>&nbsp;Objetos de<br/>&emsp;&emsp;Gastos</span></a>
    </li>
  );
}

export default ObjetosDeGastos;