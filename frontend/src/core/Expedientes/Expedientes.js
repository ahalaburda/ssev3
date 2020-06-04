import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function Expedientes() {
  return (
    <div className="d-sm-flex align-items-center mb-4">
      <h1 className="h3 mb-0 text-gray-800 mr-auto">Expedientes</h1>
      <div className="button-group">
        <a href="#" className="btn btn-sm btn-primary shadow-sm" data-toggle="modal" data-target="#newModal">
          <FontAwesomeIcon icon="plus" size="sm" className="text-white-50"/>&nbsp;Nuevo</a>
        <a href="#" className="btn btn-sm btn-primary shadow-sm" data-toggle="modal" data-target="#processModal">
          <FontAwesomeIcon icon="pencil-alt" size='sm' className="text-white-50"/>&nbsp;Procesar</a>
      </div>
    </div>
  );
}

export default Expedientes;
