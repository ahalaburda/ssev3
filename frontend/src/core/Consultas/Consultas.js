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
    this.setStateFromResponse = this.setStateFromResponse.bind(this);
    this.handleIdSearch = this.handleIdSearch.bind(this);
    this.handleDescriptionSearch = this.handleDescriptionSearch.bind(this);
    this.handleYearNumSearch = this.handleYearNumSearch.bind(this);
    //opciones y mensajes para la validacion
    this.validator = new SimpleReactValidator({
      className: 'text-danger',
      messages: {
        numeric: 'Debe ingresar un número.',
        min: 'ID no valido.',
        max: 'Máximo 50 caracteres.',
        required: 'Este campo no puede estar vacío.'
      }
    });
  }

  /**
   * Setear el estado ID con el valor ingresado en el input.
   * Mostrar los mensajes de validacion correspondientes.
   * @param e
   */
  handleIdChange = e => {
    this.setState({id: e.target.value});
    this.validator.showMessageFor('id');
    this.validator.hideMessageFor('description');
    this.validator.hideMessageFor('numExp');
    this.validator.hideMessageFor('year');
  }

  /**
   * Setear el estado descripcion con el valor ingresado en el input.
   * Mostrar los mensajes de validacion correspondientes.
   * @param e
   */
  handleDescriptionChange = e => {
    this.setState({description: e.target.value});
    this.validator.showMessageFor('description');
    this.validator.hideMessageFor('id');
    this.validator.hideMessageFor('numExp');
    this.validator.hideMessageFor('year');
  }

  /**
   * Setear el estado numero de mesa de entrada con el valor ingresado en el input.
   * Mostrar los mensajes de validacion conrrespondientes.
   * @param e
   */
  handleNumChange = e => {
    this.setState({num: e.target.value});
    this.validator.showMessageFor('numExp');
    this.validator.hideMessageFor('id');
    this.validator.hideMessageFor('description');
  }

  /**
   * Setear el estado anho con el valor ingresado en el input.
   * Mostrar los mensajes de validacion correspondientes.
   * @param e
   */
  handleYearChange = e => {
    this.setState({year: e.target.value});
    this.validator.showMessageFor('year');
    this.validator.hideMessageFor('id');
    this.validator.hideMessageFor('description');
  }

  /**
   * Toma el ID pasado del estado y ejecuta el servicio para buscar un expediente por su ID.
   * @param id
   */
  findById = id => {
    InstanciaService.getByExpedienteId(id)
      .then(response => {
        this.setStateFromResponse(response);
      })
      .catch(e => {
        Popups.error('Expediente no encontrado.')
        console.log(`Error findByExpedienteId: InstanciaService\n${e}`);
      });
  }

  /**
   * Chequea si las validaciones estan correctas y pasa el ID a la funcion findById.
   */
  handleIdSearch = () => {
    if (this.validator.fieldValid('id')) {
      this.findById(this.state.id);
    }
  }

  /**
   * Dado un response de Axios, este setea el estado con la lista de expedientes a mostrar.
   * @param response
   */
  setStateFromResponse = response => {
    //se controla el contador del response porque da codigo 200 aunque no encuentre ningun expediente
    if (response.data.count > 0) {
      this.setState({
        data: response.data.results.map(ie => {
          return {
            id: ie.expediente_id.id,
            numero: ie.expediente_id.numero_mesa_de_entrada + "/" + ie.expediente_id.anho,
            fechaMe: moment(ie.expediente_id.fecha_mesa_entrada) ?
              moment(ie.expediente_id.fecha_mesa_entrada).format('DD/MM/YYYY - kk:mm:ss') : 'Sin fecha',
            descripcion: ie.expediente_id.descripcion,
            origen: ie.expediente_id.dependencia_origen_id.descripcion,
            destino: ie.expediente_id.dependencia_destino_id.descripcion,
            dependenciaActual: ie.dependencia_actual_id.descripcion,
            estado: ie.expediente_id.estado_id.descripcion
          }
        })
      });
      Popups.success('Expediente encontrado.');
    } else {
      Popups.error('No se encontro el expediente');
    }
  }

  /**
   * Toma la descripcion pasada del estado y ejecuta el servicio de busqueda por descripcion.
   * @param description
   */
  findByDescription = description => {
    InstanciaService.getByExpDescription(description)
      .then(response => {
        if (response.data.count === 0) {
          Popups.error('Expediente(s) no encontrado(s).');
        } else {
          this.setStateFromResponse(response);
        }
      })
      .catch((e) => {
        Popups.error('Ocurrio un error durante la busqueda.');
        console.log(`Error findByDescription: InstanciaService\n${e}`);
      });
  }

  /**
   * Chequea si las validaciones estan correctas y pasa la descripcion a la funcioni findByDescription.
   */
  handleDescriptionSearch = () => {
    if (this.validator.fieldValid('description')) {
      this.findByDescription(this.state.description);
    }
  }

  /**
   * Toma el anho y el numero del estado y ejecuta el servicio de busqueda por anho y numero de mesa de entrada.
   * @param year
   * @param num
   */
  findByYearNum = (year, num) => {
    InstanciaService.getByExpYearNum(year, num)
      .then(response => {
        this.setStateFromResponse(response);
      })
      .catch(e => {
        Popups.error('Ocurrio un error durante la búsqueda.');
        console.log(`Error findByExpYearNum: InstanciaService\n${e}`);
      });
  }

  /**
   * Chequea si las validaciones estan correctas y pasa el anho y la descripcion a la funcion findByYearNum.
   */
  handleYearNumSearch = () => {
    if (this.validator.fieldValid('numExp') && this.validator.fieldValid('year')) {
      console.log('mensaje en if');
      this.findByYearNum(this.state.year, this.state.num);
    }
  }

  render() {
    return (
      <>
        <iframe title='conToPrint' id="consultasContentsToPrint" style={{display:'none'}}></iframe>
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
                    autoFocus
                  />
                  {this.validator.message('id', this.state.id, 'required|numeric|min:1,num')}
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
                  {this.validator.message('description', this.state.description, 'required|max:50')}
                </div>
                <div className="col text-center">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={this.handleDescriptionSearch}
                  > Buscar
                  </button>
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
                    name="numExp"
                    onChange={e => this.handleNumChange(e)}
                    onBlur={e => this.handleNumChange(e)}
                    value={this.state.num}
                  />
                  {this.validator.message('numExp', this.state.num, 'required|numeric|min:0,num')}
                </div>

              </div>
              <div className="form-group row">
                <label className="col-form-label col-sm-4">Año: </label>
                <div className="col-5 input-group">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    name="year"
                    onChange={e => this.handleYearChange(e)}
                    onBlur={e => this.handleYearChange(e)}
                    value={this.state.year}
                  />
                  {this.validator.message('year', this.state.year, 'required|numeric|min:0,num')}
                </div>
                <div className="col text-center">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={this.handleYearNumSearch}
                  > Buscar
                  </button>
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