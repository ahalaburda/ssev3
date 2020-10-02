import React, {Component} from "react";
import ExpedienteService from "../../services/Instancias";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";
import moment from "moment";
import Popups from "../Popups";

/**
 * Tabla para reportes
 */
class Reporte extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      list: [],
      totalRows: 0
    };
    this.retrieveExpedientes = this.retrieveExpedientes.bind(this);
  }

  // Para la primera carga siempre trae la pagina 1 (uno)
  componentDidMount() {
    this.retrieveExpedientes();
  }

  setListFromResponse = response => {
    this.setState({
      list: response.data.results.map(exp => {
        return {
          id: exp.expediente_id.id,
          numero: exp.expediente_id.numero_mesa_de_entrada + "/" + exp.expediente_id.anho,
          fecha_me: moment(exp.expediente_id.fecha_mesa_entrada).isValid() ?
            moment(exp.expediente_id.fecha_mesa_entrada).format('DD/MM/YYYY - kk:mm:ss') : 'Sin fecha',
          origen: exp.expediente_id.dependencia_origen_id.descripcion,
          tipo: exp.expediente_id.tipo_de_expediente_id.descripcion,
          descripcion: exp.expediente_id.descripcion,
          estado: exp.estado_id.descripcion,
          dependencia: exp.dependencia_actual_id.descripcion
        }
      }),
      loading: false
    });
  }

  /**
   * Obtener expedientes de la base de datos y cargarlos en la tabla
   */
  retrieveExpedientes() {
    this.setState({loading: true});
    ExpedienteService.getAll()
      .then(response => {
        if (response.data.count > 0) {
          this.setListFromResponse(response);
          this.setState({totalRows: response.data.count});
        } else {
          this.setState({loading: false});
          Popups.error('No se encontro ningun expediente');
        }
      })
      .catch(e => {
        Popups.error('Ocurrio un error al obtener los expedientes.');
        console.log(`Error retrieveExpedientes:\n${e}`);
      })
  }

  handlePageChange = page => {
    this.retrieveExpedientes(page);
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
              return <div className="badge badge-primary">{row.estado}</div>
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
              data-toggle="modal" data-target="#viewTipoExpedienteModal">
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
      </div>
    );
  }
}

export default Reporte;