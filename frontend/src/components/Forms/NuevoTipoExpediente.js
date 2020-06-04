import React, {Component} from "react";
import DependenciasService from '../../services/Dependencias';

class NuevoTipoExpediente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dependencias: []
    };
    this.retrieveDependencias = this.retrieveDependencias.bind(this);
  }

  retrieveDependencias() {
    DependenciasService.getAll()
      .then(response => {
        this.setState({
          dependencias: response.data.results
        });
        console.log('DEPENDENCIAS EN NUEVO');
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      })
  }

  componentDidMount() {
    this.retrieveDependencias();
  }

  render() {
    let data = this.state.dependencias && this.state.dependencias.map(d => {
      return <option key={d.id} className="card-title">{d.descripcion}</option>
    });
    return (
      <div className="modal fade" id="newModal" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Informacion sobre nuevo Tipo de Expediente</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="inputDescription">Descripcion</label>
                  <input type="text" className="form-control form-control-sm" id="inputDescription"
                         placeholder="Agrega una descripcion"/>
                </div>
                <div className="form-group">
                  <label htmlFor="inputAddress">Dependencias</label>
                  <div className="row">
                    <div className="col">
                      <select className="form-control form-control-sm">{data}</select>
                    </div>
                    <div className="col-md-4">
                      <a href="#" className="btn btn-sm btn-secondary">
                        <span className="text">Agregar</span>
                      </a>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-sm btn-secondary" data-dismiss="modal">Cerrar
              </button>
              <button type="button" className="btn btn-sm btn-primary">Guardar</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NuevoTipoExpediente;