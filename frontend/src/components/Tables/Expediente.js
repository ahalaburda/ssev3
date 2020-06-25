import React, {Component} from "react";
import ExpedientesService from "../../services/Expedientes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";

class Expediente extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expedientes: []
        };

        this.retrieveExpedientes = this.retrieveExpedientes.bind(this);
    }
    componentDidMount() {
        this.retrieveExpedientes();
    }

    retrieveExpedientes() {
        ExpedientesService.getAll()
            .then(response => {
                console.log(response.data.results);
                this.setState({
                    expedientes: response.data.results.map(exp => {
                        return {
                            id: exp.id,
                            numero: exp.numero_mesa_de_entrada + "/" + exp.anho,
                            fecha_me: "",
                            origen: exp.dependencia_origen_id.descripcion,
                            tipo: exp.tipo_de_expediente_id.descripcion,
                            descripcion: exp.descripcion,
                            estado: exp.estado_id.descripcion,
                            dependencia: ""
                        }
                    })
                });
            })
            .catch(e => {
                console.log(e);
            });

    }

    render() {
        let columns = [
            {
                name: 'ID',
                selector: 'id',
                sortable: true,
                grow: -1
            },
            {
                name: 'Número',
                selector: 'numero',
                sortable: true,
            },
            {
                name: 'Fecha Me',
                selector: 'fecha me',
                sortable: true,
            },
            {
                name: 'Origen',
                selector: 'origen',
                sortable: true,
            },
            {
                name: 'Tipo',
                selector: 'tipo',
                sortable: true,
                grow: 2,
                wrap: true
            },
            {
                name: 'Descripción',
                selector: 'descripcion',
                sortable: true,
                grow: 2,
                wrap: true
            },
            {
                name: 'Estado',
                selector: 'estado',
                sortable: true,
            },
            {
                name: 'Dependencia',
                selector: 'dependencia',
                sortable: true,
            },
            {
                name: 'Acciones',
                cell: row =>
                    <div>
                        <button
                            className="btn btn-sm btn-link text-primary"
                            onClick={() => this.handleViewClick(row)}
                            data-toggle="modal" data-target="#viewTipoExpedienteModal">
                            <FontAwesomeIcon icon="eye"/>
                        </button>
                        <button
                            className="btn btn-sm btn-link text-primary" data-toggle="modal" data-target="#editModal"
                            onClick={() => this.getObjectRow(row)}>
                            <FontAwesomeIcon icon="edit"/>
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
                <div className="d-sm-flex align-items-center mb-4">
                    <h1 className="h3 mb-0 text-gray-800 mr-auto">Expedientes</h1>
                    <div className="button-group">
                        <a href="#" className="btn btn-sm btn-primary shadow-sm" data-toggle="modal" data-target="#newModal">
                            <FontAwesomeIcon icon="plus" size="sm" className="text-white-50"/>&nbsp;Nuevo</a>
                        <a href="#" className="btn btn-sm btn-primary shadow-sm" data-toggle="modal" data-target="#processModal">
                            <FontAwesomeIcon icon="pencil-alt" size='sm' className="text-white-50"/>&nbsp;Procesar</a>
                    </div>
                </div>
                <div>
                    <DataTable
                        columns={columns}
                        data={this.state.expedientes}
                        defaultSortField="descripcion"
                        pagination
                        paginationComponentOptions={paginationOptions}
                        highlightOnHover={true}
                        noHeader={true}
                        dense={true}
                        className="table-responsive table-sm table-bordered"
                    />
                </div>
            </div>
        );
    }
}

export default Expediente;