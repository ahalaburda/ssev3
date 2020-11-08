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
    };
     
  }


  componentDidMount() {
    this.retrieveDependencias();
    this.retrieveObjetosDeGastos();
    this.findExp('','','','','','',1);
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


  handleViewExpediente =row=>{
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
          return exp.expediente_id.objeto_de_gasto_id.descripcion
        })
      });
    })
    
  }

  /**
   * Obtiene todas las dependencias de la base de datos y los carga como opciones para el select
   */
  retrieveDependencias() {
    DependenciasService.getAll()
      .then((response) => {
        this.setState({
          origen: response.data.results.map((d) => {
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
    ObjetosDeGastosService.getAll(1)
      .then((response) => {
        this.setState({
          objetoDeGasto: response.data.results.map((d) => {
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
  
  handlePageChange= page =>{
    this.findExp(this.state.formattedStartDate, this.state.formattedEndDate, this.state.origenSelected, this.state.objetoSelected,
      this.state.description, this.state.estado,  page);
  }
  /**
   * Toma el origen, objeto de gasto y descripcion pasada y 
   * ejecuta el servicio de busqueda de reportes.
   * @param {*} origen 
   * @param {*} objeto 
   * @param {*} description 
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
  
  handleSearch = (estado) => { 
    this.setState({estado: estado})
    this.findExp(this.state.formattedStartDate, this.state.formattedEndDate, this.state.origenSelected,
      this.state.objetoSelected, this.state.description, estado, 1);
      
  }

  setDateFormat = () =>{
    this.setState({formattedStartDate:`${this.state.startDate.getFullYear()}-
    ${this.state.startDate.getMonth()+1}-${this.state.startDate.getDate()}`})
  }

  setStartDate = (date) =>{
    this.setState({startDate: date })
    if (date != null) { 
      this.setState({formattedStartDate:`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`})  
    }else{
      this.setState({formattedStartDate:''})
    }
    
  }

  setEndDate = (date) =>{
    this.setState({endDate: date});
    if (date != null) { 
      this.setState({formattedEndDate:`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`})  
    } else{
      this.setState({formattedEndDate:''});
    }
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
      <>
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0 text-gray-800">Reportes</h1>
        </div>
          <div className= "col-12">
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
                    <button type="button" className="btn btn-sm btn-success shadow-sm" onClick={val => this.handleSearch('recibido')}>Recibido</button>
                    <button type="button" className="btn btn-sm btn-warning shadow-sm" onClick={val => this.handleSearch('no recibido')}>No Recibido</button>
                    <button type="button" className="btn btn-sm btn-info shadow-sm" onClick={val => this.handleSearch('derivado')}>Derivado</button>
                    <button type="button" className="btn btn-sm btn-dark shadow-sm" onClick={val => this.handleSearch('pausado')}>Pausado</button>
                    <button type="button" className="btn btn-sm btn-danger shadow-sm" onClick={val => this.handleSearch('rechazado')}>Rechazado</button>
                    <button type="button" className="btn btn-sm btn-secondary shadow-sm" onClick={val => this.handleSearch('finalizado')}>Finalizado</button>                       
                </div>               
              </div>   

              <div className="py-3 col-md-3 text-right">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={estado => this.handleSearch('')}
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
            defaultSortField="id"
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
          verEstado = {this.state.verEstado}
          verOrigen = {this.state.verOrigen}
          verDependencia = {this.state.verDependencia}
          verNumero = {this.state.verNumero}
          verFecha = {this.state.verFecha}
          verObjetoDeGasto = {this.state.verObjetoDeGasto}
          verDescripcion = {this.state.verDescripcion}
          verTipo = {this.state.verTipo}
          />
      </>
    );
  }
}

export default Reporte;