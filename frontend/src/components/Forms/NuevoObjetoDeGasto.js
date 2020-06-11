import React, {Component} from 'react';
import $ from "jquery";
import ObjetosDeGastosService from '../../services/ObjetosDeGastos';

class NuevoObjetoDeGasto extends Component{
    constructor(props){
        super(props);
        this.state = {
            id: null,
            descripcion: ""
        };

        this.onChangeDescripcion = this.onChangeDescripcion.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onChangeDescripcion(e) {
        this.setState({
            descripcion: e.target.value
        });
    }
    handleSubmit = (e) => {
        console.log("anda");
        e.preventDefault();
        var data = {
            descripcion: this.state.descripcion
        };

        ObjetosDeGastosService.create(data)
            .then(response => {
                this.setState({
                    id: response.data.id,
                    descripcion: response.data.descripcion
                });
                console.log(response.data);
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
                        <form onSubmit={this.handleSubmit}>
                            <div className="modal-body">

                                    <div className="form-group">
                                        <label htmlFor="inputDescription">Descripción</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            id="inputDescription"
                                            value={this.state.descripcion}
                                            onChange={this.onChangeDescripcion}
                                            placeholder="Agrega una descripcion"/>
                                    </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-sm btn-secondary" data-dismiss="modal">Cerrar
                                </button>
                                <button type="submit" className="btn btn-sm btn-primary">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default NuevoObjetoDeGasto;