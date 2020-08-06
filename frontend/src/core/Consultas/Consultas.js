import React from "react";
import Consulta from "../../components/Tables/Consulta";
import {Tabs, Tab} from "react-bootstrap";

function Consultas() {
  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Consultas</h1>
      </div>
      <Tabs defaultActiveKey="byId" id="uncontrolled-tab-example">
        <Tab eventKey="byId" title="Buscar por ID">
          <div className="col-6">
            <h6 className="m-0 font-weight-bold col-form-label">Buscar Expediente</h6>
            <div className="form-group row">
              <label className="col-form-label col-sm-4">Número ID: </label>
              <div className="col-5 input-group">
                <input type="text" className="form-control-sm/"/>
              </div>
              <div className="col text-center">
                <button className="btn btn-primary"> Buscar</button>
              </div>
            </div>
          </div>
        </Tab>
        <Tab eventKey="byDescription" title="Buscar por descripción">
          <div className="col-6">
            <h6 className="m-0 font-weight-bold col-form-label">Buscar Expediente</h6>
            <div className="form-group row">
              <label className="col-form-label col-sm-4">Descripción: </label>
              <div className="col-5 ">
                <textarea className="form-control/"/>
              </div>
              <div className="col text-center">
                <button className="btn btn-primary"> Buscar</button>
            </div>
          </div>
        </div>
        </Tab>
        <Tab eventKey="byNumber" title="Buscar por número">
          <div className="col-6">
            <h6 className="m-0 font-weight-bold col-form-label">Buscar Expediente</h6>
            <div className="form-group row">
              <label className="col-form-label col-sm-4">Número de Expediente: </label>
              <div className="col-5 input-group">
                <input type="text" className="form-control-sm/"/>
              </div>
              <div className="col text-center">
                <button className="btn btn-primary"> Buscar</button>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-form-label col-sm-4">Año: </label>
            <div className="col-5 input-group">
              <input type="text" className="form-control-sm/"/>
            </div>
          </div>
        </div>
        </Tab>
      </Tabs>
      <Consulta/>
    </>
  );
}

export default Consultas;
