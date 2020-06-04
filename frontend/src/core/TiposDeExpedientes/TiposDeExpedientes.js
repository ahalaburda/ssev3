import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import NuevoTipoExpediente from "../../components/Forms/NuevoTipoExpediente";

function TiposDeExpedientes() {
  return (
    <div className="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 className="h3 mb-0 text-gray-800">Tipos de expedientes</h1>
      <button className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" data-toggle="modal"
         data-target="#newModal"><FontAwesomeIcon icon="plus" size="sm" className="text-white-50"/>&nbsp;Nuevo</button>

      {/*Modal de nuevo expediente*/}
      <NuevoTipoExpediente/>
    </div>
  );
}

export default TiposDeExpedientes;