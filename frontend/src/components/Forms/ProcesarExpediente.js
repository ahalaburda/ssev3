import React, {Component} from "react";
import {Modal, Form} from "react-bootstrap";
import "../../styles/form.css";
import Select from "react-select";
import helper from "../../utils/helper";
import Popups from "../Popups";
import ExpedienteService from "../../services/Expedientes";
import InstanciasService from "../../services/Instancias";
import moment from "moment";


class ProcesarExpediente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      instancia: helper.getExpedienteInitialState(),
      depPrev: {},
      depNow: {},
      depNext: {},
      new_estado: {
        id: 0,
        value: '',
        label: ''
      },
      comment: ''
    }
    this.handleClose = this.handleClose.bind(this);
    this.handleEstadoChange = this.handleEstadoChange.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleProcess = this.handleProcess.bind(this);
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      expediente: nextProps.expedienteData.expediente_id,
      depPrev: nextProps.expedienteData.dependencia_anterior_id,
      depNow: nextProps.expedienteData.dependencia_actual_id,
      depNext: nextProps.expedienteData.dependencia_siguiente_id
    }
  }

  /**
   * Setea el props para que se cierre el modal y el 'state' vuelva a su estado inicial.
   */
  handleClose = () => {
    this.setState({
      expediente: helper.getExpedienteInitialState(),
      new_estado: {
        id: 0,
        value: '',
        label: ''
      },
      comment: ''
    });
    this.props.setShow(false);
  }

  handleEstadoChange = value => {
    this.setState({
      new_estado: value
    });
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
   * Guarda la nueva intancia
   * @param userIdIn Usuario id
   * @returns {Promise<AxiosResponse<*>>}
   */
  saveNewInstancia = userIdIn => {
    return InstanciasService.create({
      expediente_id: this.state.instancia.expediente_id.id,
      dependencia_anterior_id: this.state.depPrev.id,
      dependencia_actual_id: this.state.depNow.id,
      dependencia_siguiente_id: this.state.depNext.id,
      usuario_id_entrada: userIdIn
    });
  }

  /**
   * Setea el nuevo estado y proporciona un numero de mesa de entrada al expediente procesado
   * @param nroMesaEntrada Numero de mesa de entrada generada
   * @returns {Promise<AxiosResponse<*>>}
   */
  setExpedienteMesaEntrada = nroMesaEntrada => {
    return ExpedienteService.update(this.state.instancia.expediente_id.id,
      {
        numero_mesa_de_entraa: nroMesaEntrada,
        estado_id: this.state.new_estado.id,
        fecha_mesa_entrada: moment().toJSON()
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
   * Procesa los expedientes con estado RECIBIDO, ANULADO Y PAUSADO
   */
  processExpediente = () => {
    const userIdIn = helper.existToken() ? helper.getCurrentUserId() : null;
    if (this.state.depNow.descripcion === 'Mesa Entrada') {
      Promise.all([
        this.setExpedienteMesaEntrada(this.getNewMesaEntrada()),
        this.setInstanciaUserOut(userIdIn),
        this.saveNewInstancia(userIdIn)
      ])
        .then(() => {

        })
        .catch(e => {
          console.log(e);
        })
    }
  }

  processRechazado = () => {

  }

  processDerivado = () => {

  }

  processFinalizado = () => {

  }

  handleProcess = () => {
    //TODO check valid
    switch (this.state.new_estado.value) {
      case helper.getEstado().RECIBIDO || helper.getEstado().ANULADO || helper.getEstado().PAUSADO:
        this.processExpediente();
        break;
      case helper.getEstado().RECHAZADO:
        this.processRechazado();
        break;
      case helper.getEstado().DERIVADO:
        this.processDerivado();
        break;
      case helper.getEstado().FINALIZADO:
        this.processFinalizado();
        break;
      default:
        this.processExpediente();
    }
    //cierra modal
    this.props.setShow(false);
  }

  render() {
    let numeroMesaComp, tipoExpediente, descripcion, depAnt, depAct, depSig;
    //TODO determinar como asignar nuevo numero de mesa de entrada
    if (this.state.instancia) {
      // si no tiene mesa de entrada se habilita el campo para cargar el numero (posible autogenerado)
      if (this.state.instancia.expediente_id.numero_mesa_de_entrada !== null) {
        numeroMesaComp = <input
          className="form-control"
          value={this.state.instancia.expediente_id.numero_mesa_de_entrada}
          disabled/>
      } else {
        numeroMesaComp = <input className="form-control" value=""/>
      }
      tipoExpediente = this.state.instancia.expediente_id.tipo_de_expediente_id.descripcion;
      descripcion = this.state.instancia.expediente_id.descripcion;
      depAnt = this.state.depPrev.descripcion;
      depAct = this.state.depNow.descripcion;
      // si elige el estado rechazado y su dependencia anterior es origen, su dependencia siguiente no se modifica
      if (this.state.new_estado.value === helper.getEstado().RECHAZADO && this.state.depPrev.descripcion === 'Origen') {
        depSig = this.state.depNext.descripcion;
        // si se elige rechazado y su dep anterior ya no es origen, su dependencia siguiente es el anterior
      } else if (this.state.new_estado.value === helper.getEstado().RECHAZADO) {
        depSig = this.state.depPrev.descripcion;
      } else {
        depSig = this.state.depNext.descripcion;
      }
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
                      {numeroMesaComp}
                    </div>
                  </Form.Row>
                  <Form.Row>
                    <div className="form-group col">
                      <Form.Label>Tipo de Expediente</Form.Label>
                      <input
                        className="form-control"
                        value={tipoExpediente}
                        disabled/>
                    </div>
                  </Form.Row>
                </div>
                <div className="form-group col">
                  <Form.Row>
                    <Form.Label>Descripci&oacute;n</Form.Label>
                    <Form.Control as="textarea" rows="5"
                                  name="description"
                                  value={descripcion}
                                  disabled/>
                  </Form.Row>
                </div>
              </Form.Row>
              <Form.Row>
                <div className="form-group col">
                  <Form.Label>Dependencia Anterior</Form.Label>
                  <input
                    className="form-control"
                    value={depAnt}
                    disabled/>
                </div>
                <div className="form-group col">
                  <Form.Label>Dependencia Actual</Form.Label>
                  <input
                    className="form-control"
                    value={depAct}
                    disabled/>
                </div>
              </Form.Row>
              <Form.Row>
                <div className="form-group col">
                  <Form.Label>Estado</Form.Label>
                  <Select
                    options={helper.getAllEstados()}
                    placeholder="Selecciona..."
                    size="sm"
                    onChange={value => this.handleEstadoChange(value)}
                    name="select"/>
                </div>
                <div className="form-group col">
                  <Form.Label>Dependencia Siguiente</Form.Label>
                  <input
                    className="form-control"
                    value={depSig}
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