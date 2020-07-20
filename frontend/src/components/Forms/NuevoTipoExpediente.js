import React, {Component} from "react";
import Select from "react-select";
import DependenciasService from "../../services/Dependencias";
import TiposDeExpedientesService from "../../services/TiposDeExpedientes";
import Popups from "../Popups";
import SimpleReactValidator from "simple-react-validator";
import {Modal} from "react-bootstrap";

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
    this.setOptions = this.setOptions.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    //opciones y mensajes para la validacion
    this.validator = new SimpleReactValidator({
      className: 'text-danger',
      messages: {
        required: 'Este campo no puede estar vacío.'
      }
    });
  }

  /**
   * Obtener las dependencias de la base de datos y cargarlos como opciones para el select
   */
  retrieveDependencias() {
    DependenciasService.getAll()
      .then((response) => {
        this.setState({
          dependencias: response.data.results.map((d) => {
            return {
              id: d.id,
              value: d.descripcion,
              label: d.descripcion,
            }
          })
        })
      })
      .catch((e) => {
        console.log(e);
      });
  }

  componentDidMount() {
    this.retrieveDependencias();
  }

  /**
   * Obtener las opciones seleccionadas del select de dependencias.
   */
  setOptions = values => {
    this.setState({
      selectedOptions: values,
    });
    this.checkValid();
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
    this.state.selectedOptions.forEach((detail, idx) => {
      TiposDeExpedientesService.createDetail({
        orden: idx + 1,
        tipo_de_expediente_id: teId,
        dependencia_id: detail.id
      })
        .then(r => {
          //si al menos uno de los detalles falla al guardar se retorna false y se borra la cabecera
          if (r.status !== 201) return false //TODO agregar rollback de los detalles ya cargados si ocurre un error
        })
        .catch(e => {
          console.log(e);
        })
    })
    return true;
  }

  /**
   * Guarda la cabecera del tipo de expediente. Si se guardo, entonces procede a guardar los detalles,
   * si ocurre un error se borra la cabecera.
   */
  saveHead = () => {
    TiposDeExpedientesService.create({descripcion: this.state.description})
      .then(response => {
        if (response.status === 201) {
          //si se guardo la cabecera, guarda los detalles
          if (this.saveDetails(response.data.id)) {
            this.props.newItem({
              id: response.data.id,
              descripcion: response.data.descripcion,
              activo: response.data.activo ? "Activo" : "Inactivo"
            })
            Popups.success("Guardado con exito");
            this.handleClose();
          } else {
            //si ocurrio algun error al guardar los detalles se borra la cabecera
            TiposDeExpedientesService.delete(response.data.id)
              .then(r => {
                if (r.status === 204) Popups.error("Ocurrio un error, no se pudo crear")
              })
              .catch(e => {
                console.log(e)
              })
          }
        }
      })
      .catch(e => {
        console.log(e)
      })
  }

  /**
   * Limpiar los campos cuando se cierra el modal.
   */
  handleClose = () => {
    this.setState({
      description: '',
      selectedOptions: []
    });
    this.validator.hideMessages();
    this.props.setShow(false);
  }

  /**
   * Si todas las validaciones son validas, entonces guarda, si no muestran los mensajes de errores
   */
  handleSaveClick = () => {
    if (this.checkValid()) {
      this.saveHead();
      this.handleClose();
    }
  }

  render() {
    return (
      <Modal
        show={this.props.showModal}
        onHide={this.handleClose}
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
              {this.validator.message('description', this.state.description, 'required')}
            </div>
            <div className="form-group">
              <label>Dependencias *</label>
              <div className="row">
                <div className="col">
                  <Select
                    options={this.state.dependencias}
                    isMulti
                    placeholder="Selecciona..."
                    name="select"
                    value={this.state.selectedOptions}
                    onChange={(values) => this.setOptions(values)}
                  />
                  {this.validator.message('select', this.state.dependencias, 'required')}
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
            className="btn btn-sm btn-primary">
            Guardar
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default NuevoTipoExpediente;
