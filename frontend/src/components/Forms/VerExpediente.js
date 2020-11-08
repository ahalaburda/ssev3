import React, {Component} from "react";

class VerExpediente extends Component {
  constructor(props) {
    super(props);
    this.state = {
        numero:'',
        descripcion:'',
        objetoDeGasto:'',
        fecha:'',
        estado:'',
        origen:'',
        dependenciaActual:'',
        tipoDeExpediente:'',
    }
  }

  //reemplazo de funcion componentWillReceiveProps
  static getDerivedStateFromProps(nextProps) {
    return {
        numero: nextProps.verNumero,
        fecha: nextProps.verFecha,
        descripcion: nextProps.verDescripcion,
        objetoDeGasto: nextProps.verObjetoDeGasto,
        estado: nextProps.verEstado,
        origen: nextProps.verOrigen,
        dependenciaActual: nextProps.verDependencia,
        tipoDeExpediente: nextProps.verTipo
    }
  }

  render() {
    return (
      <div className="modal fade" id="viewExpedienteModal" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title"><strong>Expediente N°{this.state.numero}</strong></h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <div>
                    <label><strong>Tipo de Expediente:</strong> {this.state.tipoDeExpediente}</label>
                </div>
                <div>
                    <label><strong>Objeto:</strong> {this.state.objetoDeGasto}</label>
                </div>
                <div>
                    <label><strong>Origen:</strong> {this.state.origen}</label>
                </div>
                <div>
                    <label><strong>Dependencia Actual:</strong> {this.state.dependenciaActual}</label>
                </div>
                <div>
                    <label><strong>Fecha:</strong> {this.state.fecha}</label>
                </div>
                <div>
                    <label><strong>Descripción:</strong> {this.state.descripcion}</label>
                </div>
                <div>
                    <label><strong>Estado:</strong> {this.state.estado}</label> 
                </div>          
                     
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VerExpediente;