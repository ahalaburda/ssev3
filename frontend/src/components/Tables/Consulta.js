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
   
  /**
   * Obtiene los datos de la fila de la tabla a traves de row y luego
   * los escribe en un frameContent para poder imprimirlos
   * @param {*} row 
   */
  printExp = (row) =>{  
    let printDoc = document.getElementById("consultasContentsToPrint").contentWindow;
    printDoc.document.open();
    printDoc.document.write(`<Strong>Expediente N°${row.numero}</Strong><br>`);
    printDoc.document.write(`<Strong>ID:</Strong> ${row.id}<br>`);
    printDoc.document.write(`<Strong>Fecha:</Strong> ${row.fechaMe}<br>`);
    printDoc.document.write(`<Strong>Origen:</Strong> ${row.origen}<br>`);
    printDoc.document.write(`<Strong>Destino:</Strong> ${row.destino}<br>`);
    printDoc.document.write(`<Strong>Descripción:</Strong> ${row.descripcion}<br>`);
    printDoc.document.write(`<Strong>Estado:</Strong> ${row.estado}<br>`);
    printDoc.document.write(`<Strong>Dependencia Actual:</Strong> ${row.dependenciaActual}<hr>`);
    printDoc.document.close();
    printDoc.focus();
    printDoc.print();
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
            case "Derivado":
              return <div className="badge badge-info">{row.estado}</div>
            case "Rechazado":
              return <div className="badge badge-danger">{row.estado}</div>
            case "Finalizado":
              return <div className="badge badge-secondary">{row.estado}</div>
            default:
              return <div className="badge badge-dark">{row.estado}</div>
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
        cell: (row) =>
          <div>
            <button 
            onClick= {()=> this.printExp(row)}
            className="btn btn-sm btn-link text-info">
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