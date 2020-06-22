import React, {Component} from "react";
import Select from "react-select";
import DependenciasService from "../../services/Dependencias";
import TiposDeExpedientesService from "../../services/TiposDeExpedientes";
import Popups from "../Popups";

class NuevoTipoExpediente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descripcion: '',
      dependencias: [],
      selectedOptions: [],
    };
    this.retrieveDependencias = this.retrieveDependencias.bind(this);
    this.setOptions = this.setOptions.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDescripcionChange = this.handleDescripcionChange.bind(this);
    this.saveDetails = this.saveDetails.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
  }

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

  /*
   * Obtener las opciones seleccionadas
   */
  setOptions(values) {
    this.setState({
      selectedOptions: values,
    });
  }

  handleClose() {
    this.setState({
      descripcion: '',
      selectedOptions: []
    });
  }

  handleDescripcionChange(e) {
    this.setState({
      descripcion: e.target.value
    });
  }

  saveDetails(teId) {
    this.state.selectedOptions.forEach((detail, idx) => {
      TiposDeExpedientesService.createDetail({
        orden: idx + 1,
        tipo_de_expediente_id: teId,
        dependencia_id: detail.id
      })
        .then(r => {
          if (r.status !== 201) return false //TODO agregar rollback si ocurre un error
        })
        .catch(e => {
          console.log(e);
        })
    })
    return true;
  }

  handleSaveClick() {
    TiposDeExpedientesService.create({descripcion: this.state.descripcion})
      .then(response => {
        if (response.status === 201) {
          if (this.saveDetails(response.data.id)) {
            this.props.newItem({
              id: response.data.id,
              descripcion: response.data.descripcion,
              activo: response.data.activo ? "Activo" : "Inactivo"
            })
            Popups.success("Guardado con exito");
            this.handleClose();
          } else {
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

  render() {
    return (
      <div
        className="modal fade"
        id="newModal"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Informacion sobre nuevo Tipo de Expediente
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="inputDescription">Descripcion</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="inputDescription"
                    placeholder="Agrega una descripcion"
                    value={this.state.descripcion}
                    onChange={e => this.handleDescripcionChange(e)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="inputAddress">Dependencias</label>
                  <div className="row">
                    <div className="col">
                      <Select
                        options={this.state.dependencias}
                        isMulti
                        placeholder="Selecciona..."
                        value={this.state.selectedOptions}
                        onChange={(values) => this.setOptions(values)}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                data-dismiss="modal"
                onClick={this.handleClose}
              >
                Cerrar
              </button>
              <button
                onClick={this.handleSaveClick}
                type="button"
                className="btn btn-sm btn-primary"
                data-dismiss="modal"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NuevoTipoExpediente;
