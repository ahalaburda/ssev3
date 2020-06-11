import React, {Component} from "react";
import ObjetosDeGastosService from "../../services/ObjetosDeGastos"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";


class ObjetoDeGasto extends Component{
    constructor(props) {
        super(props);
        this.state = {
            objetosDeGastos: []
        };
        this.retrieveObjetosDeGastos = this.retrieveObjetosDeGastos.bind(this);
    }

    retrieveObjetosDeGastos() {
        ObjetosDeGastosService.getAll()
            .then(response => {
                this.setState({
                    objetosDeGastos: response.data.results.map(odg => {
                        return {
                            id: odg.id,
                            descripcion: odg.descripcion,
                            activo: odg.activo ? "Activo" : "Inactivo"
                        }
                    })
                });
            })
            .catch(e => {
                console.log(e);
            })
    }

    componentDidMount() {
        this.retrieveObjetosDeGastos();
    }

    render() {
        const columns = [
            {
                name: 'Descripción',
                selector: 'descripcion',
                sortable: true,
            },
            {
                name: 'Activo',
                selector: 'activo',
                sortable: true,
            },
            {
                name: 'Acciones',
                cell: row =>
                    <div>
                        <button
                            className="btn btn-sm btn-link text-primary">
                            <FontAwesomeIcon icon="eye"/>
                        </button>
                        <button
                            className="btn btn-sm btn-link text-primary">
                            <FontAwesomeIcon icon="edit"/>
                        </button>
                        <button
                            className="btn btn-sm btn-link text-danger">
                            <FontAwesomeIcon icon="trash-alt"/>
                        </button>
                    </div>,
                button: true,
            }
        ];
        const paginationOptions = {
            rowsPerPageText: 'Filas por página',
            rangeSeparatorText: 'de',
            selectAllRowsItem: true,
            selectAllRowsItemText: 'Todos'
        };

        return (
            <div>
                <DataTable
                    columns={columns}
                    data={this.state.objetosDeGastos}
                    defaultSortField="descripcion"
                    pagination
                    paginationComponentOptions={paginationOptions}
                    highlightOnHover={true}
                    noHeader={true}
                    dense={true}
                    className="table table-sm table-bordered"
                />
            </div>
        );
    }
}

export default ObjetoDeGasto;