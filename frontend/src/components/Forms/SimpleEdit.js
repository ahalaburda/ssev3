import React, {Component} from 'react';
import Popups from "../Popups";
import SimpleReactValidator from "simple-react-validator";
import {Modal} from "react-bootstrap";

/**
 * Modal generico para actualizar campo 'descripcion' y 'activo'
 * @property title Titulo para el modal
 * @property item Registro a modificar
 * @property saveModalEdit Funcion que actualiza la tabla con el registro modificado
 * @property service El servicio que guarda las modificaciones
 */
class SimpleEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      description: '',
      active: true
    };

    this.handleUpdate = this.handleUpdate.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeActive = this.onChangeActive.bind(this);
    this.handleClose = this.handleClose.bind(this);
    //opciones para la validacion
    this.validator = new SimpleReactValidator({
      className: 'text-danger',
      messages: {
        required: 'Este campo no puede estar vacío.'
      }
    })
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      id: nextProps.item.id,
      description: nextProps.item.descripcion,
      active: nextProps.item.activo
    });
  }

  /**
   * Setea el estado description
   * @param e Evento del input description
   */
  onChangeDescription = e => {
    this.setState({
      description: e.target.value
    });
    this.checkValid();
  }

  /**
   * Si hay errores en los inputs, muestra los mensajes de error
   */
  checkValid = () => {
    if (this.validator.allValid()) return true;
    this.validator.showMessages();
  }

  /**
   * Setea el estado active
   */
  onChangeActive = () => {
    this.setState({
      active: !this.state.active
    });
  }

  handleClose = () => {
    this.setState({
      id: 0,
      description: '',
      active: true
    });
    this.validator.hideMessages();
    this.props.setShow(false);
  }

  /**
   * Actualiza el registro con los nuevos valores y utiliza el servicio recibido para actualizar la base de datos
   */
  update = () => {
    let data = {
      id: this.state.id,
      descripcion: this.state.description,
      activo: this.state.active
    };
    //servicio recibido
    this.props.service.update(data.id, data)
      .then(response => {
        if (response.status === 200) {
          this.props.saveModalEdit(response.data);
          Popups.success("Actualizado con éxito");
        } else {
          Popups.error("Ocurrió un error, no se pudo guardar");
        }
      })
      .catch(e => {
        Popups.error('Ocurrió un error al procesar la información');
        console.log(e);
      });
  }

  handleUpdate = () => {
    if (this.checkValid()) {
      this.update();
      this.handleClose();
    }
  }

  render() {
    return (
      <Modal
        show={this.props.showModal}
        onHide={this.handleclose}
        backdrop="static"
        centered
      >
        <Modal.Header>
          <Modal.Title>Editar {this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Descripci&oacute;n</label>
              <input
                type="text"
                className="form-control form-control-sm"
                name="description"
                value={this.state.description}
                onChange={e => this.onChangeDescription(e)}
                onBlur={e => this.onChangeDescription(e)}
                placeholder="Agrega una descripción"
              />
              {this.validator.message('description', this.state.description, 'required')}
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-2">
                  <label>Activo</label>
                </div>
                <div className="col-2">
                  <input
                    type="checkbox"
                    id="switch2"
                    checked={this.state.active}
                    onChange={this.onChangeActive}/>
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
            type="submit"
            className="btn btn-sm btn-primary"
            onClick={() => this.handleUpdate()}>
            Guardar
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default SimpleEdit;