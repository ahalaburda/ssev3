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
  comment: '',
  sig_dependencias: '',
  dependenciaSigSelected:'',
  dependenciaInicial:{},
  lastInstanciaME: {},
  fechaApi: {}
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
      expedienteType: nextProps.expedienteData.expediente_id.tipo_de_expediente_id,
      sig_dependencias: nextProps.sig_dependencias
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
      usuario_id_salida: userIdOut
    });
  }

  /**
   * Guarda la nueva intancia para los estados Recibido, Pausado y Reanudado
   * @param userIdIn Usuario id
   * @returns {Promise<AxiosResponse<*>>}
   */
  saveInstanciaRecibidoPausadoReanudado = userIdIn => {
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
   * tomando como referencia y sumandole 1 al numero de mesa de entrada anterior
   * @returns {number}
   */
  getNewMesaEntrada = (numAnterior) => {
    return numAnterior + 1;
  }

  /**
   * Trae del API el expediente que se esta procesando para obtener fecha y hora actualizada
   * desde el servidor y poder asignarselo a la fecha_mesa_entrada
   */
  getFechaServidor = () =>{
    return InstanciasService.getByExpedienteId(this.state.instancia.expediente_id.id)
  }

  /**
   * Retorna el expediente con numero de ME mas alto que existe, para setear el prox numero de ME
   * @returns 
   */
  getNumeroMesaEntrada = () =>{
   return InstanciasService.getInstanciasPorDepEstAnho()
  }

  /**
   * Setea el nuevo estado y proporciona un numero de mesa de entrada al expediente si este no lo tiene aun
   * @param withMesaEntrada True generar nuevo numero mesa de entrada, False sin modificar numero.
   * @returns {Promise<AxiosResponse<*>>}
   */
  async setExpediente(withMesaEntrada) {
   
    if (withMesaEntrada) {
      await Promise.all([
        this.getFechaServidor(),
        this.getNumeroMesaEntrada()
      ])
      .then(response =>{
        let fechaME = response[0].data.results[0].fecha_recepcion;
        let new_numero_mesa_entrada = response[1].data.length === 1 ? this.getNewMesaEntrada(response[1].data[0].expediente_id.numero_mesa_de_entrada): 1;
        return ExpedienteService.update(this.state.instancia.expediente_id.id, {
          fecha_mesa_entrada: fechaME,
          numero_mesa_de_entrada: new_numero_mesa_entrada,
          estado_id: this.state.newEstado.id
        })
      })
      .catch(e => {
        console.log(`setExpediente\n${e}`);
      })
    } else {
        return ExpedienteService.update(this.state.instancia.expediente_id.id,
        {
          estado_id: this.state.newEstado.id
        });
    }
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
   * Procesa los expedientes con estado Recibido, Pausado y Reanudado
   */
  processExpediente = () => {
    const userIdIn = helper.existToken() ? helper.getCurrentUserId() : null;
    const withMesaEntrada = this.state.depNow.descripcion === 'Mesa Entrada' &&
      this.state.instancia.expediente_id.numero_mesa_de_entrada === 0;
    Promise.all([
      this.setInstanciaUserOut(userIdIn),
      this.setExpediente(withMesaEntrada),
      this.saveInstanciaRecibidoPausadoReanudado(userIdIn)
    ])
      .then(response => {
        this.saveComment(response[2].data.id, userIdIn);
        Popups.success('Expediente procesado.');          
        setTimeout(() => {
          window.location.reload();
        }, 500);
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
   * Obtiene  la instancia mas reciente con el orden anterior al actual de un expediente
   * @param {*} expId 
   * @param {*} ordenActual 
   */
  getPrevDependenciaId(expId, ordenActual){  
    let ordenAnterior = ordenActual - 1 ;
    return InstanciasService.getInstanciasPorExp(expId, ordenAnterior)
  }

  /**
   * Guarda una instancia extra para que al derivar o rechazar le aparezca como expediente no recibido en su
   * dependencia
   * @param savedInstancia Instancia guardada previamente
   */
  saveExtraInstancia = savedInstancia => {
    InstanciasService.create({
      expediente_id: savedInstancia.expediente_id,
      dependencia_anterior_id: savedInstancia.dependencia_anterior_id,
      dependencia_actual_id: savedInstancia.dependencia_actual_id,
      dependencia_siguiente_id: savedInstancia.dependencia_siguiente_id,
      estado_id: 1,
      usuario_id_entrada: savedInstancia.usuario_id_entrada,
      orden_actual: savedInstancia.orden_actual
    })
      .catch(e => {
        console.log(`Error saveExtraInstancia\n${e}`);
      })
  }

  /**
   * Retorna una promesa de creacion de una instancia
   * @param userIdIn usuario_entrada
   * @param tdePrevDep datos de tipo de expediente y dependencia anterior
   * @returns {*}
   */
  saveInstanciaRechazado = (userIdIn, tdePrevDep, instPrev) => {
    //si el orden actual es 2(cuando se rechaza un expediente en orden 2 ya se debe saber la dependencia de orden 0 que es en la que se creo el expediente)
    //o la dependenciaPrevia no esta definida(ocurre cuando el expediente esta en el orden 1, ya que en el recorrido del expediente no se define el orden 0) 
    //toma la depencia previa de instPrev o
    //sino lo toma de tdePrevDep
    let dependenciaOrigen = this.state.instancia.orden_actual === 2 || tdePrevDep === undefined ? instPrev.dependencia_anterior_id : tdePrevDep.dependencia_id;
    //Si se rechaza un expediente con orden 1 toma la dependencia anterior de instPrev, en los demas orden lo hace del state depPrev
    let dependenciaActual = tdePrevDep !== undefined ? this.state.depPrev : instPrev.dependencia_actual_id;
    return InstanciasService.create({
      expediente_id: this.state.instancia.expediente_id.id,
      //si el tipo de expediente es sinRutaPredefenida(id=1) toma la dependencia previa  de instPrev, si es otro tipo de expediente lo toma de dependenciaOrigen
      dependencia_anterior_id: this.state.instancia.expediente_id.tipo_de_expediente_id.id === 1 ? instPrev.dependencia_anterior_id.id :
        dependenciaOrigen.id,
      //si el tipo de expediente es sinRutaPredefenida(id=1) toma la dependencia previa  de instPrev, si es otro tipo de expediente lo toma de dependenciaActual
      dependencia_actual_id:  this.state.instancia.expediente_id.tipo_de_expediente_id.id === 1 ? instPrev.dependencia_actual_id.id :
        dependenciaActual.id,
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
      this.getPrevOrNextDependenciaId(this.state.expedienteType, this.state.instancia.orden_actual, false),
      this.getPrevDependenciaId(this.state.instancia.expediente_id.id,this.state.instancia.orden_actual)
    ])
      .then(response => {
        // una vez terminados se guarda la nueva instancia
        this.saveInstanciaRechazado(userIdIn, response[2].data.results.pop(), response[3].data[0])
          .then(resp => {
            this.saveComment(resp.data.id, userIdIn);
            this.saveExtraInstancia(resp.data);
            Popups.success('Expediente procesado.');
            setTimeout(() => {
              window.location.reload();
            }, 500);
          })
          .catch(err => {
            console.log(`Error saveInstanciaRechazado\n${err}`);
            Popups.error('Ocurrio un error al procesar expediente.');
          });
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
      dependencia_actual_id: this.state.instancia.expediente_id.tipo_de_expediente_id.id === 1 ? this.state.dependenciaSigSelected : 
        this.state.depNext.id,
      dependencia_siguiente_id:this.state.instancia.expediente_id.tipo_de_expediente_id.id === 1 ? this.state.dependenciaSigSelected :
        tdeNextDep.dependencia_id.id,
      estado_id: this.state.newEstado.id,
      usuario_id_entrada: userIdIn,
      orden_actual: this.state.instancia.orden_actual + 1
    });
  }

  /**
   * Derivar el expediente modificando el estado del expediente, agregando usuario_salida a la instancia actual,
   * obteniendo la dependencia siguiente al siguiente. Luego guarda los datos de la nueva instancia y su respectivo
   * comentario.
   */
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
          this.saveExtraInstancia(resp.data);
          Popups.success('Expediente procesado.');
          setTimeout(() => {
            window.location.reload();
          }, 500);
        })
        .catch(err => {
          console.log(`Error saveInstanciaDerivado\n${err}`);
          Popups.error('Ocurrio un error al procesar expediente.');
        });  
        
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
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch(e => {
        console.log(`Error processFinalizado\n${e}`);
        Popups.error('Ocurrio un error al procesar expediente.');
      });
  }

  setDependenciaSiguiente = dependencia_sig => {
    if (dependencia_sig != null) {
      this.setState({dependenciaSigSelected: dependencia_sig.id});  
    }  else {
      this.setState({dependenciaSigSelected: ''})
    }
  }

  /**
   * De acuerdo al estado en el cual se quiere procesar el expediente selecciona su funcion correspondiente
   */
  handleProcess = () => {
 
    if (this.state.instancia.expediente_id.tipo_de_expediente_id.id  === 1 && this.state.dependenciaSigSelected === '' 
    && this.state.newEstado.value === helper.getEstado().DERIVADO) {
      Popups.error('Seleccione una dependecia para procesar el expediente')
    }else{
    switch (this.state.newEstado.value) {
      case helper.getEstado().RECIBIDO:
        this.processExpediente();
        break;
      case helper.getEstado().PAUSADO:
        this.processExpediente();
        break;
      case helper.getEstado().REANUDADO:
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
        Popups.error('Seleccione un estado valido para el Expediente')
        break;      
      }
    }
  }

  render() {
    let numMesaComp;
    if (this.state.instancia) {
      // si el expediente ya tiene mesa de entrada se bloquea el input
      if (this.state.instancia.expediente_id.numero_mesa_de_entrada !== 0) {
        numMesaComp = <input
          className="form-control"
          value={this.state.instancia.expediente_id.numero_mesa_de_entrada}
          onChange={e => this.handleNumMesaChange(e)}
          disabled/>
      } else {
        // si no se permite ingresar el numero (por ahora aunque ingreses el numero se genera de manera aleatoria)
        numMesaComp = <input
          className="form-control"
          placeholder="N&uacute;mero de mesa."
          value={this.state.newNumMesa}
          onChange={e => this.handleNumMesaChange(e)} disabled/>
      }
    }

    let selectOptions;
    if (this.state.instancia.orden_actual === this.state.expedienteType.saltos && this.state.instancia.expediente_id.tipo_de_expediente_id.id !== 1) {
      // si la instancia esta en el ultimo salto, ya no se puede derivar
      selectOptions = helper.getAllEstados().filter(o => o.value !== helper.getEstado().DERIVADO);
    } else if (this.state.depPrev.descripcion === 'Origen' ) {
      // si la instancia esta en el primer salto, no se puede rechazar
      selectOptions = helper.getAllEstados().filter(o => o.value !== helper.getEstado().RECHAZADO);
    } else {
      // de otra forma se permiten todos los posibles estados
      selectOptions = helper.getAllEstados();
    }

    // si ya se recibio se remueve esa opcion y tambien la de reanudado
    if (this.state.instancia.estado_id.descripcion === helper.getEstado().RECIBIDO ||
      this.state.instancia.estado_id.descripcion === helper.getEstado().REANUDADO) {
      selectOptions = selectOptions.filter(o => o.value !== helper.getEstado().RECIBIDO)
        .filter(o => o.value !== helper.getEstado().REANUDADO);
    } else if (this.state.instancia.estado_id.descripcion === helper.getEstado().PAUSADO) {
      // si esta pausado solo se puede reanudar
      selectOptions = selectOptions.filter(o => o.value === helper.getEstado().REANUDADO);
    } else {
      // si no se recibio, no puede realizar ninguna otra opcion
      selectOptions = selectOptions.filter(o => o.value === helper.getEstado().RECIBIDO);
    }
    let nextDependencia;
    // si se selecciona rechazar expediente, se muestra la dependencia anterior como la dependencia siguiente
    this.state.newEstado.value === helper.getEstado().RECHAZADO ? nextDependencia = this.state.depPrev.descripcion :
      nextDependencia = this.state.depNext.descripcion;
   
    let tipoExpediente=this.state.instancia.expediente_id.tipo_de_expediente_id.id 
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
                  {/* <div className="form-group col"> */}
                  {this.state.newEstado.value === 'Derivado' && tipoExpediente === 1 ?
                    <div className="form-group col">
                      <Form.Label>Dependencia Siguiente</Form.Label>   
                          <Select
                          options={this.state.sig_dependencias}
                          value={this.state.sig_dependencias.value}
                          placeholder="Selecciona..."
                          size="sm"
                          onChange={(dependencia_sig) => this.setDependenciaSiguiente(dependencia_sig)}
                          name="selectDestino"/>
                    </div> :
                  (this.state.newEstado.value === 'Rechazado' && tipoExpediente === 1) ?
                    <div className="form-group col">
                      <Form.Label>Dependencia Siguiente</Form.Label> 
                        <input
                        className="form-control"
                        value={nextDependencia}
                        disabled/> 
                    </div>:  
                  (tipoExpediente !== 1) ?
                    <div className="form-group col">
                      <Form.Label>Dependencia Siguiente</Form.Label> 
                        <input
                        className="form-control"
                        value={nextDependencia}
                        disabled/> 
                    </div>:
                    <div/>}
                  {/* </div> */}
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