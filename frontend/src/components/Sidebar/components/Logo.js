import React from "react";
import {Link} from "react-router-dom";
import logo from "../../../sse_logo.svg";
import minLogo from "../../../sse_logo_min.svg";

function Logo(props) {
  return (
    <Link to='/' className="sidebar-brand d-flex align-content-center justify-content-center">
      {props.toggleIcon ? <img src={minLogo} alt="sse-min-logo"/> : <img src={logo} alt="sse-logo"/>}
    </Link>
  );
}

export default Logo;