import React from "react";
import {Link} from "react-router-dom";

function Logo() {
  return (
    <Link to='/' className="sidebar-brand d-flex align-content-center justify-content-center">
      <div className="sidebar-brand-text mx-3">SSE <sup>3</sup></div>
    </Link>
  );
}

export default Logo;