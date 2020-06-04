import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";

function Graficos() {
  return (
    <li className="nav-item">
      <Link to='/graficos/' className='nav-link'>
        <FontAwesomeIcon icon="chart-bar" size="sm"/>
        <span>&nbsp;Graficos</span>
      </Link>
    </li>
  );
}

export default Graficos;