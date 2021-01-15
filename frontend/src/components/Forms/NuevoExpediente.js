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
      start_list: [],
      end_list: [],
      showDestino: '',
      tipo_expediente: {},
      start: {},
      end: {},
      next_id: 0,
      description: '',
      high_priority: false
    }
    this.setDescription = this.setDescription.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleSelectTipoExpediente = this.handleSelectTipoExpediente.bind(this);
    this.handleCheckPriority = this.handleCheckPriority.bind(this);
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
          end_list: response.data.results.map((d) => {
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
  //TODO al iniciar por primera vez el server frontend, genera error al no poder acceder al contenido del localstorage porque este esta vacio aun.
  retrieveDependenciasByUser() {
    DependenciasPorUsuarioService.getByUser(helper.getCurrentUserId())
      .then(response => {
        this.setState({
          start_list: response.data.results.map(dxu => {
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
   * Setear el tipo de expediente, la segunda y la ultima dependencia para el tipo de expediente y se oculta el campo
   * destino mientras que el tipo de expediente no sea "Sin ruta predefinida".
   * @param tde tipo expediente ID
   */
  handleSelectTipoExpediente = tde => {
    const sinRutaPredefinida = this.state.tipos_expediente_list[0];
    // si el tipo expediente es distinto a sin ruta predefinida se busca la dependencia siguiente y la ultima (destino)
    tde !== sinRutaPredefinida && this.nextNLastDependencia(tde.id);
    // si el tipo de expediente seleccionado es igual a sinRutaPredefinida se muestra el selector destino
    this.setState({
      showDestino: tde === sinRutaPredefinida ? '' : 'd-none',
      tipo_expediente: tde
    });
    this.checkValid();
  }

  /**
   * Setea el origen del expediente
   * @param origen
   */
  handleSelectOrigen = origen => {
    this.setState({start: origen});
    this.checkValid();
  }

  /**
   * Setea el destino del expediente. Si se setea el destino es porque se selecciono sin ruta predefinida, entonces el
   * destino, next y last dependencia son iguales.
   * @param destino
   */
  handleSelectDestino = destino => {
    this.setState({end: destino});
    this.checkValid();
  }

  /**
   * Setea la siguiente y ultima dependencia de la ruta de acuerdo al tipo de expediente seleccionado.
   * @param tdeId
   */
  nextNLastDependencia = tdeId => {
    if (tdeId > 1) { // mayor a 1 es porque ya tiene una ruta predefinida
      TiposDeExpedientesService.getDetails(tdeId)
        .then(response => {
          this.setState({
            next_id: response.data.results[1].dependencia_id.id,
            end: response.data.results.slice(-1)[0].dependencia_id
          })
        })
        .catch(e => {
          console.log(`Error secondDependencia()\n${e}`);
        });
    }
  }

  /**
   * Marca el expediente como prioridad "alta".
   */
  handleCheckPriority = () => {
    this.setState({high_priority: !this.state.high_priority});
    this.checkValid();
  }

  /**
   * Retorna la llamada create del servicio Expediente.
   * @returns {Promise<AxiosResponse<*>>}
   */
  saveExpediente = () => {
    const newExpediente = {
      anho: moment().year(),
      descripcion: this.state.description,
      tipo_de_expediente_id: this.state.tipo_expediente.id,
      dependencia_origen_id: this.state.start.id,
      dependencia_destino_id: this.state.end.id,
      prioridad_id: this.state.high_priority ? 2 : 1
    }
    return ExpedientesService.create(newExpediente);
  }

  /**
   * Guarda la instancia inicial para el nuevo expediente.
   * @param expId
   */
  //TODO controlar que si no existe el token no se puede guardar el expediente
  saveInstancia = expId => {
    const user_in_id = helper.existToken() ? helper.getCurrentUserId() : null;
    // si next_id es igual a 0 (cero) es porque se selecciono Sin Ruta Predefinida y la siguiente instancia se setea al
    // procesar el expediente.
    // Se asume que el expediente se crea en la dependencia correspondiente y por eso se asigna el 'orden_actual = 1',
    // eso significa que ese tipo de expediente pertenece al usuario que esta creando
    const instancia = {
      expediente_id: expId,
      dependencia_actual_id: this.state.start.id,
      dependencia_siguiente_id: this.state.next_id !== 0 ? this.state.next_id : this.state.end.id,
      usuario_id_entrada: user_in_id,
      orden_actual: 1
    }
    // guardar la primera instancia del expediente
    InstanciasService.create(instancia)
      .then(() => {
        Popups.success('Expediente creado correctamente.');
      })
      .catch(e => {
        console.log(`Error saveInstancia en nuevo expediente\n${e}`);
        // si ocurre un error al guardar la instancia se borra el expediente creado
        ExpedientesService.delete(expId)
          .then(() => {
            Popups.error('Ocurrio un error al crear el nuevo expediente.');
          })
          .catch(e => {
            console.log(`Error eliminar expediente al hacer rollback\n${e}`);
          });
      });
  }

  /**
   * Guarda el nuevo expediente con su respectiva instancia
   */
  save = () => {
    this.saveExpediente()
      .then(response => {
        this.saveInstancia(response.data.id);
      })
      .catch(e => {
        Popups.error('Ocurrio un error al crear el nuevo expediente.');
        console.log(`Error save() en nuevo expediente\n${e}`);
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
      start: {},
      end: {},
      tipo_expediente: {},
      next_id: 0,
      description: '',
      high_priority: false,
      showDestino: ''
    });
    this.validator.hideMessages();
    this.props.setShow(false);
  }

  /**
   * Si todas las validaciones estan correctas, guarda, si no muestran los mensajes de errores.
   */
  //TODO checkValid deja pasar si hay errores
  handleSaveClick = () => {
    this.checkValid();
    this.save();
    this.props.setShow(false);
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
                    options={this.state.start_list}
                    placeholder="Selecciona..."
                    name="select"
                    onChange={value => this.handleSelectOrigen(value)}
                  />
                  {this.validator.message('select', this.state.start_list, 'required')}
                </div>
              </Form.Row>
              <Form.Row>
                <div className="form-group col">
                  <div className={this.state.showDestino}>
                    <label>Destino</label>
                    <Select
                      options={this.state.end_list}
                      placeholder="Selecciona..."
                      name="select"
                      onChange={value => this.handleSelectDestino(value)}
                    />
                    {this.validator.message('select', this.state.end_list, 'required')}
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
              <Form.Row>
                <Form.Check
                  type="checkbox"
                  label="Marcar como prioridad alta."
                  value={this.state.high_priority}
                  onChange={e => {this.handleCheckPriority(e)}}
                />
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