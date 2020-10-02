import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import SimpleReactValidator from "simple-react-validator";
import TiposDeExpedientesService from "../../services/TiposDeExpedientes";
import Select from "react-select";
import DependenciasService from "../../services/Dependencias";
import DependenciasPorUsuarioService from "../../services/DependenciasPorUsuario";
import moment from "moment";
import Popups from "../Popups";
import helper from "../../utils/helper";

class NuevoExpediente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      tipos_de_expediente: [],
      origen: [],
      destino: [],
      showDestino: '',
      sizeSelect: ''
    }
    this.setDescription = this.setDescription.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleSelectTipoExpediente = this.handleSelectTipoExpediente.bind(this);
    this.handleClose = this.handleClose.bind(this);
    //opciones y mensajes para la validacion
    this.validator = new SimpleReactValidator({
      className: 'text-danger',
      messages: {
        alpha_num_dash_space: 'Caracter no permitido.',
        max: 'Máximo 50 caracteres.',
        required: 'Este campo no puede estar vacío.'
      }
    });
  }

  /**
   * Obtener las dependencias de la base de datos y cargarlos como opciones para el select
   */
  retrieveAllDependencias() {
    DependenciasService.getAll()
      .then((response) => {
        this.setState({
          destino: response.data.results.map((d) => {
            return {
              id: d.id,
              value: d.descripcion,
              label: d.descripcion,
            }
          })
        })
      })
      .catch((e) => {
        console.log(`Error DependenciasService.\n${e}`);
      });
  }

  /**
   * Obtener los tipos de expedientes de la base de datos y cargarlos como opciones para el select
   */
  retrieveTiposDeExpedientes() {
    TiposDeExpedientesService.getAll()
      .then(response => {
        this.setState({
          tipos_de_expediente: response.data.results.map(tde => {
            return {
              id: tde.id,
              value: tde.descripcion,
              label: tde.descripcion
            }
          })
        });
      })
      .catch(e => {
        console.log(`Error TiposDeExpedientesService.\n${e}`);
      });
  }

  /**
   * Obtener las posibles dependencias de origen de acuerdo al usuario activo.
   */
  retrieveDependenciasByUser() {
    DependenciasPorUsuarioService.getByUser(helper.getCurrentUserId())
      .then(response => {
        this.setState({
          origen: response.data.results.map(dxu => {
            return {
              id: dxu.dependencia_id.id,
              value: dxu.dependencia_id.descripcion,
              label: dxu.dependencia_id.descripcion
            }
          })
        })
      })
      .catch(e => {
        console.log(`Error DependenciasPorUsuarioService.\n${e}`);
      });
  }

  componentDidMount() {
    this.retrieveTiposDeExpedientes();
    this.retrieveAllDependencias();
    this.retrieveDependenciasByUser();
  }

  /**
   * Setea el estado para descripcion.
   * @param e Evento del input
   */
  setDescription = e => {
    this.setState({
      description: e.target.value
    });
    this.checkValid();
  }

  handleSelectTipoExpediente = tde => {
    const sinRutaPredefinida = this.state.tipos_de_expediente[0];
    /*Si el tipo de expediente seleccionado es igual a sinRutaPredefinida se muestra el selector destino*/
    this.setState({
      showDestino: tde === sinRutaPredefinida ? '' : 'd-none'
    })
    TiposDeExpedientesService.getDetails(tde.id)
      .then((response) => {
        this.setState({
          origen: response.data.results.map((d) => {
            return {
              id: d.dependencia_id.id,
              value: d.dependencia_id.descripcion,
              label: d.dependencia_id.descripcion
            }
          })
        })
      })
      .catch((e) => {
        console.log(e);
      });
  }

  /**
   * Guarda el nuevo expediente
   */
  save = () => {

  }

  /**
   * Si hay errores en los inputs, muestra los mensajes de error
   */
  checkValid = () => {
    if (!this.validator.allValid()) this.validator.showMessages();
  }

  /**
   * Limpiar los campos cuando se cierra el modal.
   */
  handleClose = () => {
    this.setState({
      description: '',
      showDestino: ''
    });
    this.validator.hideMessages();
    this.props.setShow(false);
  }

  /**
   * Si todas las validaciones son validas, entonces guarda, si no muestran los mensajes de errores
   */
  handleSaveClick = () => {
    this.checkValid() & this.save() && this.props.setShow(false);
  }

  render() {
    moment.locale('es');
    const date = moment()
      .format('LL');

    return (
      <Modal
        show={this.props.showModal}
        onHide={this.handleClose}
        backdrop="static"
        size=""
        centered
      >
        <Modal.Header>
          <Modal.Title>Nuevo Expediente</Modal.Title>
          <label className="font-weight-bold">{date}</label>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <div className="row">
                <div className="form-group col">
                  <label>Tipo de Expediente</label>
                  <Select
                    defaultValue={this.state.tipos_de_expediente[0]}
                    options={this.state.tipos_de_expediente}
                    name="select"
                    onChange={(value) => this.handleSelectTipoExpediente(value)}
                  />
                  {this.validator.message('select', this.state.tipos_de_expediente, 'required')}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col">
                  <label>Origen</label>
                  <Select
                    options={this.state.origen}
                    placeholder="Selecciona..."
                    name="select"
                  />
                </div>

              </div>
              <div className="form-row">
                <div className="form-group col">
                  <div className={this.state.showDestino}>
                    <label>Destino</label>
                    <Select
                      options={this.state.destino}
                      placeholder="Selecciona..."
                      name="select"
                    />
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col">
                  <label>Descripcion *</label>
                  <textarea
                    className="form-control"
                    name="description"
                    placeholder="Agrega una descripcion"
                    value={this.state.description}
                    onChange={e => this.setDescription(e)}
                    onBlur={e => this.setDescription(e)}
                  />
                  {this.validator.message('description', this.state.description, 'required|alpha_num_dash_space|max:200')}
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={this.handleClose}>
            Cerrar
          </button>
          <button
            onClick={this.handleSaveClick}
            type="button"
            className="btn btn-sm btn-primary"
          >
            Guardar
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default NuevoExpediente;