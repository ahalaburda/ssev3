import React, {Component} from "react";
import ExpedientesService from "../../services/Expedientes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";
import NuevoExpediente from "../Forms/NuevoExpediente";

/**
 * Tabla para expedientes
 */
class Expediente extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            showNew: false,
            showEdit: false,
            list: []
        };

        this.retrieveExpedientes = this.retrieveExpedientes.bind(this);
        this.setShowNew = this.setShowNew.bind(this);
    }
    
    componentDidMount() {
        this.retrieveExpedientes();
    }

    /**
     * Obtener expedientes de la base de datos y cargarlos en la tabla
     */
    retrieveExpedientes() {
        this.setState({loading: true});
        ExpedientesService.getList()
            .then(response => {
                console.log(response.data)
                this.setState({
                    list: response.data.map(exp => {
                        return {
                            id: exp.id,
                            numero: exp.numero_mesa_de_entrada + "/" + exp.anho,
                            fecha_me: "",
                            origen: exp.dependencia_origen_id,
                            tipo: exp.tipo_de_expediente_id,
                            descripcion: exp.descripcion,
                            estado: this.getEstado(exp.estado_instancia),
                            dependencia: exp.dependencia_actual_id
                        }
                    }),
                    loading: false
                });
            })
            .catch(e => {
                console.log(e);
            });

    }

    /**
     * Agrega el nuevo expediente a la tabla
     * @param newItem Nuevo expediente
     */
    addItem = newItem => {
        this.setState({
            list: [...this.state.list, newItem]
        });
    }

    /**
     * Setear el estado 'showNew' para mostrar u ocultar el modal
     */
    setShowNew = show => {
        this.setState({showNew: show});
    }

    getEstado(key){
        let estados = new Map();
        estados.set(1, "No Recibido");
        estados.set(2, "Recibido");
        estados.set(3, "Derivado");
        estados.set(4, "Rechazado");
        estados.set(5, "Finalizado");
        estados.set(6, "Anulado");
        estados.set(7, "Pausado");
        return estados.get(key);
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
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">Expedientes</h1>
                    <button className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                            onClick={() => this.setShowNew(true)}><FontAwesomeIcon icon="plus" size="sm"
                                                                                   className="text-white-50"/>&nbsp;Nuevo
                    </button>
                </div>
                <div>

                    {/*Tabla de lista de expediente*/}
                    <DataTable
                        columns={columns}
                        data={this.state.list}
                        defaultSortField="fecha me"
                        progressPending={this.state.loading}
                        pagination
                        paginationComponentOptions={paginationOptions}
                        highlightOnHover={true}
                        noHeader={true}
                        dense={true}
                        className="table-responsive table-sm table-bordered"
                    />
                    <NuevoExpediente
                        setShow={this.setShowNew}
                        showModal={this.state.showNew}
                        newItem={this.addItem}
                    />
                </div>
            </div>
        );
    }
}

export default Expediente;