import React, {Component} from "react";
import DataTable from "react-data-table-component";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import TiposDeExpedientesService from "../../services/TiposDeExpedientes";
import VerTipoExpediente from "../Forms/VerTipoExpediente";
import NuevoTipoExpediente from "../Forms/NuevoTipoExpediente";

class TipoDeExpediente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      title: '',
      dependencias: []
    };
    this.retrieveTiposDeExpedientes = this.retrieveTiposDeExpedientes.bind(this);
    this.handleViewClick = this.handleViewClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.addItem = this.addItem.bind(this);
  }

  retrieveTiposDeExpedientes() {
    TiposDeExpedientesService.getAll()
      .then(response => {
        this.setState({
          list: response.data.map(tde => {
            return {
              id: tde.id,
              descripcion: tde.descripcion,
              activo: tde.activo ? "Activo" : "Inactivo"
            }
          })
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  componentDidMount() {
    this.retrieveTiposDeExpedientes();
  }

  handleViewClick = row => {
    TiposDeExpedientesService.getDetails(row.id)
      .then(response => {
        this.setState({
          title: row.descripcion,
          dependencias: response.data.results.sort((a, b) => a.orden - b.orden).map(d => {
            return d.dependencia_id.descripcion
          })
        })
      });
  }

  handleEditClick = row => {
    console.log(`editar: ${row.descripcion}`);
  }

  handleDeleteClick = row => {
    console.log(`borrar: ${row.descripcion}`);
  }

  addItem = newItem => {
    this.setState({
      list: [...this.state.list, newItem]
    });
  }

  render() {
    const columns = [
        {
          name: 'Descripcion',
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
                className="btn btn-sm btn-link text-primary"
                onClick={() => this.handleViewClick(row)}
                data-toggle="modal" data-target="#viewTipoExpedienteModal">
                <FontAwesomeIcon icon="eye"/>
              </button>
              <button
                className="btn btn-sm btn-link text-primary"
                onClick={() => this.handleEditClick(row)}>
                <FontAwesomeIcon icon="edit"/>
              </button>
              <button
                className="btn btn-sm btn-link text-danger"
                onClick={() => this.handleDeleteClick(row)}>
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
      <>
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0 text-gray-800">Tipos de expedientes</h1>
          <button className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" data-toggle="modal"
                  data-target="#newModal"><FontAwesomeIcon icon="plus" size="sm" className="text-white-50"/>&nbsp;Nuevo</button>
        </div>

        {/*Tabla de lista de tipos de expedientes*/}
        <DataTable
          columns={columns}
          data={this.state.list}
          defaultSortField="descripcion"
          pagination
          paginationComponentOptions={paginationOptions}
          highlightOnHover={true}
          noHeader={true}
          dense={true}
          className="table table-sm table-bordered"
        />

        {/*Modal de nuevo expediente*/}
        <NuevoTipoExpediente newItem={this.addItem}/>

        {/*Modal para ver tipo de expediente con sus rutas*/}
        <VerTipoExpediente titulo={this.state.title} dependencias={this.state.dependencias}/>
      </>
    );
  }
}

export default TipoDeExpediente;
