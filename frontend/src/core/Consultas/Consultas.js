import React, {Component} from "react";
import Consulta from "../../components/Tables/Consulta";
import InstanciaService from "../../services/Instancias";
import Popups from "../../components/Popups";
import {Tabs, Tab} from "react-bootstrap";
import moment from "moment";

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
    this.setStateFromResponse = this.setStateFromResponse.bind(this);
    this.handleIdSearch = this.handleIdSearch.bind(this);
    this.handleDescriptionSearch = this.handleDescriptionSearch.bind(this);
    this.handleYearNumSearch = this.handleYearNumSearch.bind(this);
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

  //TODO verificar fechaMe
  setStateFromResponse = response => {
    this.setState({
      data: response.data.results.map(ie => {
        return {
          id: ie.expediente_id.id,
          numero: ie.expediente_id.numero_mesa_de_entrada,
          fechaMe: moment(ie.expediente_id.fecha_actualizacion).format('DD-MM-YYYY kk:mm:ss'),
          descripcion: ie.expediente_id.descripcion,
          origen: ie.expediente_id.dependencia_origen_id.descripcion,
          destino: ie.expediente_id.dependencia_destino_id.descripcion,
          dependenciaActual: ie.dependencia_actual_id.descripcion,
          estado: ie.estado_id.descripcion
        }
      })
    });
  }

  handleIdSearch = () => {
    InstanciaService.getByExpedienteId(this.state.id)
      .then(response => {
        this.setStateFromResponse(response);
        Popups.success('Expediente encontrado.');
      })
      .catch(e => {
        if (e.response.status === 400) {
          Popups.error(e.response.statusText);
        } else {
          Popups.error('Ocurrió un error durante la búsqueda.');
        }
        console.log(`Error findByExpedienteId: InstanciaService\n${e}`);
      });
  }

  handleDescriptionSearch = () => {
    InstanciaService.getByExpDescription(this.state.description)
      .then(response => {
        this.setStateFromResponse(response);
        Popups.success('Descripción encontrada.');
      })
      .catch(e => {
        if (e.response.status === 404) {
          Popups.error('Descripción no encontrada.');
        } else {
          Popups.error('Ocurrió un error durante la búsqueda.');
        }
        console.log(`Error findByExpDescription: InstanciaService\n${e}`);
      });
  }

  handleYearNumSearch = () => {
    InstanciaService.getByExpYearNum(this.state.year, this.state.num)
      .then(response => {
        this.setStateFromResponse(response);
        Popups.success('Año-Descripción encontrada.');
      })
      .catch(e => {
        if (e.response.status === 404) {
          Popups.error('Año o número de mesa no encontrados.');
        } else {
          Popups.error('Ocurrio un error durante la búsqueda.');
        }
        console.log(`Error findByExpYearNum: InstanciaService\n${e}`);
      });
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
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={this.handleDescriptionSearch}
                  > Buscar</button>
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
                    className="form2-control form-control-sm"
                    onChange={e => this.handleNumChange(e)}
                    value={this.state.num}
                  />
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
                <div className="col text-center">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={this.handleYearNumSearch}
                  > Buscar</button>
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
