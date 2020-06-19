import React, {Component} from "react";
import DataTable from "react-data-table-component";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import TiposDeExpedientesService from "../../services/TiposDeExpedientes";
import VerTipoExpediente from "../Forms/VerTipoExpediente";

class TipoDeExpediente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tiposDeExpedientes: [],
      titulo: '',
      dependencias: []
    };
    this.retrieveTiposDeExpedientes = this.retrieveTiposDeExpedientes.bind(this);
    this.handleViewClick = this.handleViewClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  retrieveTiposDeExpedientes() {
    TiposDeExpedientesService.getAll()
      .then(response => {
        {/*TODO revisar para paginacion*/
        }
        this.setState({
          tiposDeExpedientes: response.data.map(tde => {
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
          titulo: row.descripcion,
          dependencias: response.data.results.map(d => {
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
        <DataTable
          columns={columns}
          data={this.state.tiposDeExpedientes}
          defaultSortField="descripcion"
          pagination
          paginationComponentOptions={paginationOptions}
          highlightOnHover={true}
          noHeader={true}
          dense={true}
          className="table table-sm table-bordered"
        />
        <VerTipoExpediente titulo={this.state.titulo} dependencias={this.state.dependencias}/>
      </>
    );
  }
}

export default TipoDeExpediente;
