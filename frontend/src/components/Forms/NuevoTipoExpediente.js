import React, {Component} from "react";
import Select from "react-select";
import DependenciasService from "../../services/Dependencias";
import TiposDeExpedientesService from "../../services/TiposDeExpedientes";
import Popups from "../Popups";
import SimpleReactValidator from "simple-react-validator";
import {Modal} from "react-bootstrap";
import {Container, Draggable} from "react-smooth-dnd";

/**
 * Modal para nuevo tipo de expediente
 */
class NuevoTipoExpediente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      dependencias: [],
      selectedOptions: []
    };
    this.retrieveDependencias = this.retrieveDependencias.bind(this);
    this.setOption = this.setOption.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    //opciones y mensajes para la validacion
    this.validator = new SimpleReactValidator({
      className: 'text-danger',
      messages: {
        required: 'Este campo no puede estar vacío.',
        max: 'Máximo 100 caracteres.'
      }
    });
  }

  /**
   * Obtener las dependencias de la base de datos y cargarlos como opciones para el select
   */
  retrieveDependencias() {
    DependenciasService.getAllSinPag()
      .then((response) => {
        this.setState({
          dependencias: response.data.map((d) => {
            return {
              id: d.id,
              value: d.descripcion,
              label: d.descripcion,
            }
          })
        })
      })
      .catch((e) => {
        Popups.error('Ocurrió un error al procesar la información');
        console.log(e);
      });
  }
  
  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

  componentDidMount() {
    this.retrieveDependencias();
  }

  /**
   * Obtener la nueva opcion seleccionada del select de dependencias y las agrega a la lista de seleccionados.
   */
  setOption = value => {
    this.setState({
      selectedOptions: [...this.state.selectedOptions, value],
    });
    this.checkValid();
  }

  /**
   * Remover un item de la lista de dependencias
   * @param idx
   */
  handleRemoveItem = idx => {
    let newSelectedOptions = this.state.selectedOptions;
    newSelectedOptions.splice(idx, 1);
    this.setState({
      selectedOptions: newSelectedOptions
    });
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
   * Si hay errores en los inputs, muestra los mensajes de error
   * @returns {boolean} true si todos estan correctos, si no false
   */
  checkValid = () => {
    if (this.validator.allValid()) return true;
    this.validator.showMessages();
  }

  /**
   * Guarda las dependencias asociadas al nuevo tipo de expediente.
   * @param teId Id de la cabecera del nuevo tipo de expediente
   * @returns {boolean} True si se guardaron todos las dependencias, si no False
   */
  saveDetails = teId => {
    if (!this.state.selectedOptions.length <= 0) {
      this.state.selectedOptions.forEach((detail, idx) => {
        TiposDeExpedientesService.createDetail({
          orden: idx + 1,
          tipo_de_expediente_id: teId,
          dependencia_id: detail.id
        })
          .then(r => {
            //si al menos uno de los detalles falla al guardar se retorna false y se borra la cabecera
            if (r.status !== 201) return false
          })
          .catch(e => {
            Popups.error('Ocurrió un error al procesar la información');
            console.log(e);
          })
      });
      return true;
    }
    return false;
  }

  /**
   * Guarda la cabecera del tipo de expediente. Si se guardo, entonces procede a guardar los detalles,
   * si ocurre un error se borra la cabecera.
   */
  saveHead = () => {
    TiposDeExpedientesService.create({
      descripcion: this.state.description,
      saltos : this.state.selectedOptions.length
    })
      .then(response => {
        if (response.status === 201) {
          //si se guardo la cabecera, guarda los detalles
          if (this.saveDetails(response.data.id)) {
            this.props.newItem({
              id: response.data.id,
              descripcion: response.data.descripcion,
              activo: response.data.activo ? "Activo" : "Inactivo"
            });
            Popups.success("Guardado con éxito");
          } else {
            //si ocurrio algun error al guardar los detalles se borra la cabecera
            TiposDeExpedientesService.delete(response.data.id)
              .then(r => {
                if (r.status === 204) Popups.error("Ocurrió un error, no se pudo crear")
              })
              .catch(e => {
                Popups.error('Ocurrió un error al procesar la información');
                console.log(e)
              });
          }
        }
      })
      .catch(e => {
        Popups.error('Ocurrió un error al procesar la información');
        console.log(e)
      });
  }

  /**
   * Limpiar el estado para cuando se abre el modal.
   * Se limpia al abrir para que cuando se guarde no se eliminen los datos necesarios para la creacion del nuevo tipo
   * de expediente.
   */
  clearState = () => {
    this.setState({
      description: '',
      selectedOptions: []
    });
  }

  /**
   * Oculta los mensajes de validacion y cierra el modal.
   */
  handleClose = () => {
    this.validator.hideMessages();
    this.props.setShow(false);
  }

  /**
   * Si todas las validaciones son validas, entonces guarda, si no muestran los mensajes de errores.
   */
  handleSaveClick = () => {
    if (this.checkValid()) {
      this.saveHead();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      this.handleClose();
    }
  }

  /**
   * Funcion para reordenar los items de la lista de dependencias
   * https://github.com/kutlugsahin/smooth-dnd-demo/blob/master/src/demo/pages/utils.js#L2
   * @param arr
   * @param dragResult
   * @returns {*[]|*}
   */
  reorder = (arr, dragResult) => {
    const {removedIndex, addedIndex, payload} = dragResult;
    if (removedIndex === null && addedIndex === null) return arr;

    const result = [...arr];
    let itemToAdd = payload;

    if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0];
    }

    if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd);
    }

    return result;
  }

  onDrop = element => {
    this.setState({
      selectedOptions: this.reorder(this.state.selectedOptions, element)
    });
  }

  render() {
    return (
      <Modal
        show={this.props.showModal}
        onShow={this.clearState}
        backdrop="static"
        size="lg"
        centered
      >
        <Modal.Header>
          <Modal.Title>Información sobre nuevo Tipo de Expediente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Descripcion *</label>
              <input
                type="text"
                className="form-control form-control-sm"
                name="description"
                placeholder="Agrega una descripcion"
                value={this.state.description}
                onChange={e => this.setDescription(e)}
                onBlur={e => this.setDescription(e)}
              />
              {this.validator.message('description', this.state.description, 'required|max:100')}
            </div>
            <div className="form-group">
              <label>Dependencias *</label>
              <div className="row">
                <div className="col">
                  <Select
                    options={this.state.dependencias}
                    placeholder="Selecciona..."
                    name="select"
                    value={this.state.selectedOptions.slice(-1)}
                    onChange={value => this.setOption(value)}
                  />
                  {this.validator.message('select', this.state.dependencias, 'required')}
                </div>
              </div>
            </div>
            <div>
              <ul className="list-group">
                <Container onDrop={e => {
                  this.onDrop(e)
                }}>
                  {this.state.selectedOptions.map((d, idx) => {
                    return (
                      <Draggable key={idx}>
                        <li className="list-group-item py-1">
                          <div className="row align-content-between">
                            <div className="col">{idx + 1}</div>
                            <div className="col-10 text-left">{d.value}</div>
                            <div className="col text-right">
                              <span className="btn btn-danger badge badge-danger badge-pill"
                                    onClick={() => this.handleRemoveItem(idx)}>x</span>
                            </div>
                          </div>
                        </li>
                      </Draggable>
                    )
                  })}
                </Container>
              </ul>
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
            className="btn btn-sm btn-primary">
            Guardar
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default NuevoTipoExpediente;
