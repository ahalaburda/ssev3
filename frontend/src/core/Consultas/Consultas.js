import React, {Component} from "react";
import Consulta from "../../components/Tables/Consulta";
import ExpedienteService from "../../services/Expedientes";
import DependenciaService from "../../services/Dependencias";
import Popups from "../../components/Popups";
import {Tabs, Tab} from "react-bootstrap";
import warnAboutDeprecatedESMImport from "react-router-dom/es/warnAboutDeprecatedESMImport";

class Consultas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      id: '',
      description: '',
      num: '',
      year: ''
    }
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleNumChange = this.handleNumChange.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
    this.findById = this.findById.bind(this);
    this.handleIdSearch = this.handleIdSearch.bind(this);
  }

  handleIdChange = e => {
    this.setState({id: e.target.value});
  }

  handleDescriptionChange = e => {
    this.setState({description: e.target.value});
  }

  handleNumChange = e => {
    this.setState({num: e.target.value});
  }

  handleYearChange = e => {
    this.setState({year: e.target.value});
  }

  findById = id => {
    //TODO verificar fechaMe
    let expediente;
    ExpedienteService.getById(id)
      .then(response => {
        if (response.status === 200 && response.statusText === 'OK') {
          expediente = response.data;
          DependenciaService.getById(expediente.dependencia_actual_id)
            .then(response => {
              if (response.status === 200 && response.statusText === 'OK') {
                // se reemplaza el ID de la dependencia actual por la descripcion de esa dependencia
                expediente.dependencia_actual_id = response.data.descripcion;
                this.setState({
                  data: [{
                    id: expediente.id,
                    numero: expediente.numero_mesa_de_entrada,
                    fechaMe: expediente.fecha_actualizacion,
                    descripcion: expediente.descripcion,
                    origen: expediente.dependencia_origen_id.descripcion,
                    destino: expediente.dependencia_destino_id.descripcion,
                    dependenciaActual: expediente.dependencia_actual_id,
                    estado: expediente.estado_id
                  }]
                });
                Popups.success('Expediente encontrado.');
              } else {
                Popups.error('Ocurrio un error durante la busqueda.');
              }
            })
            .catch(e => {
              console.log(`Error findById: DependenciaService\n${e}`);
            })
        } else if (response.status === 404) {
          Popups.error('Expediente no encontrado.');
        } else {
          Popups.error('Ocurrio un error durante la busqueda.');
        }
      })
      .catch(e => {
        console.log(`Error findById: ExpedienteService\n${e}`);
      });
  }

  handleIdSearch = () => {
    this.findById(this.state.id);
  }

  render() {
    return (
      <>
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0 text-gray-800">Consultas</h1>
        </div>
        <Tabs defaultActiveKey="byId" id="uncontrolled-tab-example">
          <Tab eventKey="byId" title="Buscar por ID">
            <div className="col-6">
              <div className="form-group row">
                <label className="col-form-label col-sm-4">Número ID: </label>
                <div className="col-5 input-group">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    onChange={e => this.handleIdChange(e)}
                    value={this.state.id}
                  />
                </div>
                <div className="col text-center">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={this.handleIdSearch}
                  > Buscar
                  </button>
                </div>
              </div>
            </div>
          </Tab>
          <Tab eventKey="byDescription" title="Buscar por descripción">
            <div className="col-6">
              <div className="form-group row">
                <label className="col-form-label col-sm-4">Descripción: </label>
                <div className="col-5 ">
                  <textarea
                    className="form-control form-control-sm"
                    onChange={e => this.handleDescriptionChange(e)}
                    value={this.state.description}
                  />
                </div>
                <div className="col text-center">
                  <button className="btn btn-sm btn-primary"> Buscar</button>
                </div>
              </div>
            </div>
          </Tab>
          <Tab eventKey="byNumber" title="Buscar por número">
            <div className="col-6">
              <div className="form-group row">
                <label className="col-form-label col-sm-4">Número de Expediente: </label>
                <div className="col-5 input-group">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    onChange={e => this.handleNumChange(e)}
                    value={this.state.num}
                  />
                </div>
                <div className="col text-center">
                  <button className="btn btn-sm btn-primary"> Buscar</button>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-form-label col-sm-4">Año: </label>
                <div className="col-5 input-group">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    onChange={e => this.handleYearChange(e)}
                    value={this.state.year}
                  />
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
        <Consulta data={this.state.data}/>
      </>
    );
  }
}

export default Consultas;
