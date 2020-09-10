import React, {Component} from "react";
import Consulta from "../../components/Tables/Consulta";
import InstanciaService from "../../services/Instancias";
import Popups from "../../components/Popups";
import {Tabs, Tab} from "react-bootstrap";
import moment from "moment";
import SimpleReactValidator from 'simple-react-validator';

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
    this.setStateFromResponse = this.setStateFromResponse.bind(this);
    this.findByDescription = this.findByDescription.bind(this);
    this.handleDescriptionSearch = this.handleDescriptionSearch.bind(this);
    this.findByYearNum = this.findByYearNum.bind(this);
    this.handleYearNumSearch = this.handleYearNumSearch.bind(this);
    //opciones y mensajes para la validacion
    this.validator = new SimpleReactValidator({
      className: 'text-danger',
      messages: {
        numeric: 'Debe ingresar un número.',
        min: 'El número debe ser positivo.',
        required: 'Este campo no puede estar vacío.'
      }
    });
  }


  //TODO unificar la forma en que se setea el estado y controlar el tamanho del arreglo que devuelve response.data.result
  handleIdChange = e => {
    this.setState({id: e.target.value});
    this.validator.showMessageFor('id');
  }

  handleDescriptionChange = e => {
    this.setState({description: e.target.value});
    this.validator.showMessageFor('description');
  }

  handleNumChange = e => {
    this.setState({num: e.target.value});
    this.validator.showMessageFor('numExp');
  }

  handleYearChange = e => {
    this.setState({year: e.target.value});
    this.validator.showMessageFor('year');
  }

  findById = id => {
   
      //TODO verificar fechaMe y si al tomar el primer elemento, asegurarse de que si haya algo en ese arreglo
      InstanciaService.getByExpedienteId(id)
      .then(response => {
        if (response.status === 200 && response.statusText === 'OK') {
          this.setState({
            data: [{
              id: response.data.results[0].expediente_id.id,
              numero: response.data.results[0].expediente_id.numero_mesa_de_entrada,
              fechaMe: moment(response.data.results[0].expediente_id.fecha_actualizacion).format('DD-MM-YYYY kk:mm:ss'),
              descripcion: response.data.results[0].expediente_id.descripcion,
              origen: response.data.results[0].expediente_id.dependencia_origen_id.descripcion,
              destino: response.data.results[0].expediente_id.dependencia_destino_id.descripcion,
              dependenciaActual: response.data.results[0].dependencia_actual_id.descripcion,
              estado: response.data.results[0].estado_id.descripcion
            }]
          });
        } else if (response.status === 404) {
          Popups.error('Expediente no encontrado.');
        } else {
          Popups.error('Ocurrio un error durante la busqueda.');
        }
      })
      .catch(e => {
        console.log(`Error findByExpedienteId: InstanciaService\n${e}`);
      });

    
  }

  handleIdSearch = () => {
    if (this.validator.fieldValid('id')) {
      this.findById(this.state.id);  
    }
    
  }

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

  findByDescription = description => {
   
      InstanciaService.getByExpDescription(description)
      .then(response => {
        if (response.status === 200 && response.statusText === 'OK') {
          this.setStateFromResponse(response);
        } else if (response.status === 404) {
          Popups.error('Descripción no encontrada.');
        } else {
          Popups.error('Ocurrio un error durante la busqueda.');
        }
      })
      .catch(e => {
        console.log(`Error findByExpDescription: InstanciaService\n${e}`);
      });  
    
    
  }

  handleDescriptionSearch = () => {
    if (this.validator.fieldValid('description')) {
      this.findByDescription(this.state.description);    
    }
  }

  findByYearNum = (year, num) => {
    InstanciaService.getByExpYearNum(year, num)
    .then(response => {
      if (response.status === 200 && response.statusText === 'OK') {
        this.setStateFromResponse(response);
      } else if (response.status === 404) {
        Popups.error('Año o número de mesa no encontrados.');
      } else {
        Popups.error('Ocurrio un error durante la busqueda.');
      }
    })
    .catch(e => {
      console.log(`Error findByExpYearNum: InstanciaService\n${e}`);
    })  
  }

  handleYearNumSearch = () => {
    if (this.validator.fieldValid('numExp') && this.validator.fieldValid('year')) {
      this.findByYearNum(this.state.year, this.state.num); 
    }
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
                <label className="col-form-label col-sm-4" name='numeroID'>Número ID: </label>
                <div className="col-5 input-group">
                  <input
                    type="number"
                    name='id'
                    className="form-control form-control-sm"
                    onChange={e => this.handleIdChange(e)}
                    onBlur={e => this.handleIdChange(e)}
                    value={this.state.id}
                  />
                  {this.validator.message('id', this.state.id, 'required|numeric|min:0,num')}
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
                    name='description'
                    onChange={e => this.handleDescriptionChange(e)}
                    onBlur={e => this.handleDescriptionChange(e)}
                    value={this.state.description}
                  />
                  {this.validator.message('description', this.state.description, 'required')}
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
                    type="number"
                    className="form-control form-control-sm"
                    name='numExp'
                    onChange={e => this.handleNumChange(e)}
                    onBlur={e => this.handleNumChange(e)}
                    value={this.state.num}
                  />
                  {this.validator.message('numExp', this.state.num, 'required|numeric|min:0,num')}
                </div>
                <div className="col text-center">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={this.handleYearNumSearch}
                    onBlur={e => this.handleYearNumSearch(e)}
                  > Buscar</button>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-form-label col-sm-4">Año: </label>
                <div className="col-5 input-group">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    name='year'
                    onChange={e => this.handleYearChange(e)}
                    onBlur={e => this.handleYearChange(e)}
                    value={this.state.year}
                  />
                  {this.validator.message('year', this.state.year, 'required|numeric|min:0,num')}
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
