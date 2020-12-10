import React, {Component} from "react";
import InstanciaService from "../../services/Instancias";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";
import NuevoExpediente from "../Forms/NuevoExpediente";
import helper from "../../utils/helper";
import moment from "moment";
import Popups from "../Popups";
import ProcesarExpediente from "../Forms/ProcesarExpediente";
import "../../styles/table.css";
import VerExpediente from "../Forms/VerExpediente";
import ComentarioService from "../../services/Comentarios";

/**
 * Tabla para expedientes
 */
class Expediente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showNew: false,
      showProcess: false,
      expedienteData: helper.getInstanciaInitialState(),
      list: [],
      totalRows: 0,
      selectedOption: 'Todos',
      recorrido:[]
    };
    this.setShowNew = this.setShowNew.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    // this.interval = setInterval(() => {
    //   this.retrieveExpedientes(1);
    // }, 5000);
  }

  // Para la primera carga siempre trae la pagina 1 (uno)
  componentDidMount() {
    this.filterExpedientes(1, '');
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
          tipoExpediente: inst.expediente_id.tipo_de_expediente_id.descripcion,
          descripcion: inst.expediente_id.descripcion,
          estado: inst.expediente_id.estado_id.descripcion,
          dependenciaActual: inst.dependencia_actual_id.descripcion
        }
      }),
      loading: false
    });
  }

  /**
   * Servicio que llama a la API para traer las ultimas instancias de acuerdo al usuario logueado y el estado
   * proporcionado.
   * @param page Pagina
   * @param state Estado del expediente
   * @returns {Promise<AxiosResponse<Instancia>>}
   */
  getInstanciasExpedientes = (page, state) => {
    return InstanciaService.getInstanciaExpedienteEachUser(page, state);
  }

  /**
   * Toma la pagina correspondiente de la tabla y llama al metodo filterExpedientes para traer los respectivos
   * expedientes de acuerdo al estado seleccionado (todos, recibido, no recibido, pausado).
   * @param page
   */
  handlePageChange = page => {
    switch (this.state.selectedOption) {
      case helper.getEstado().NORECIBIDO:
        this.filterExpedientes(page, helper.getEstado().NORECIBIDO);
        break;
      case helper.getEstado().RECIBIDO:
        this.filterExpedientes(page, helper.getEstado().RECIBIDO);
        break;
      case helper.getEstado().PAUSADO:
        this.filterExpedientes(page, helper.getEstado().PAUSADO);
        break;
      case 'Todos':
        this.filterExpedientes(page, '');
        break;
      default:
        this.filterExpedientes(page, '');
    }
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

  handleOptionChange = changeEvent => {
    this.setState({selectedOption: changeEvent.target.value});
    switch (changeEvent.target.value) {
      case helper.getEstado().NORECIBIDO:
        this.filterExpedientes(1, helper.getEstado().NORECIBIDO);
        break;
      case helper.getEstado().RECIBIDO:
        this.filterExpedientes(1, helper.getEstado().RECIBIDO);
        break;
      case helper.getEstado().PAUSADO:
        this.filterExpedientes(1, helper.getEstado().PAUSADO);
        break;
      case 'Todos':
        this.filterExpedientes(1, '');
        break;
      default:
        this.filterExpedientes(1, '');
    }
  }

  filterExpedientes = (page, state) => {
    this.setState({loading: true});
    this.getInstanciasExpedientes(page, state)
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
        console.log(`Error filterExpedientes:\n${e}`);
        Popups.error('Ocurrio un error al obtener los expedientes');
      });
  }

  /**
   * Setea los estados utilizados para mostrar los datos en el modal de Ver Expediente
   */
  cleanModal= ()=> {
    this.setState({
      verNumero: '',
      verFecha: '',
      verDescripcion: '',
      verObjetoDeGasto: '',
      verEstado: '',
      verOrigen: '',
      verDependencia: '',
      verTipo: '',
      recorrido: [],
      comentarios: '',
    })
  }

  /**
   * Funcion para cargar los datos del expediente seleccionado al modal 
   */
  handleViewExpediente =row=>{
    this.cleanModal();  
    //Se trae el expediente via ID y se muestra en pantalla los datos del mismo
    InstanciaService.getByExpedienteId(row.id)
    .then(response =>{
      this.setState({
        verNumero: row.numero,
        verDescripcion: row.descripcion,
        verFecha: row.fecha_me,
        verEstado: row.estado,
        verOrigen: row.origen,
        verDependencia: row.dependenciaActual,
        verTipo: row.tipoExpediente,
        verObjetoDeGasto: response.data.results.map(exp =>{
          return ( exp.expediente_id.objeto_de_gasto_id ?
           exp.expediente_id.objeto_de_gasto_id.descripcion : 'Sin Objeto de Gasto')
        })  
      });
    })
    .catch((e) => {
      Popups.error('Ocurrio un error durante la busqueda.');
      console.log(`Error handleViewExpediente: InstanciaService\n${e}`);
    }); 
    
    //Obtiene todas las instancias del expediente a traves de su ID y las carga en una tabla
    InstanciaService.getInstanciasPorExp(row.id)
    .then((response) =>{
      this.setState({
        recorrido: response.data.results.map((instancia) =>{
          return  {
            id: instancia.id,
            fecha:moment(instancia.fecha_creacion).isValid() ?
              moment(instancia.fecha_creacion).format('DD/MM/YYYY') : 'Sin fecha',
            dependencia:instancia.dependencia_actual_id.descripcion
          }  
          
        })
      }) 
    }) 
    .catch((e) => {
      Popups.error('Ocurrio un error durante la busqueda.');
      console.log(`Error handleViewExpediente: InstanciaService\n${e}`);
    });   
 
    //Obtiene todos los comentarios de un expediente a traves de su ID y lo muestra en una tabla
    ComentarioService.getComentarioPorExpedienteID(row.id)
      .then((response) =>{
        this.setState({
          comentarios: response.data.results.map((comentario) =>{
            return{
              fecha_creacion: moment(comentario.fecha_creacion).isValid() ?
                moment(comentario.fecha_creacion).format('DD/MM/YYYY') : 'Sin fecha',
              dependencia: comentario.instancia.dependencia_actual_id.descripcion,
              comentario: comentario.descripcion
            }
          })
        })  
      })
      .catch((e) => {
        Popups.error('Ocurrio un error durante la busqueda.');
        console.log(`Error handleViewExpediente: ComentarioService\n${e}`);
      });  
      
  }

  /**
   * Setear el estado 'showNew' para mostrar u ocultar el modal de nuevo expediente. Cuando se cierra el modal vuelve a
   * llamar 'retrieveExpedientes' para que actualice la lista.
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
        wrap: true
      },
      {
        name: 'Origen',
        selector: 'origen',
        sortable: true,
        wrap: true
      },
      {
        name: 'Tipo de expediente',
        selector: 'tipoExpediente',
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
            case "Pausado":
              return <div className="badge badge-dark">{row.estado}</div>
            default:
              return <div className="badge badge-primary">{row.estado}</div>
          }
        }
      },
      {
        name: 'Dependencia actual',
        selector: 'dependenciaActual',
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
              title="Ver expediente"
              onClick= {()=> this.handleViewExpediente(row)}
              data-toggle="modal" data-target="#viewExpedienteModal">
              <FontAwesomeIcon icon="eye"/>
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
        <div className="d-sm-flex align-items-center justify-content-between mb-2">
          <h1 className="h3 text-gray-800">Expedientes</h1>
        </div>
        <div className="btn-toolbar mb-2 justify-content-between">
          <div className="btn-group mr-2">
            <label className="btn btn-sm btn-secondary">
              <input type="radio" id="todos" value="Todos" name="options"
                     checked={this.state.selectedOption === 'Todos'} onChange={this.handleOptionChange}/>
              {this.state.selectedOption === 'Todos' && <FontAwesomeIcon id="todosIcon" icon="check"/>}
              &nbsp;Todos
            </label>
            <label className="btn btn-sm btn-warning">
              <input type="radio" id="noRecibidos" value={helper.getEstado().NORECIBIDO} name="options"
                     checked={this.state.selectedOption === helper.getEstado().NORECIBIDO}
                     onChange={this.handleOptionChange}/>
              {this.state.selectedOption === helper.getEstado().NORECIBIDO &&
              <FontAwesomeIcon id="noRecibidosIcon" icon="check"/>}
              &nbsp;No Recibidos
            </label>
            <label className="btn btn-sm btn-success">
              <input type="radio" id="recibidos" value={helper.getEstado().RECIBIDO} name="options"
                     checked={this.state.selectedOption === helper.getEstado().RECIBIDO}
                     onChange={this.handleOptionChange}/>
              {this.state.selectedOption === helper.getEstado().RECIBIDO &&
              <FontAwesomeIcon id="recibidosIcon" icon="check"/>}
              &nbsp;Recibidos
            </label>
            <label className="btn btn-sm btn-dark">
              <input type="radio" id="pausados" value={helper.getEstado().PAUSADO} name="options"
                     checked={this.state.selectedOption === helper.getEstado().PAUSADO}
                     onChange={this.handleOptionChange}/>
              {this.state.selectedOption === helper.getEstado().PAUSADO &&
              <FontAwesomeIcon id="pausadosIcon" icon="check"/>}
              &nbsp;Pausados
            </label>
          </div>
          <div className="btn-group mb-2">
            <button className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                    onClick={() => this.setShowNew(true)}>
              <FontAwesomeIcon icon="plus" size="sm" className="text-white-50"/>&nbsp;Nuevo
            </button>
          </div>
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
          />
          <ProcesarExpediente
            setShow={this.setShowProcess}
            showModal={this.state.showProcess}
            expedienteData={this.state.expedienteData}
          />
           {/*Modal para ver el expediente con detalle*/}
          <VerExpediente
            verEstado = {this.state.verEstado}
            verOrigen = {this.state.verOrigen}
            verDependencia = {this.state.verDependencia}
            verNumero = {this.state.verNumero}
            verFecha = {this.state.verFecha}
            verObjetoDeGasto = {this.state.verObjetoDeGasto}
            verDescripcion = {this.state.verDescripcion}
            verTipo = {this.state.verTipo}
            verRecorrido = {this.state.recorrido}
            comentarios = {this.state.comentarios}
          />
        </div>
      </div>
    );
  }
}

export default Expediente;