import React, {Component} from "react";
import {Modal, Form} from "react-bootstrap";
import "../../styles/form.css";
import Select from "react-select";

class ProcesarExpediente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expediente: {},
      depPrev: {},
      depNow: {},
      depNext: {}
    }
    this.handleClose = this.handleClose.bind(this);
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
   * Setea el props para que se cierre el modal
   */
  handleClose = () => {
    this.props.setShow(false);
  }

  render() {
    let numeroMesaComp, tipoExpediente, descripcion, depAnt, depAct, depSig;
    //TODO determinar como asignar nuevo numero de mesa de entrada
    if (this.state.expediente) {
      if (this.state.expediente.numero_mesa_de_entrada !== null) {
        numeroMesaComp = <input
          className="form-control"
          value={this.state.expediente.numero_mesa_de_entrada}
          disabled/>
      } else {
        numeroMesaComp = <input className="form-control" value=""/>
      }
      tipoExpediente = this.state.expediente.tipo_de_expediente_id.descripcion;
      descripcion = this.state.expediente.descripcion;
      depAnt = this.state.depPrev.descripcion;
      depAct = this.state.depNow.descripcion;
      depSig = this.state.depNext.descripcion;
    }

    //TODO generalizar (utils)
    const selectOptions = [
      {
        id: 2,
        value: 'Recibido',
        label: 'Recibido'
      },
      {
        id: 3,
        value: 'Derivado',
        label: 'Derivado'
      },
      {
        id: 4,
        value: 'Rechazado',
        label: 'Rechazado'
      },
      {
        id: 5,
        value: 'Finalizado',
        label: 'Finalizado'
      },
      {
        id: 6,
        value: 'Anulado',
        label: 'Anulado'
      },
      {
        id: 7,
        value: 'Pausado',
        label: 'Pausado'
      }
    ]

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
                  <input className="form-control" value={depAnt} disabled/>
                </div>
                <div className="form-group col">
                  <Form.Label>Dependencia Actual</Form.Label>
                  <input className="form-control" value={depAct} disabled/>
                </div>
              </Form.Row>
              <Form.Row>
                <div className="form-group col">
                  <Form.Label>Estado</Form.Label>
                  <Select
                    options={selectOptions}
                    placeholder="Selecciona..."
                    size="sm"
                    name="select"/>
                </div>
                <div className="form-group col">
                  <Form.Label>Dependencia Siguiente</Form.Label>
                  <input className="form-control" value={depSig} disabled/>
                </div>
              </Form.Row>
              <Form.Row>
                <div className="from-group col">
                  <Form.Label>Comentario</Form.Label>
                  <Form.Control as="textarea"
                                name="comment"
                                placeholder="Agrega un comentario"
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
          <button type="button" className="btn btn-sm btn-primary">Guardar</button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ProcesarExpediente;