import React, {Component} from 'react';
import ObjetosDeGastosService from '../../services/ObjetosDeGastos';

class NuevoObjetoDeGasto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            descripcion: ''
        };

        this.onChangeDescripcion = this.onChangeDescripcion.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onChangeDescripcion(e) {
        this.setState({
            descripcion: e.target.value
        });
    }

    handleSubmit() {
        let data = {
            descripcion: this.state.descripcion
        };

        ObjetosDeGastosService.create(data)
            .then(response => {
                this.props.saveModalNew(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    render() {
        return (
            <div className="modal fade" id="newModal" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Nuevo Objeto de Gastos</h5>
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
                                        value={this.state.descripcion}
                                        onChange={this.onChangeDescripcion}
                                        placeholder="Agrega una descripcion"/>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-sm btn-secondary" data-dismiss="modal">Cerrar
                                </button>
                                <button type="submit" className="btn btn-sm btn-primary" data-dismiss="modal"
                                        onClick={() => this.handleSubmit()}>Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default NuevoObjetoDeGasto;