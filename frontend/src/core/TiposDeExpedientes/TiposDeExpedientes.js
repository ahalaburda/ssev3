import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import NuevoTipoExpediente from "../../components/Forms/NuevoTipoExpediente";

function TiposDeExpedientes() {
  return (
    <div className="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 className="h3 mb-0 text-gray-800">Tipos de expedientes</h1>
      <a href="#" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" data-toggle="modal"
         data-target="#newModal"><FontAwesomeIcon icon={faPlus} size={'sm'}/>&nbsp;Nuevo</a>{/*<i className="fas fa-plus fa-sm text-white-50"></i>*/}
      <NuevoTipoExpediente/>
    </div>
  );
}

export default TiposDeExpedientes;