import React, {Component} from "react";
import ObjetosDeGastosService from "../../services/ObjetosDeGastos"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";
import EditarObjetoDeGasto from "../Forms/EditarObjetoDeGasto";

class ObjetoDeGasto extends Component{
    constructor(props) {
        super(props);
        this.state = {
            objetosDeGastos: [],
            objetoDeGasto: {
                id: null,
                descripcion: '',
                activo: true
            }
        };

        this.retrieveObjetosDeGastos = this.retrieveObjetosDeGastos.bind(this);
        this.getObjectRow = this.getObjectRow.bind(this);
    }

    getObjectRow = row => {
        ObjetosDeGastosService.getById(row.id).then(response => {
            this.setState({
                objetoDeGasto: response.data
            })
        });
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
                            className="btn btn-sm btn-link text-primary" data-toggle="modal" data-target="#editModal"
                            onClick={() => this.getObjectRow(row)}>
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
                <EditarObjetoDeGasto
                    objetoDeGasto={this.state.objetoDeGasto}
                />
            </div>
        );
    }
}

export default ObjetoDeGasto;