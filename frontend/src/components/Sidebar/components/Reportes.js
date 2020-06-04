import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";

function Reportes() {
  return (
    <li className="nav-item">
      <Link to="/reportes/" className="nav-link">
        <FontAwesomeIcon icon="folder" size="sm"/>
        <span>&nbsp;Reportes</span>
      </Link>
    </li>
  );
}

export default Reportes;