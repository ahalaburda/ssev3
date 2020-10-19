import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";
import VerExpediente from "../Forms/VerExpediente";
import InstanciasService from "../../services/Instancias";
/**
 * Tabla para reportes
 */
class Reporte extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      numero:'',
      descripcion:'',
     // objetoDeGasto:'',
      fecha:'',
      estado:'',
      origen:'',
      dependenciaActual:'',
      tipoDeExpediente:'',
      totalRows: 0
    };
  }

  //reemplazo de funcion componentWillReceiveProps
  static getDerivedStateFromProps(nextProps) {
    return {list: nextProps.data}
  }

  handleViewExpediente =row=>{
    InstanciasService.getByExpedienteId(row.id)
    .then(response =>{
      this.setState({
        numero: row.numero,
        descripcion: row.descripcion,
        fecha: row.fecha_me,
        estado: row.estado,
        origen: row.origen,
        dependenciaActual: row.dependencia,
        tipoDeExpediente: row.tipo,
        objetoDeGasto: response.data.results.map(exp =>{
          return exp.expediente_id.objeto_de_gasto_id.descripcion
        })
      });
    })
    
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
        grow: -1
      },
      {
        name: 'Fecha Me',
        selector: 'fecha_me',
        sortable: true,
      },
      {
        name: 'Origen',
        selector: 'origen',
        sortable: true,
        wrap: true
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
        name: 'Dependencia',
        selector: 'dependencia',
        sortable: true,
        wrap: true
      },
      {
        name: 'Acciones',
        cell: row =>
          <div>
            <button
              className="btn btn-sm btn-link text-primary"
              onClick= {()=> this.handleViewExpediente(row)}
              data-toggle="modal" data-target="#viewExpedienteModal">
              <FontAwesomeIcon icon="eye"/>
            </button>
            <button className="btn btn-sm btn-link text-primary">
              <FontAwesomeIcon icon="print"/>
            </button>
          </div>,
        button: true,
      }
    ];
    const paginationOptions = {
      noRowsPerPage: true,
      rangeSeparatorText: 'de',
      selectAllRowsItem: true,
      selectAllRowsItemText: 'Todos'
    };
    return (
      <div>
        <div>

          {/*Tabla de lista de expediente*/}
          <DataTable
            columns={columns}
            data={this.state.list}
            defaultSortField="fecha me"
            progressPending={this.state.loading}
            pagination
            paginationServer
            paginationPerPage={20}
            paginationTotalRows={this.state.totalRows}
            paginationComponentOptions={paginationOptions}
            onChangePage={this.handlePageChange}
            highlightOnHover={true}
            noHeader={true}
            dense={true}
            className="table-responsive table-sm table-bordered"
          />
        </div>
        
        {/*Modal para ver tipo de expediente con sus rutas*/}
        <VerExpediente
          estado = {this.state.estado}
          origen = {this.state.origen}
          dependenciaActual = {this.state.dependenciaActual}
          numero = {this.state.numero}
          fecha = {this.state.fecha}
          objetoDeGasto = {this.state.objetoDeGasto}
          descripcion = {this.state.descripcion}
          tipoDeExpediente = {this.state.tipoDeExpediente}
          />
      </div>
    );
  }
}

export default Reporte;