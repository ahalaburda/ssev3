import React, {Component} from 'react';
import ObjetosDeGastosService from '../../services/ObjetosDeGastos';
import Popups from "../Popups";

class NuevoObjetoDeGasto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            descripcion: '',
            activo: true
        };

        this.handleUpdate = this.handleUpdate.bind(this);
        this.onChangeDescripcion = this.onChangeDescripcion.bind(this);
        this.onChangeActivo = this.onChangeActivo.bind(this);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            id: nextProps.objetoDeGasto.id,
            descripcion: nextProps.objetoDeGasto.descripcion,
            activo: nextProps.objetoDeGasto.activo
        });
    }

    onChangeDescripcion(e) {
        this.setState({
            descripcion: e.target.value
        });
    }

    onChangeActivo() {
        this.setState({
            activo: !this.state.activo
        });
    }

    handleUpdate() {
        let data = {
            id: this.state.id,
            descripcion: this.state.descripcion,
            activo: this.state.activo
        };
        ObjetosDeGastosService.update(data.id, data)
            .then(response => {
                if(response.status === 200) {
                    this.props.saveModalEdit(response.data);
                    Popups.success("Actualizado con éxito");
                }else{
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
                            <h5 className="modal-title">Editar Objeto de Gastos</h5>
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
                                                onChange={this.onChangeActivo}/>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-sm btn-secondary" data-dismiss="modal">Cerrar
                                </button>
                                <button type="submit" className="btn btn-sm btn-primary" data-dismiss="modal"
                                        onClick={() => this.handleUpdate()}>Guardar
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