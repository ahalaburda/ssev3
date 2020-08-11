import React, {Component} from "react";
import Consulta from "../../components/Tables/Consulta";
import ConsultaService from "../../services/Consultas";
import {Tabs, Tab} from "react-bootstrap";

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
    //TODO verificar fechaMe y dependencia actual
    ConsultaService.getById(id)
      .then(response => {
        this.setState({
          data: [{
            id: response.data.id,
            numero: response.data.numero_mesa_de_entrada,
            fechaMe: response.data.fecha_actualizacion,
            origen: response.data.dependencia_origen_id.descripcion,
            destino: response.data.dependencia_destino_id.descripcion,
            descripcion: response.data.descripcion,
            estado: response.data.estado_id.descripcion,
            dependenciaActual: ''
          }]
        })
      })
      .catch(e => {
        console.log(e);
      })
  }

  handleIdSearch = () => {
    //check valid
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
                  > Buscar</button>
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
