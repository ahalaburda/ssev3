import React, {Component} from "react";
import InstanciaService from "../../services/Instancias";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";
import NuevoExpediente from "../Forms/NuevoExpediente";
import helper from "../../utils/helper";
import moment from "moment";
import Popups from "../Popups";
import ProcesarExpediente from "../Forms/ProcesarExpediente";

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
      showProcess: false,
      expedienteData: helper.getInstanciaInitialState(),
      list: [],
      totalRows: 0
    };
    this.retrieveExpedientes = this.retrieveExpedientes.bind(this);
    this.setShowNew = this.setShowNew.bind(this);
    // this.interval = setInterval(() => {
    //   this.retrieveExpedientes(1);
    // }, 5000);
  }

  // Para la primera carga siempre trae la pagina 1 (uno)
  componentDidMount() {
    this.retrieveExpedientes(1);
  }

  // componentWillUnmount() {
  //   clearInterval(this.interval);
  // }

  /**
   * De acuerdo al response pasado del servicio, este setea la lista de expedientes del estado.
   * @param response
   */
  setListFromResponse = response => {
    this.setState({
      list: response.data.results.map(inst => {
        return {
          id: inst.expediente_id.id,
          numero: inst.expediente_id.numero_mesa_de_entrada === 0 ? 'Sin nro.' :
            inst.expediente_id.numero_mesa_de_entrada + "/" + inst.expediente_id.anho,
          fecha_me: moment(inst.expediente_id.fecha_mesa_entrada).isValid() ?
            moment(inst.expediente_id.fecha_mesa_entrada).format('DD/MM/YYYY - kk:mm:ss') : 'Sin fecha',
          origen: inst.expediente_id.dependencia_origen_id.descripcion,
          tipo: inst.expediente_id.tipo_de_expediente_id.descripcion,
          descripcion: inst.expediente_id.descripcion,
          estado: inst.expediente_id.estado_id.descripcion,
          dependencia: inst.dependencia_actual_id.descripcion
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
    InstanciaService.getInstanciaExpedienteEachUser(1)
      .then(response => {
        if (response.data.count > 0) {
          this.setListFromResponse(response);
          this.setState({totalRows: response.data.count});
        } else {
          this.setState({loading: false});
          Popups.error('No existen expedientes en su dependencia.');
        }
      })
      .catch(e => {
        Popups.error('Ocurrio un error al obtener los expedientes.');
        console.log(`Error retrieveExpedientes:\n${e}`);
      });
  }

  /**
   * Toma la pagina correspondiente de la tabla y llama al metodo retrieveExpedientes para traer los respectivos
   * expedientes.
   * @param page
   */
  handlePageChange = page => {
    this.retrieveExpedientes(page);
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
   * Setear el estado 'showNew' para mostrar u ocultar el modal de nuevo expediente
   */
  setShowNew = show => {
    this.setState({showNew: show});
  }

  /**
   * Setear el esatado 'showProcess' para mostrar u ocultar modal de procesar expediente y limpiar los datos
   * previamente enviados al modal
   */
  setShowProcess = show => {
    this.setState({
      showProcess: show,
      expedienteData: helper.getInstanciaInitialState()
    });
  }

  handleProcessExpediente = expId => {
    this.setShowProcess(true);
    InstanciaService.getByExpedienteId(expId)
      .then(response => {
        this.setState({
          expedienteData: response.data.results[0]
        });
      })
      .catch(e => {
        console.log(`Error handleProcessExpediente\n${e}`);
      });
  }

  render() {
    // columnas para la tabla
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
              return <div className="badge badge-primary">{row.estado}</div>
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
              title="Procesar expediente"
              onClick={() => this.handleProcessExpediente(row.id)}>
              <FontAwesomeIcon icon="pencil-alt"/>
            </button>
            <button
              className="btn btn-sm btn-link text-primary"
              title="Ver expediente">
              <FontAwesomeIcon icon="eye"/>
            </button>
            <button
              className="btn btn-sm btn-link text-primary"
              title="Comentar expediente">
              <FontAwesomeIcon icon="comment"/>
            </button>
          </div>,
        button: true,
      }
    ];

    // configuraciones de paginacion
    const paginationOptions = {
      noRowsPerPage: true,
      rangeSeparatorText: 'de',
      selectAllRowsItem: true,
      selectAllRowsItemText: 'Todos'
    };
    return (
      <div>
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0 text-gray-800">Expedientes</h1>
          <button className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                  onClick={() => this.setShowNew(true)}>
            <FontAwesomeIcon icon="plus" size="sm" className="text-white-50"/>&nbsp;Nuevo
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
          <NuevoExpediente
            setShow={this.setShowNew}
            showModal={this.state.showNew}
            newItem={this.addItem}
          />
          <ProcesarExpediente
            setShow={this.setShowProcess}
            showModal={this.state.showProcess}
            expedienteData={this.state.expedienteData}
          />
        </div>
      </div>
    );
  }
}

export default Expediente;