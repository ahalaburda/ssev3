import React from "react";
import ObjetosDeGastosTable from "../../components/Tables/ObjetoDeGasto";
import NuevoObjetoDeGasto from "../../components/Forms/NuevoObjetoDeGasto";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function ObjetosDeGastos() {
  return (
      <div>
          <div className="d-sm-flex align-items-center justify-content-between mb-4">
              <h1 className="h3 mb-0 text-gray-800">Objetos de Gastos</h1>
              <button className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" data-toggle="modal"
                      data-target="#newModal"><FontAwesomeIcon icon="plus" size="sm" className="text-white-50"/>&nbsp;Nuevo</button>
           </div>

          {/*Modal de nuevo objeto de gasto*/}
          <NuevoObjetoDeGasto/>

          {/*Tabla de lista de objetos de gastos*/}
          <ObjetosDeGastosTable/>
      </div>
  );
}

export default ObjetosDeGastos;
