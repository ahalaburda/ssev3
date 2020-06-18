import React, {Component} from "react";
import ObjetosDeGastosService from "../../services/ObjetosDeGastos"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";
import EditarObjetoDeGasto from "../Forms/EditarObjetoDeGasto";
import NuevoObjetoDeGasto from "../Forms/NuevoObjetoDeGasto";

class ObjetoDeGasto extends Component {
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
        this.saveModalEdit = this.saveModalEdit.bind(this);
        this.saveModalNew = this.saveModalNew.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    getObjectRow = row => {
        ObjetosDeGastosService.getById(row.id).then(response => {
            this.setState({
                objetoDeGasto: response.data
            })
        });
    }

    handleDelete(data) {
        let tempObjetosDeGastos = this.state.objetosDeGastos;
        let indexOfId = tempObjetosDeGastos.findIndex(e => e.id === data.id);
        if (indexOfId > -1) {
            ObjetosDeGastosService.delete(data.id);
            tempObjetosDeGastos.splice(indexOfId, 1);
        }
        this.setState({objetosDeGastos: tempObjetosDeGastos});
    }

    saveModalNew(data) {
        let tempObjetosDeGastos = this.state.objetosDeGastos;
        let objDeGasto = {
            id: data.id,
            descripcion: data.descripcion,
            activo: data.activo ? "Activo" : "Inactivo"
        };
        tempObjetosDeGastos.push(objDeGasto);
        this.setState({objetosDeGastos: tempObjetosDeGastos});
    }

    saveModalEdit(data) {
        let tempObjetosDeGastos = this.state.objetosDeGastos;
        let indexOfId = tempObjetosDeGastos.findIndex(e => e.id === data.id);
        if(indexOfId !== -1){
            tempObjetosDeGastos[indexOfId] = {
                id: data.id,
                descripcion: data.descripcion,
                activo: data.activo ? "Activo" : "Inactivo"
            };
        }
        this.setState({objetosDeGastos: tempObjetosDeGastos});
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
        let columns = [
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
                            className="btn btn-sm btn-link text-primary" data-toggle="modal" data-target="#editModal"
                            onClick={() => this.getObjectRow(row)}>
                            <FontAwesomeIcon icon="edit"/>
                        </button>
                        <button
                            className="btn btn-sm btn-link text-danger" onClick={() => {if(window.confirm('Estás seguro de eliminar?')){this.handleDelete(row)};}}>
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
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">Objetos de Gastos</h1>
                    <button className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" data-toggle="modal"
                            data-target="#newModal"><FontAwesomeIcon icon="plus" size="sm"
                                                                     className="text-white-50"/>&nbsp;Nuevo
                    </button>
                </div>
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

                    {/*Modal de nuevo objeto de gasto*/}
                    <NuevoObjetoDeGasto
                        saveModalNew={this.saveModalNew}
                    />

                    {/*Modal de nuevo objeto de gasto*/}
                    <EditarObjetoDeGasto
                        objetoDeGasto={this.state.objetoDeGasto}
                        saveModalEdit={this.saveModalEdit}
                    />
                </div>
            </div>
        );
    }
}

export default ObjetoDeGasto;