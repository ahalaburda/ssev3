import React, {Component} from 'react';
import ObjetosDeGastosService from '../../services/ObjetosDeGastos';
import Popups from '../Popups';
import SimpleReactValidator from "simple-react-validator";
import {Modal} from "react-bootstrap";

/**
 * Modal para nuevo objeto de gasto
 */
class NuevoObjetoDeGasto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: ''
        };
        this.setDescription = this.setDescription.bind(this);
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        //opciones y mensajes para la validacion
        this.validator = new SimpleReactValidator({
            className: 'text-danger',
            messages: {
                required: 'Este campo no puede estar vacío.'
            }
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
     */
    checkValid = () => {
        if (!this.validator.allValid()) this.validator.showMessages();
    }

    /**
     * Guarda el nuevo objeto de gasto
     */
    save = () => {
        ObjetosDeGastosService.create({descripcion: this.state.description})
            .then(response => {
                if(response.status === 201){
                    this.props.newItem({
                        id: response.data.id,
                        descripcion: response.data.descripcion,
                        activo: response.data.activo ? "Activo" : "Inactivo"
                    });
                    Popups.success("Nuevo objeto de gasto creado con éxito");
                    this.handleClose();
                }
                else {
                    Popups.error("Ocurrió un error, no se pudo crear");
                }
            })
            .catch(e => {
                console.log(e);
            });
    }

    /**
     * Limpiar los campos cuando se cierra el modal.
     */
    handleClose = () => {
        this.setState({
            description: ''
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
        return (
            <Modal
                show={this.props.showModal}
                onHide={this.handleClose}
                backdrop="static"
                size="lg"
                centered
            >
                <Modal.Header>
                    <Modal.Title>Nuevo Objeto de Gasto</Modal.Title>
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

export default NuevoObjetoDeGasto;