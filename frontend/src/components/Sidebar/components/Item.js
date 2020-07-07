import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";

function Item(props) {
  return (
    <li className="nav-item">
      <Link to={props.link} className='nav-link'>
        <FontAwesomeIcon icon={props.icon} size="sm"/>
        <span>&nbsp;{props.text}</span>
      </Link>
    </li>
  );
}

export default Item;