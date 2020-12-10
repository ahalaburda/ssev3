import React, {Component} from "react";
import DataTable from "react-data-table-component";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class Consulta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    }
  }

  // componentWillReceiveProps(nextProps, nextContext) {
  //   this.setState({list: nextProps.data})
  // }

  //reemplazo de funcion componentWillReceiveProps
  static getDerivedStateFromProps(nextProps) {
    return {list: nextProps.data}
  }

  render() {
    // columnas para la tabla
     const columns = [
      {
        name: 'ID',
        selector: 'id',
        sortable: true,
        grow: -1
      },
      {
        name: 'Número',
        selector: 'numero',
        grow: -1
      },
      {
        name: 'Fecha Me',
        selector: 'fechaMe',
        wrap: true
      },
      {
        name: 'Origen',
        selector: 'origen',
        wrap: true
      },
      {
        name: 'Destino',
        selector: 'destino',
        wrap: true
      },
      {
        name: 'Descripcion',
        selector: 'descripcion',
        grow: 2,
        wrap: true
      },
      {
        name: 'Estado',
        selector: 'estado',
        grow: -1,
        cell: row => {
          switch (row.estado) {
            case "Recibido":
              return <div className="badge badge-success">{row.estado}</div>
            case "No Recibido":
              return <div className="badge badge-warning">{row.estado}</div>
            case "Finalizado":
              return <div className="badge badge-primary">{row.estado}</div>
            case "Anulado":
              return <div className="badge badge-secondary">{row.estado}</div>
            case "Pausado":
              return <div className="badge badge-dark">{row.estado}</div>
            case "Reanudado":
              return <div className="badge badge-success">{row.estado}</div>
            default:
              return <div className="badge badge-primary">{row.estado}</div>
          }
        }
      },
      {
        name: 'Dependencia Actual',
        selector: 'dependenciaActual',
        wrap: true
      },
      {
        name: 'Acciones',
        cell: () =>
          <div>
            <button className="btn btn-sm btn-link text-primary">
              <FontAwesomeIcon icon="print"/>
            </button>
          </div>,
        button: true
      }
    ];

    // opciones para la paginacion
    const paginationOptions = {
      noRowsPerPage: true,
      rangeSeparatorText: 'de',
      selectAllRowsItem: true,
      selectAllRowsItemText: 'Todos'
    };

    return (
      <DataTable
        columns={columns}
        data={this.state.list}
        pagination
        paginationComponentOptions={paginationOptions}
        highlightOnHover={true}
        noHeader={true}
        dense={true}
        className="table-responsive table-sm table-bordered"
      />
    );
  }
}

export default Consulta;