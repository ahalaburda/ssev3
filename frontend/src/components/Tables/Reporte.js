import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";
import VerExpediente from "../Forms/VerExpediente";
import InstanciaService from "../../services/Instancias";
import Popups from "../Popups";
import moment from 'moment';
import Select from "react-select";
import DependenciasService from "../../services/Dependencias";
import ObjetosDeGastosService from "../../services/ObjetosDeGastos";
import ComentarioService from "../../services/Comentarios";
import helper from "../../utils/helper";
import DatePicker, {registerLocale} from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
registerLocale('es', es);


/**
 * Tabla para reportes
 */
class Reporte extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      totalRows: 0,
      startDate: new Date(),
      endDate: new Date(),
      formattedStartDate: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`,
      formattedEndDate: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`,
      origen: [],
      origenSelected: '',
      objetoDeGasto: [],
      objetoSelected: '',
      description: '',
      estado: '',
      recorrido:[],
      comentarios: []
    };
     
  }

  componentDidMount() {
    this.retrieveDependencias();
    this.retrieveObjetosDeGastos();
  }


   /**
   * De acuerdo a los filtros aplicados, se encarga de cargar los expedientes a mostrar
   * @param  response 
   */
  setListFromResponse = response => {
    this.setState({
      data: response.data.results.map(exp => {
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
      loading: false,
      totalRows: response.data.count
    });
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
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
      comentarios: [],
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
        verDependencia: row.dependencia,
        verTipo: row.tipo,
        verObjetoDeGasto: response.data.results.map(exp =>{
          return ( exp.expediente_id.objeto_de_gasto_id  ?
            exp.expediente_id.objeto_de_gasto_id.descripcion : 'Sin Objeto de Gasto')
        }) 
      });
    })
    .catch((e) => {
      Popups.error('Ocurrio un error durante la busqueda.');
      console.log(`Error handleViewExpediente: InstanciaService\n${e}`);
    }); 
    
    //Obtiene todas las instancias del expediente a traves de su ID y las carga en una tabla
    InstanciaService.getInstanciasPorExp(row.id, '')
    .then((response) =>{
      this.setState({
        recorrido: response.data.results.map((instancia) =>{
          return {
            id: instancia.id,
            fecha: moment(instancia.fecha_creacion).isValid() ?
            moment(instancia.fecha_creacion).format('DD/MM/YYYY') : 'Sin fecha',
            dependencia: instancia.dependencia_actual_id.descripcion,
            estado: instancia.estado_id.id
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
              id: comentario.id,
              estado: comentario.instancia.estado_id.id,
              fecha: moment(comentario.fecha_creacion).isValid() ?
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
   * Obtiene todas las dependencias de la base de datos y los carga como opciones para el select
   */
  retrieveDependencias() {
    DependenciasService.getAllSinPag()
      .then((response) => {
        this.setState({
          origen: response.data.map((d) => {
            return {
              id: d.id,
              value: d.descripcion,
              label: d.descripcion,
            }
          })
        })
      })
      .catch((e) => {
        Popups.error('Ocurrió un error al procesar la información');
        console.log(`Error retrieveDependencias:\n${e}`);
      });
  }

  /**
   * Obtiene los objetos de gastos de la base de datos y los carga como opciones para el select
   */
  retrieveObjetosDeGastos() {
    ObjetosDeGastosService.getAllNoPag()
      .then((response) => {
        this.setState({
          objetoDeGasto: response.data.map((d) => {
            return {
              id: d.id,
              value: d.descripcion,
              label: d.descripcion,
            }
          })
        })     
      })
      .catch(e => {
        Popups.error('Ocurrio un error al procesar la información');
        console.log(`Error retrieveObjetosDeGastos:\n${e}`);
      })
  }

  //funcion para setear el estado 'description' con el valor ingresadoa traves del campo filtrar por descripcion
  handleDescriptionChange = e => {
    this.setState({description: e.target.value});
  }

  /**
   * Si el usuario selecciona algun origen lo almacena,
   * si no deja el campo vacio para la busqueda
   * @param {*} origen 
   */
  setOrigen = origen => {
    if (origen != null) {
      this.setState({origenSelected: origen.value});  
    }  else {
      this.setState({origenSelected: ''})
    }
  }

  /**
   * Si el usuario selecciona algun objeto de gasto lo almacena,
   * si no deja el campo vacio para la busqueda
   * @param {*} objeto 
   */
  setObjetoGasto = objeto => {
    if (objeto != null ) {
      this.setState({objetoSelected : objeto.value})
    }  else {
      this.setState({objetoSelected: ''})
    }
  }

  /**
   * Toma la pagina de la tabla y llama a findExp para traer los expedientes,
   * siempre teniendo en cuanta los filtros aplicados con anterioridad
   * @param {*} page 
   */
  handlePageChange= page =>{
    this.findExp(this.state.formattedStartDate, this.state.formattedEndDate, this.state.origenSelected, this.state.objetoSelected,
      this.state.description, this.state.estado,  page);
  }

  /**
   * Toma los valores de los parametros pasados y ejecuta el servicio de busqueda de Expedientes
   * @param {*} fecha_desde 
   * @param {*} fecha_hasta 
   * @param {*} origen 
   * @param {*} objeto 
   * @param {*} description 
   * @param {*} estado 
   * @param {*} page 
   */
  findExp = (fecha_desde,fecha_hasta,origen, objeto, description,estado,page) => {
    InstanciaService.getExpForReportes(fecha_desde, fecha_hasta, origen, objeto, description, estado,page)
      .then(response => {
        if (response.data.count === 0) {
          Popups.error('Expediente(s) no encontrado(s).');
        } else {
          this.setListFromResponse(response);
        }
      })
      .catch((e) => {
        Popups.error('Ocurrio un error durante la busqueda.');
        console.log(`Error findByExp: InstanciaService\n${e}`);
      });
  }
  
  /**
   * Metodo que ejecuta el servicio findExp teniendo en cuenta el estado que se solicita en el filtro,
   * teniendo en cuenta los demas filtros si es que se utilizo alguno 
   * @param {*} changeEvent 
   */
  handleSearch = changeEvent => { 
    this.setState({estado: changeEvent.target.value});
    switch (changeEvent.target.value) {
      case helper.getEstado().RECIBIDO:
        this.findExp(this.state.formattedStartDate, this.state.formattedEndDate, this.state.origenSelected,
          this.state.objetoSelected, this.state.description, helper.getEstado().RECIBIDO, 1);
        break;
      case helper.getEstado().REANUDADO:
        this.findExp(this.state.formattedStartDate, this.state.formattedEndDate, this.state.origenSelected,
          this.state.objetoSelected, this.state.description, helper.getEstado().REANUDADO, 1);
        break;
      case helper.getEstado().NORECIBIDO:
        this.findExp(this.state.formattedStartDate, this.state.formattedEndDate, this.state.origenSelected,
          this.state.objetoSelected, this.state.description, helper.getEstado().NORECIBIDO, 1);
        break;  
      case helper.getEstado().PAUSADO:
        this.findExp(this.state.formattedStartDate, this.state.formattedEndDate, this.state.origenSelected,
          this.state.objetoSelected, this.state.description, helper.getEstado().PAUSADO, 1);
        break;
      case helper.getEstado().FINALIZADO:   
        this.findExp(this.state.formattedStartDate, this.state.formattedEndDate, this.state.origenSelected,
          this.state.objetoSelected, this.state.description, helper.getEstado().FINALIZADO, 1);
        break;
      case 'Todos':
        this.findExp(this.state.formattedStartDate, this.state.formattedEndDate, this.state.origenSelected,
          this.state.objetoSelected, this.state.description, '', 1);
        break;    
      default:
        this.findExp(this.state.formattedStartDate, this.state.formattedEndDate, this.state.origenSelected,
          this.state.objetoSelected, this.state.description, '', 1);
        break;
    }   
  }

  /**
   * Funcion que toma la fecha pasada a traves del campo de filtra fecha desde y lo setea en el estado startDate
   * para que funcione el filtro por rango de fecha y
   * setea el estado formattedStartDate en un formato legible para la api
   * @param {*} date 
   */
  setStartDate = (date) =>{
    this.setState({startDate: date })
    if (date != null) { 
      this.setState({formattedStartDate:`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`})  
    }else{
      this.setState({formattedStartDate:''})
    }
    
  }

  /**
   * Funcion que toma la fecha pasada a traves del campo de filtr fecha hasta y lo setea en el estado endDate
   * para que funcione el filtro por rango de fecha y
   * setea el estado formattedEndtDate en un formato legible para la api
   * @param {*} date 
   */
  setEndDate = (date) =>{
    this.setState({endDate: date});
    if (date != null) { 
      this.setState({formattedEndDate:`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`})  
    } else{
      this.setState({formattedEndDate:''});
    }
  }

  //Funcion para imprimir la tabla
  printTable = () =>{
    window.print();
  }
  
  /**
   * Obtiene los datos de la fila de la tabla a traves de row y luego
   * los escribe en un frameContent para poder imprimirlos
   * @param {*} row 
   */
  printExp = (row) =>{  
    let printDoc = document.getElementById("ifmcontentstoprint").contentWindow;
    printDoc.document.open();
    printDoc.document.write(`<Strong>Expediente N°${row.numero}</Strong><br>`);
    printDoc.document.write(`<Strong>ID:</Strong> ${row.id}<br>`);
    printDoc.document.write(`<Strong>Fecha:</Strong> ${row.fecha_me}<br>`);
    printDoc.document.write(`<Strong>Origen:</Strong> ${row.origen}<br>`);
    printDoc.document.write(`<Strong>Tipo de Expediente:</Strong> ${row.tipo}<br>`);
    printDoc.document.write(`<Strong>Descripción:</Strong> ${row.descripcion}<br>`);
    printDoc.document.write(`<Strong>Estado:</Strong> ${row.estado}<br>`);
    printDoc.document.write(`<Strong>Dependencia Actual:</Strong> ${row.dependencia}<hr>`);
    printDoc.document.close();
    printDoc.focus();
    printDoc.print();
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
        wrap: true
      },
      {
        name: 'Origen',
        selector: 'origen',
        sortable: true,
        wrap: true
      },
      {
        name: 'Tipo de Expediente',
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
            case "Reanudado":
              return <div className="badge badge-custom">{row.estado}</div>    
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
        selector: 'dependencia',
        sortable: true,
        wrap: true
      },
      {
        name: 'Acciones',
        cell: row =>
          <div className='oculto-impresion'>
            <button
              className="btn btn-sm btn-link text-primary"
              onClick= {()=> this.handleViewExpediente(row)}
              data-toggle="modal" data-target="#viewExpedienteModal">
              <FontAwesomeIcon icon="eye"/>
            </button>
            <button
            onClick = {()=>this.printExp(row)}   
            className="btn btn-sm btn-link text-info">
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
      <>
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0 text-gray-800">Reportes</h1>
        </div>
          <div className= "col-12 oculto-impresion">
            <div className='row'>
              <div className= "col-md-4">
                <div className="row">
                  <label className="col-form-label col-sm-8 font-weight-bold" name='filtroPorFecha'>Filtrar por fecha: </label>
                  <div className='col-md-6'>
                    <div className="form-group row">
                      <label className="col-form-label col-sm-3" name='fechaDesde'>Desde:</label>
                      <div  className = "col-md-9 ">
                      <DatePicker
                        className = "form-control"
                        locale = "es"
                        dateFormat = "dd/MM/yyyy"                     
                        isClearable
                        selected = {this.state.startDate}
                        onChange = {date => this.setStartDate(date)}
                        selectsStart
                        startDate = {this.state.startDate}
                        endDate = {this.state.endDate}
                        value = {this.state.startDate} 
                      />
                      </div>
                      
                    </div>
                  </div>
                  
                  <div className='col-md-6'>
                    <div className="form-group row">
                    <label className="col-form-label col-sm-3" name='fechaHasta'>Hasta:</label>
                    <div className = "col-md-9 ">
                    <DatePicker
                    className='form-control'
                      locale = "es"  
                      dateFormat = "dd/MM/yyyy"           
                      isClearable
                      selected = {this.state.endDate}
                      onChange = {date => this.setEndDate(date)}
                      selectsEnd
                      startDate = {this.state.startDate}
                      minDate = {this.state.startDate}
                      endDate = {this.state.endDate}
                      value = {this.state.endDate}
                    />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className= "col-md-3">
              <label className="col-form-label m-0 font-weight-bold" name='filtroPorOrigen'>Filtrar por Origen: </label>
              <div className="form-group row">
                <label className=" col-form-label col-sm-3">Origen: </label>
                  <div className="col-md-9">
                    <Select
                      options = {this.state.origen}
                      placeholder = "Selecciona..."
                      name = "selectOrigen" 
                      value= {this.state.origenSelected.value}
                      onChange = {origen => this.setOrigen(origen)}                  
                      isClearable ="True"
                      isSearchable ="True"                  
                    />
                  </div>
              </div>
            </div>

            <div className= "col-md-3">
              <label className="col-form-label m-0 font-weight-bold" name='filtroPorObjeto'>Filtrar por Objeto: </label>
              <div className="form-group row">
                <label className="col-form-label col-sm-3">Objeto: </label>
                  <div className="col-md-9">
                    <Select
                      options = {this.state.objetoDeGasto} 
                      placeholder = "Selecciona..."
                      name = "selectObjeto"
                      value =  {this.state.objetoSelected.label}
                      onChange = {objeto => this.setObjetoGasto(objeto)}
                      isClearable="True" 
                      isSearchable="True"
                    />
                  </div>             
              </div>
            </div>

            <div className='col-md-2'>
              <label className="col-form-label m-0 font-weight-bold">Filtrar por Descripción: </label>
              <input
                type="text"
                name='description'
                className="form-control form-control-sm-1"
                onChange={e => this.handleDescriptionChange(e)}
              />           
            </div>
          </div>
          
          <div className='col-md-12'>   
            <div className='row'>  
              <div className='card-header py-3 col-md-9'>
              <div className="btn-group ml-auto">
                  <label className="btn btn-sm btn-dark shadow-sm">
                    <input type='radio' id='todos' value='' 
                    name="options" checked={this.state.estado === ''} onChange={this.handleSearch} />
                    {this.state.estado === '' && <FontAwesomeIcon id="todosIcon" icon="check"/>}
                    &nbsp;Todos
                  </label>
                  <label className="btn btn-sm btn-success shadow-sm">
                    <input type='radio' id='recibidos' value={helper.getEstado().RECIBIDO} 
                    name="options" checked={this.state.estado === helper.getEstado().RECIBIDO} onChange={this.handleSearch} />
                    {this.state.estado === helper.getEstado().RECIBIDO &&
                      <FontAwesomeIcon id="recibidosIcon" icon="check"/>}&nbsp;Recibidos
                  </label>
                  <label className="btn btn-sm btn-custom shadow-sm">
                    <input type='radio' id='reanudados' value={helper.getEstado().REANUDADO} 
                    name="options" checked={this.state.estado === helper.getEstado().REANUDADO} onChange={this.handleSearch} />
                    {this.state.estado === helper.getEstado().REANUDADO &&
                      <FontAwesomeIcon id="reaundadosIcon" icon="check"/>}&nbsp;Reanudados
                  </label>
                  <label className="btn btn-sm btn-warning shadow-sm">
                    <input type='radio' id='noRecibidos' value={helper.getEstado().NORECIBIDO} 
                    name="options" checked={this.state.estado === helper.getEstado().NORECIBIDO} onChange={this.handleSearch} />
                     {this.state.estado === helper.getEstado().NORECIBIDO &&
                    <FontAwesomeIcon id="noRecibidosIcon" icon="check"/>}&nbsp;No Recibidos
                  </label>
                  <label className="btn btn-sm btn-dark shadow-sm">
                    <input type='radio' id='pausados' value={helper.getEstado().PAUSADO} 
                    name="options" checked={this.state.estado === helper.getEstado().PAUSADO} onChange={this.handleSearch} />
                    {this.state.estado === helper.getEstado().PAUSADO &&
                    <FontAwesomeIcon id="pausadosIcon" icon="check"/>}&nbsp;Pausados
                  </label>
                  <label className="btn btn-sm btn-secondary shadow-sm">
                    <input type='radio' id='finalizados' value={helper.getEstado().FINALIZADO} 
                    name="options" checked={this.state.estado === helper.getEstado().FINALIZADO} onChange={this.handleSearch} />
                    {this.state.estado === helper.getEstado().FINALIZADO &&
                    <FontAwesomeIcon id="finalizadosIcon" icon="check"/>}&nbsp;Finalizados
                  </label>

                </div>              
              </div>   

              <div className="py-3 col-md-3 text-right">
                <button
                  onClick= {()=>this.printTable()}
                  className="btn btn-sm btn-info"
                > <FontAwesomeIcon icon="print"/>Imprimir
                </button>
                <button
                  value=''
                  className="btn btn-sm btn-primary"
                  onClick={this.handleSearch}
                > <FontAwesomeIcon icon="search"/>Buscar
                </button>
              </div> 
            </div>
          </div>

        </div> 
        <div>

          {/*Tabla de lista de expediente*/}
          <DataTable
            columns={columns}
            data={this.state.data}
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
      </>
    );
  }
}

export default Reporte;