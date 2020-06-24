import React, {Component} from 'react';
import Popups from "../Popups";

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
  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  /**
   * Setea el estado active
   */
  onChangeActive() {
    this.setState({
      active: !this.state.active
    });
  }

  /**
   * Actualiza el registro con los nuevos valores y utiliza el servicio recibido para actualizar la base de datos
   */
  handleUpdate() {
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
        console.log(e);
      });
  }

  render() {
    return (
      <div className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Editar {this.props.title}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form>
              <div className="modal-body">

                <div className="form-group">
                  <label htmlFor="inputDescription">Descripción</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="inputDescription"
                    value={this.state.descripcion}
                    onChange={(e) => this.onChangeDescripcion(e)}
                    placeholder="Agrega una descripcion"/>
                </div>
                <div className="form-group">
                  <div className="row">
                    <div className="col-2">
                      <label htmlFor="inputAddress">Activo</label>
                    </div>
                    <div className="col-2">
                      <input
                        type="checkbox"
                        id="switch2"
                        checked={this.state.activo}
                        onChange={this.onChangeActivo}
                        switch="default"/>
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  data-dismiss="modal"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="btn btn-sm btn-primary"
                  data-dismiss="modal"
                  onClick={() => this.handleUpdate()}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default SimpleEdit;