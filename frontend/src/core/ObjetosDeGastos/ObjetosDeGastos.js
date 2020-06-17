import React from "react";
import ObjetosDeGastosTable from "../../components/Tables/ObjetoDeGasto";
import NuevoObjetoDeGasto from "../../components/Forms/NuevoObjetoDeGasto";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function ObjetosDeGastos() {
  return (
      <div>

          {/*Tabla de lista de objetos de gastos*/}
          <ObjetosDeGastosTable/>
      </div>
  );
}

export default ObjetosDeGastos;
