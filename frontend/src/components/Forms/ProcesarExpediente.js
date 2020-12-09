import React, {Component} from "react";
import {Form, Modal} from "react-bootstrap";
import "../../styles/form.css";
import Select from "react-select";
import helper from "../../utils/helper";
import Popups from "../Popups";
import ExpedienteService from "../../services/Expedientes";
import InstanciasService from "../../services/Instancias";
import ComentariosService from "../../services/Comentarios";
import TipoDeExpedienteService from "../../services/TiposDeExpedientes";
import moment from "moment";

const initialState = {
  instancia: {},
  depPrev: {},
  depNow: {},
  depNext: {},
  expedienteType: {},
  newEstado: {
    id: 0,
    value: '',
    label: ''
  },
  newNumMesa: '',
  comment: ''
}

class ProcesarExpediente extends Component {
  constructor(props) {
    super(props);
    this.state = initialState
    this.handleClose = this.handleClose.bind(this);
    this.handleEstadoChange = this.handleEstadoChange.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleProcess = this.handleProcess.bind(this);
  }

  //reemplazo de funcion componentWillReceiveProps
  static getDerivedStateFromProps(nextProps) {
    return {
      instancia: nextProps.expedienteData,
      depPrev: nextProps.expedienteData.dependencia_anterior_id,
      depNow: nextProps.expedienteData.dependencia_actual_id,
      depNext: nextProps.expedienteData.dependencia_siguiente_id,
      expedienteType: nextProps.expedienteData.expediente_id.tipo_de_expediente_id
    }
  }

  /**
   * Setea el props para que se cierre el modal y el 'state' vuelva a su estado inicial.
   */
  handleClose = () => {
    this.setState(initialState);
    this.props.setShow(false);
  }

  handleEstadoChange = value => {
    this.setState({
      newEstado: value
    });
  }

  handleNumMesaChange = e => {
    this.setState({newNumMesa: e.target.value})
  }

  handleCommentChange = e => {
    this.setState({comment: e.target.value});
  }

  /**
   * Modificar la instancia anterior para actualizar el usuario_id_salida, que en este caso es el usuario actualmente
   * logeado.
   * @param userIdOut Usuario id salida
   * @returns {Promise<AxiosResponse<*>>}
   */
  setInstanciaUserOut = userIdOut => {
    return InstanciasService.update(this.state.instancia.id, {
      fecha_recepcion: moment().toJSON(),
      usuario_id_salida: userIdOut
    });
  }

  /**
   * Guarda la nueva intancia para los estados Recibido y Pausado
   * @param userIdIn Usuario id
   * @returns {Promise<AxiosResponse<*>>}
   */
  saveInstanciaRecibidoPausado = userIdIn => {
    return InstanciasService.create({
      expediente_id: this.state.instancia.expediente_id.id,
      dependencia_anterior_id: this.state.depPrev.id,
      dependencia_actual_id: this.state.depNow.id,
      dependencia_siguiente_id: this.state.depNext.id,
      estado_id: this.state.newEstado.id,
      usuario_id_entrada: userIdIn,
      orden_actual: this.state.instancia.orden_actual
    });
  }

  /**
   * Genera el nuevo numero de mesa de entrada
   * TODO fijar metodo para generacion de nro
   * @returns {number}
   */
  getNewMesaEntrada = () => {
    return Math.floor((Math.random() * 100) + 1);
  }

  /**
   * Setea el nuevo estado y proporciona un numero de mesa de entrada al expediente si este no lo tiene aun
   * @param withMesaEntrada True generar nuevo numero mesa de entrada, False sin modificar numero.
   * @returns {Promise<AxiosResponse<*>>}
   */
  setExpediente = withMesaEntrada => {
    return withMesaEntrada ?
      ExpedienteService.update(this.state.instancia.expediente_id.id,
        {
          numero_mesa_de_entrada: this.getNewMesaEntrada(),
          estado_id: this.state.newEstado.id,
          fecha_mesa_entrada: moment().toJSON()
        }) :
      ExpedienteService.update(this.state.instancia.expediente_id.id,
        {
          estado_id: this.state.newEstado.id
        });
  }

  /**
   * Guarda el comentario, luego limpia el estado y cierra el modal
   * @param instanciaId
   * @param userId
   */
  saveComment = (instanciaId, userId) => {
    ComentariosService.create({
      descripcion: this.state.comment,
      instancia_id: instanciaId,
      usuario_id: userId
    })
      .then(() => {
        this.handleClose(); // limpiar el estado y cerrar el modal
      })
      .catch(e => {
        console.log(`Error saveComment\n${e}`);
      })
  }

  /**
   * Procesa los expedientes con estado RECIBIDO Y PAUSADO
   */
    //TODO rollback en caso de errores
  processExpediente = () => {
    const userIdIn = helper.existToken() ? helper.getCurrentUserId() : null;
    const withMesaEntrada = this.state.depNow.descripcion === 'Mesa Entrada' &&
      this.state.instancia.expediente_id.numero_mesa_de_entrada === 0;
    Promise.all([
      this.setExpediente(withMesaEntrada),
      this.setInstanciaUserOut(userIdIn),
      this.saveInstanciaRecibidoPausado(userIdIn)
    ])
      .then(response => {
        this.saveComment(response[2].data.id, userIdIn);
        Popups.success('Expediente procesado.');
      })
      .catch(e => {
        console.log(`Error processExpediente\n${e}`);
        Popups.error('Ocurrio un error al procesar expediente.');
      })
  }

  /**
   * Dado un tipo de expediente y orden devuelve una promesa de tipo de expediente con el orden solicitado
   * @param tipoExpediente tipo de expediente
   * @param ordenActual orden actual
   * @param prevOrNext false: dependencia anterior, true: dependencia siguiente
   * @returns {Promise<AxiosResponse<*>>}
   */
  getPrevOrNextDependenciaId = (tipoExpediente, ordenActual, prevOrNext) => {
    // se le suma 2 o resta dos porque se solicita la dependencia del siguiente del siguiente o el anterior del anterior
    let orden = prevOrNext ? ordenActual + 2 : ordenActual - 2;
    // si prevOrNext = true y se supero el maximo de saltos en la ruta se le resta 1 para no pedir con ID excedente
    if (prevOrNext && orden > tipoExpediente.saltos) {
      orden--;
      // si prevOrNext = false y se esta al comienzo de la ruta se le resta 1 para no pedir con ID negativo
    } else if (!prevOrNext && orden < 1) {
      orden++
    }
    return TipoDeExpedienteService.getDetailByOrder(tipoExpediente.id, orden)
  }

  /**
   * Retorna una promesa de creacion de una instancia
   * @param userIdIn usuario_entrada
   * @param tdePrevDep datos de tipo de expediente y dependencia anterior
   * @returns {*}
   */
  saveInstanciaRechazado = (userIdIn, tdePrevDep) => {
    return InstanciasService.create({
      expediente_id: this.state.instancia.expediente_id.id,
      dependencia_anterior_id: tdePrevDep.dependencia_id.id,
      dependencia_actual_id: this.state.depPrev.id,
      dependencia_siguiente_id: this.state.depNow.id,
      estado_id: this.state.newEstado.id,
      usuario_id_entrada: userIdIn,
      orden_actual: this.state.instancia.orden_actual - 1
    });
  }

  /**
   * Rechazar el expediente modificando el estado del expediente, agregando usuario_salida a la instancia actual,
   * obteniendo la dependencia anterior al anterior. Luego guarda los datos de la nueva instancia y su respectivo
   * comentario.
   */
  processRechazado = () => {
    const userIdIn = helper.existToken() ? helper.getCurrentUserId() : null;
    // setear el expediente, el usuarioSalida y obtener la dependencia anterior->anterior
    Promise.all([
      this.setExpediente(false),
      this.setInstanciaUserOut(userIdIn),
      this.getPrevOrNextDependenciaId(this.state.expedienteType, this.state.instancia.orden_actual, false)
    ])
      .then(response => {
        // una vez terminados se guarda la nueva instancia
        this.saveInstanciaRechazado(userIdIn, response[2].data.results.pop())
          .then(resp => {
            // si la instancia se guarda, entonces el comentario tambien
            this.saveComment(resp.data.id, userIdIn);
          })
          .catch(err => {
            console.log(`Error saveInstanciaRechazado\n${err}`);
            Popups.error('Ocurrio un error al procesar expediente.');
          });
        Popups.success('Expediente procesado.');
      })
      .catch(e => {
        console.log(`Error processRechazado\n${e}`);
        Popups.error('Ocurrio un error al procesar expediente.');
      });
  }

  /**
   * Retorna una poromesa de creacion de una instancia
   * @param userIdIn usuario_entrada
   * @param tdeNextDep datos de tipo de expediente y dependencia siguiente
   * @returns {*}
   */
  saveInstanciaDerivado = (userIdIn, tdeNextDep) => {
    return InstanciasService.create({
      expediente_id: this.state.instancia.expediente_id.id,
      dependencia_anterior_id: this.state.depNow.id,
      dependencia_actual_id: this.state.depNext.id,
      dependencia_siguiente_id: tdeNextDep.dependencia_id.id,
      estado_id: this.state.newEstado.id,
      usuario_id_entrada: userIdIn,
      orden_actual: this.state.instancia.orden_actual + 1
    });
  }

  processDerivado = () => {
    const userIdIn = helper.existToken() ? helper.getCurrentUserId() : null;
    Promise.all([
      this.setExpediente(false),
      this.setInstanciaUserOut(userIdIn),
      this.getPrevOrNextDependenciaId(this.state.expedienteType, this.state.instancia.orden_actual, true)
    ])
      .then(response => {
        this.saveInstanciaDerivado(userIdIn, response[2].data.results.pop())
          .then(resp => {
            this.saveComment(resp.data.id, userIdIn);
          })
          .catch(err => {
            console.log(`Error saveInstanciaDerivado\n${err}`);
            Popups.error('Ocurrio un error al procesar expediente.');
          });
        Popups.success('Expediente procesado.');
      })
      .catch(e => {
        console.log(`Error processDerivado\n${e}`);
        Popups.error('Ocurrio un error al procesar expediente.');
      })
  }

  /**
   * Guarda una nueva instancia para el estado Finalizado y Anulado
   * @param userIdIn Usuario de entrada y salida (el mismo porque se finaliza el expediente)
   * @returns {Promise<AxiosResponse<*>>}
   */
  saveInstanciaFinalizadoAnulado = userIdIn => {
    return InstanciasService.create({
      expediente_id: this.state.instancia.expediente_id.id,
      dependencia_anterior_id: this.state.depPrev.id,
      dependencia_actual_id: this.state.depNow.id,
      dependencia_siguiente_id: this.state.depNow.id,
      estado_id: this.state.newEstado.id,
      usuario_id_entrada: userIdIn,
      usuario_id_salida: userIdIn,
      fecha_final: moment().toJSON(),
      orden_actual: this.state.instancia.orden_actual
    });
  }

  processFinalizadoAnulado = () => {
    const userIdIn = helper.existToken() ? helper.getCurrentUserId() : null;
    Promise.all([
      this.setExpediente(false),
      this.setInstanciaUserOut(userIdIn),
      this.saveInstanciaFinalizadoAnulado(userIdIn)
    ])
      .then(response => {
        this.saveComment(response[2].data.id, userIdIn);
        Popups.success('Expediente procesado.');
      })
      .catch(e => {
        console.log(`Error processFinalizado\n${e}`);
        Popups.error('Ocurrio un error al procesar expediente.');
      });
  }

  handleProcess = () => {
    //TODO check valid
    switch (this.state.newEstado.value) {
      case helper.getEstado().RECIBIDO:
        this.processExpediente();
        break;
      case helper.getEstado().PAUSADO:
        this.processExpediente();
        break;
      case helper.getEstado().RECHAZADO:
        this.processRechazado();
        break;
      case helper.getEstado().DERIVADO:
        this.processDerivado();
        break;
      case helper.getEstado().ANULADO:
        this.processFinalizadoAnulado();
        break;
      case helper.getEstado().FINALIZADO:
        this.processFinalizadoAnulado();
        break;
      default:
        console.log('Error case: default');
        break;
    }
  }

  render() {
    //TODO controlar que numero de mesa de entrada solo se pueda asignar en la dependencia Mesa de Entrada
    let numMesaComp;
    if (this.state.instancia) {
      if (this.state.instancia.expediente_id.numero_mesa_de_entrada !== 0) {
        numMesaComp = <input
          className="form-control"
          value={this.state.instancia.expediente_id.numero_mesa_de_entrada}
          onChange={e => this.handleNumMesaChange(e)}
          disabled/>
      } else {
        numMesaComp = <input
          className="form-control"
          placeholder="Ingresa n&uacute;mero de mesa."
          value={this.state.newNumMesa}
          onChange={e => this.handleNumMesaChange(e)}/>
      }
    }

    let selectOptions;
    if (this.state.instancia.orden_actual === this.state.expedienteType.saltos) {
      // si la instancia esta en el ultimo salto, ya no se puede derivar
      selectOptions = helper.getAllEstados().filter(o => o.value !== helper.getEstado().DERIVADO);
    } else if (this.state.instancia.orden_actual <= 1) {
      // si la instancia esta en el primer salto, no se puede rechazar
      selectOptions = helper.getAllEstados().filter(o => o.value !== helper.getEstado().RECHAZADO);
    } else {
      // de otra forma se permiten todos los posibles estados
      selectOptions = helper.getAllEstados();
    }

    // si ya se recibio se remueve esa opcion
    if (this.state.instancia.expediente_id.estado_id.descripcion === helper.getEstado().RECIBIDO) {
      selectOptions = selectOptions.filter(o => o.value !== helper.getEstado().RECIBIDO);
    }

    let nextDependencia;
    if (this.state.newEstado.value === helper.getEstado().RECHAZADO) {
      // si se selecciona rechazar expediente, se muestra la dependencia anterior como la dependencia siguiente
      nextDependencia = this.state.depPrev.descripcion;
    } else {
      nextDependencia = this.state.depNext.descripcion;
    }

    return (
      <Modal
        show={this.props.showModal}
        backdrop="static"
        centered>
        <Modal.Header>
          <Modal.Title>Procesar Expediente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Row>
                <div className="form-group col">
                  <Form.Row>
                    <div className="form-group col">
                      <Form.Label>Numero de Expediente</Form.Label>
                      {numMesaComp}
                    </div>
                  </Form.Row>
                  <Form.Row>
                    <div className="form-group col">
                      <Form.Label>Tipo de Expediente</Form.Label>
                      <input
                        className="form-control"
                        value={this.state.instancia.expediente_id.tipo_de_expediente_id.descripcion}
                        disabled/>
                    </div>
                  </Form.Row>
                </div>
                <div className="form-group col">
                  <Form.Row>
                    <Form.Label>Descripci&oacute;n</Form.Label>
                    <Form.Control as="textarea" rows="5"
                                  name="description"
                                  value={this.state.instancia.expediente_id.descripcion}
                                  disabled/>
                  </Form.Row>
                </div>
              </Form.Row>
              <Form.Row>
                <div className="form-group col">
                  <Form.Label>Dependencia Anterior</Form.Label>
                  <input
                    className="form-control"
                    value={this.state.depPrev.descripcion}
                    disabled/>
                </div>
                <div className="form-group col">
                  <Form.Label>Dependencia Actual</Form.Label>
                  <input
                    className="form-control"
                    value={this.state.depNow.descripcion}
                    disabled/>
                </div>
              </Form.Row>
              <Form.Row>
                <div className="form-group col">
                  <Form.Label>Estado</Form.Label>
                  <Select
                    options={selectOptions}
                    placeholder="Selecciona..."
                    size="sm"
                    onChange={value => this.handleEstadoChange(value)}
                    name="select"/>
                </div>
                <div className="form-group col">
                  <Form.Label>Dependencia Siguiente</Form.Label>
                  <input
                    className="form-control"
                    value={nextDependencia}
                    disabled/>
                </div>
              </Form.Row>
              <Form.Row>
                <div className="from-group col">
                  <Form.Label>Comentario</Form.Label>
                  <Form.Control as="textarea"
                                name="comment"
                                placeholder="Agrega un comentario"
                                value={this.state.comment}
                                onChange={value => this.handleCommentChange(value)}
                  />
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
            type="button"
            className="btn btn-sm btn-primary"
            onClick={this.handleProcess}
          >Guardar
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ProcesarExpediente;