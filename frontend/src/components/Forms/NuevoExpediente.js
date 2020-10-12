import React, {Component} from "react";
import {Modal, Form} from "react-bootstrap";
import SimpleReactValidator from "simple-react-validator";
import TiposDeExpedientesService from "../../services/TiposDeExpedientes";
import Select from "react-select";
import DependenciasService from "../../services/Dependencias";
import DependenciasPorUsuarioService from "../../services/DependenciasPorUsuario";
import ExpedientesService from "../../services/Expedientes";
import InstanciasService from "../../services/Instancias";
import moment from "moment";
import Popups from "../Popups";
import helper from "../../utils/helper";

class NuevoExpediente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tipos_expediente_list: [],
      origen_list: [],
      destino_list: [],
      showDestino: '',
      tipo_expediente: {},
      origen: {},
      destino: {},
      description: ''
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
          destino_list: response.data.results.map((d) => {
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
          tipos_expediente_list: response.data.results.map(tde => {
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
    //TODO al iniciar por primera vez el server frontend, genera error al no poder acceder al contenido del localstorage porque este esta vacio aun.
    DependenciasPorUsuarioService.getByUser(helper.getCurrentUserId())
      .then(response => {
        this.setState({
          origen_list: response.data.results.map(dxu => {
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

  /**
   * Setear el tipo de expediente y se oculta el campo destino mientras que el tipo de expediente no sea
   * "Sin ruta predefinida"
   * @param tde
   */
  handleSelectTipoExpediente = tde => {
    const sinRutaPredefinida = this.state.tipos_expediente_list[0];
    //Si el tipo de expediente seleccionado es igual a sinRutaPredefinida se muestra el selector destino
    this.setState({
      showDestino: tde === sinRutaPredefinida ? '' : 'd-none',
      tipo_expediente: tde
    });
  }

  /**
   * Setea el origen del expediente
   * @param origen
   */
  handleSelectOrigen = origen => {
    this.setState({origen: origen});
    this.checkValid();
  }

  /**
   * Setea el destino del expediente
   * @param destino
   */
  handleSelectDestino = destino => {
    this.setState({destino: destino});
    this.checkValid();
  }


  /**
   * Retorna la dependencia destino de acuerdo al tipo de expediente seleccionado
   * @param tdeId
   * @returns {number}
   */
  dependenciaDestino = tdeId => {
    if (tdeId === 1) { // si es 1 (Sin Ruta Predefinida) se utiliza el destino seteado por el usuario
      return this.state.destino.id;
    } else if (tdeId > 1) { // si es mayor a  1 se obtiene la ultima dependencia de la ruta
      TiposDeExpedientesService.getLastDependencia(tdeId)
        .then(response => {
          return response.data.results.slice(-1)[0].dependencia_id.id
        })
        .catch(e => {
          console.log(`Error dependenciaDestino()\n${e}`);
          return 0;
        });
    } else {
      return 0;
    }
  }

  /**
   * Retorna la llamada create del servicio Expediente.
   * @returns {Promise<AxiosResponse<*>>}
   */
  saveExpediente = () => {
    //TODO controlar que dependencia destino no se 0 (cero)
    const dependenciaDestino = this.dependenciaDestino(this.state.tipo_expediente.id);
    const newExpediente = {
      anho: moment().year(),
      descripcion: this.state.description,
      tipo_de_expediente_id: this.state.tipo_expediente.id,
      dependencia_origen_id: this.state.origen.id,
      dependencia_destino_id: dependenciaDestino
    }
    return ExpedientesService.create(newExpediente);
  }

  /**
   * Guarda el nuevo expediente con su respectiva instancia
   */
  save = () => {
    let expedienteId = 0;
    this.saveExpediente()
      .then(response => {
        console.log(response);
      })
      .catch(e => {
        console.log(`Error save(expediente) en nuevo expediente\n${e}`);
        return false;
      });
    //TODO controlar que si no existe el token no se puede guardar el expediente
    const usuario_entrada_id = helper.existToken() ? helper.getCurrentUserId() : null;
    const dependencia_siguiente = TiposDeExpedientesService.getSecondDependencia(this.state.tipo_expediente.id);
    const instancia = {
      expediente_id: expedienteId,
      dependencia_actual_id: this.state.origen.id,
      dependencia_siguiente_id: dependencia_siguiente,
      usuario_id_entrada: usuario_entrada_id,
    }
    // guardar la primera instancia del expediente
    InstanciasService.create(instancia)
      .then(() => {
        Popups.success('Expediente creado correctamente.');
        return true;
      })
      .catch(e => {
        console.log(`Error save(Instancia) en nuevo expediente\n${e}`);
        // hacer rollback del expediente ya creado
        return false;
      });
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
   * Si todas las validaciones estan correctas, entonces guarda, si no muestran los mensajes de errores.
   */
  handleSaveClick = () => {
    this.checkValid() & this.save() && this.props.setShow(false);
  }

  render() {
    const date = moment().format('LLL');
    return (
      <Modal
        show={this.props.showModal}
        onHide={this.handleClose}
        backdrop="static"
        centered>
        <Modal.Header>
          <Modal.Title>Nuevo Expediente</Modal.Title>
          <label className="font-weight-bold">{date}</label>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Row>
                <div className="form-group col">
                  <Form.Label>Tipo de Expediente</Form.Label>
                  <Select
                    options={this.state.tipos_expediente_list}
                    placeholder="Selecciona..."
                    name="select"
                    onChange={(value) => this.handleSelectTipoExpediente(value)}
                  />
                  {this.validator.message('select', this.state.tipos_expediente_list, 'required')}
                </div>
              </Form.Row>
              <Form.Row>
                <div className="form-group col">
                  <Form.Label>Origen</Form.Label>
                  <Select
                    options={this.state.origen_list}
                    placeholder="Selecciona..."
                    name="select"
                    onChange={value => this.handleSelectOrigen(value)}
                  />
                  {this.validator.message('select', this.state.origen_list, 'required')}
                </div>
              </Form.Row>
              <Form.Row>
                <div className="form-group col">
                  <div className={this.state.showDestino}>
                    <label>Destino</label>
                    <Select
                      options={this.state.destino_list}
                      placeholder="Selecciona..."
                      name="select"
                      onChange={value => this.handleSelectDestino(value)}
                    />
                    {this.validator.message('select', this.state.destino_list, 'required')}
                  </div>
                </div>
              </Form.Row>
              <Form.Row>
                <div className="form-group col">
                  <Form.Label>Descripcion *</Form.Label>
                  <Form.Control as="textarea" rows="3"
                                name="description"
                                placeholder="Agrega una descripcion"
                                value={this.state.description}
                                onChange={e => this.setDescription(e)}
                                onBlur={e => this.setDescription(e)}
                  />
                  {this.validator.message('description', this.state.description, 'required|alpha_num_dash_space|max:200')}
                </div>
              </Form.Row>
            </Form.Group>
          </Form>
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
            className="btn btn-sm btn-primary">
            Guardar
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default NuevoExpediente;