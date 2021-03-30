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
      high_priority: false,
      lastInstanciaME: {}
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

  componentWillUnmount() {
    clearInterval(this.interval);
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
      return;
    };
  }

  /**
   * Obtener las dependencias de la base de datos y cargarlos como opciones para el select
   */
  retrieveAllDependencias() {
    DependenciasService.getAllSinPag()
      .then((response) => {
        this.setState({
          end_list: response.data.map((d) => {
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
    TiposDeExpedientesService.getAllSinPag()
      .then(response => {
        this.setState({
          tipos_expediente_list: response.data.map(tde => {
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
    if (helper.getCurrentUserId() !== undefined) {
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
   * Setear el tipo de expediente.
   * @param tde tipo expediente ID
   */
  handleSelectTipoExpediente = tde => {
    this.setState({
      tipo_expediente: tde
    });
    this.nextNLastDependencia(tde.id);
    this.checkValid();
  }

  /**
   * Setea el origen del expediente, tambien 
   * @param origen
   */
  handleSelectOrigen = origen => {
    this.setState({start: origen});
    this.nextNLastDependencia(this.state.tipo_expediente.id);
    this.checkValid();
  }

  

  /**
   * Setea la siguiente, la primera y ultima dependencia de la ruta de acuerdo al tipo de expediente seleccionado.
   * @param tdeId
   */
  nextNLastDependencia = tdeId => {
    if (tdeId > 1) { // mayor a 1 es porque ya tiene una ruta predefinida
      TiposDeExpedientesService.getDetails(tdeId)
        .then(response => {
          this.setState({
            first_dependencia_id: response.data.results[0].dependencia_id.id,
            next_id: this.state.start.id === response.data.results[0].dependencia_id.id ? response.data.results[1].dependencia_id.id:
             response.data.results[0].dependencia_id.id,
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
      descripcion: this.state.description,
      tipo_de_expediente_id: this.state.tipo_expediente.id,
      dependencia_origen_id: this.state.start.id,
      dependencia_destino_id: (this.state.tipo_expediente.id === 1) ? this.state.start.id : this.state.end.id,
      prioridad_id: this.state.high_priority ? 2 : 1
    }
    return ExpedientesService.create(newExpediente);
  }

  /**
   * Guarda la instancia inicial para el nuevo expediente.
   * @param expId
   */
  saveInstancia = expId => {
    const user_in_id = helper.existToken() ? helper.getCurrentUserId() : null;
    // si next_id es igual a 0 (cero) es porque se selecciono Sin Ruta Predefinida y la siguiente instancia se setea al
    // procesar el expediente.
    // eso significa que ese tipo de expediente pertenece al usuario que esta creando 
    const instancia = {
      expediente_id: expId,
      dependencia_actual_id: this.state.start.id,
      dependencia_siguiente_id: this.state.next_id !== 0 ? this.state.next_id : this.state.start.id,
      usuario_id_entrada: user_in_id,
      //si start.id es igual que first_dependencia_id significa que el expediente fue creado en la primera dependencia de la
      //ruta de ese tipo de expediente por lo cual su orden pasa a ser 1, si se crea en otra dependecia su orden es 0
      orden_actual: this.state.start.id === this.state.first_dependencia_id ? 1 : 0,
      //El estado inicial de un expediente siempre va a ser "recibido"
      estado_id: 2
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
    //Si la dependencia donde se crea el expediente es Mesa de Entrada ya se le asigna el numero y fecha de ME al mismo
    if (this.state.start.value === 'Mesa Entrada') {
      //Se trae de la api la ultima instancia con dependencia en mesa de entrada y estado recibido del año actual, 
    //para obtener su numero de mesa de entrada
    InstanciasService.getInstanciasPorDepEstAnho('Mesa Entrada', 'Recibido')
    .then( response => {
      this.setState({ 
        lastInstanciaME : response.data.map((instancia) =>{
          return {
           numero: instancia.expediente_id.numero_mesa_de_entrada
          }
        })
      })
      const newExpedienteWithME = {
        //se toma el numero de ME del ultimo expediente que paso por ME y se le suma 1, en caso de que no haya pasado ningun exp
        //por ME se asigna el numero de ME 1, ya que es el primero del año
        numero_mesa_de_entrada: this.state.lastInstanciaME.length > 0 ? this.state.lastInstanciaME[0].numero + 1 : 1,
        descripcion: this.state.description,
        tipo_de_expediente_id: this.state.tipo_expediente.id,
        dependencia_origen_id: this.state.start.id,
        dependencia_destino_id: (this.state.tipo_expediente.id === 1) ? this.state.start.id : this.state.end.id,
        prioridad_id: this.state.high_priority ? 2 : 1
      }
      ExpedientesService.create(newExpedienteWithME)
      .then(response => {
        //Se actualiza la fecha de ME del expediente creado recientemente con la hora del servidor
        //que se guarda en fecha_actualizacion
        ExpedientesService.update(response.data.id,{
          fecha_mesa_entrada: response.data.fecha_actualizacion});
        this.saveInstancia(response.data.id);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch(e => {
        Popups.error('Ocurrio un error al crear el nuevo expediente.');
        console.log(`Error save() en nuevo expediente\n${e}`);
      });
    })  
    //si la dependencia es distinta a ME se crea el expediente sin numero de ME 
    } else {
      this.saveExpediente()
      .then(response => {
        this.saveInstancia(response.data.id);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch(e => {
        Popups.error('Ocurrio un error al crear el nuevo expediente.');
        console.log(`Error save() en nuevo expediente\n${e}`);
      });
    }   
  }

  /**
   * Si hay errores en los inputs, muestra los mensajes de error
   */
  checkValid = () => {
    if (!this.validator.allValid()) this.validator.showMessages();
  }

  /**
   * Verifica si los select del formulario no estan vacio y retorna true
   * caso contrario false
   */
  selectCheckValid = () => {
    if (this.state.start.id !== undefined  && this.state.tipo_expediente.id !== undefined) {
      return true;
    } else {
      return false;
    }
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
  handleSaveClick = () => {
    if (this.selectCheckValid()) {
      if (this.validator.allValid()) {
        this.save();
        this.props.setShow(false);
      }else{
        this.validator.showMessages();
    }
    } else {
      //si algun select no se completa
      Popups.error('Complete todos los campos del formulario')
      
    }  
      
  }

  render() {
    //Se traduce los meses que provee momentJS para que aparezcan en español en el modal
    moment.updateLocale('es', {
      months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
      monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
    });
    const date = moment().locale('es').format('LLL');

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
                  {this.validator.message('description', this.state.description, 'required|max:200')}
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