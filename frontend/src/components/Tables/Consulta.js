import React, {Component} from "react";
import DataTable from "react-data-table-component";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { EmptyTable } from "./EmptyTable";
import moment from "moment";
import InstanciaService from "../../services/Instancias";
import VerExpediente from "../Forms/VerExpediente";
import ComentarioService from "../../services/Comentarios";
import Popups from "../Popups";
import SimpleReactValidator from 'simple-react-validator';
import {Tabs, Tab} from "react-bootstrap";
// import Consulta from "../../components/Tables/Consulta";


class Consulta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recorrido:[],
      data: [],
      id: '',
      description: '',
      num: '',
      year: '',
      totalRows: 0,
      mensaje: 'No hay expedientes que mostrar',
      isSearchByDescription: false
    }
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleNumChange = this.handleNumChange.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
    this.setStateFromResponse = this.setStateFromResponse.bind(this);
    this.handleIdSearch = this.handleIdSearch.bind(this);
    this.handleDescriptionSearch = this.handleDescriptionSearch.bind(this);
    this.handleYearNumSearch = this.handleYearNumSearch.bind(this);
    //opciones y mensajes para la validacion
    this.validator = new SimpleReactValidator({
      className: 'text-danger',
      messages: {
        numeric: 'Debe ingresar un número.',
        min: 'No valido.',
        max: 'Máximo 50 caracteres.',
        required: 'Este campo no puede estar vacío.'
      }
    });
  }
  

  /**
   * Setear el estado ID con el valor ingresado en el input.
   * Mostrar los mensajes de validacion correspondientes.
   * @param e
   */
  handleIdChange = e => {
    this.setState({id: e.target.value});
    this.validator.showMessageFor('id');
    this.validator.hideMessageFor('description');
    this.validator.hideMessageFor('numExp');
    this.validator.hideMessageFor('year');
  }

  /**
   * Setear el estado descripcion con el valor ingresado en el input.
   * Mostrar los mensajes de validacion correspondientes.
   * @param e
   */
  handleDescriptionChange = e => {
    this.setState({description: e.target.value});
    this.validator.showMessageFor('description');
    this.validator.hideMessageFor('id');
    this.validator.hideMessageFor('numExp');
    this.validator.hideMessageFor('year');
  }

  /**
   * Setear el estado numero de mesa de entrada con el valor ingresado en el input.
   * Mostrar los mensajes de validacion conrrespondientes.
   * @param e
   */
  handleNumChange = e => {
    this.setState({num: e.target.value});
    this.validator.showMessageFor('numExp');
    this.validator.hideMessageFor('id');
    this.validator.hideMessageFor('description');
  }

  /**
   * Setear el estado anho con el valor ingresado en el input.
   * Mostrar los mensajes de validacion correspondientes.
   * @param e
   */
  handleYearChange = e => {
    this.setState({year: e.target.value});
    this.validator.showMessageFor('year');
    this.validator.hideMessageFor('id');
    this.validator.hideMessageFor('description');
  }

  /**
   * Toma el ID pasado del estado y ejecuta el servicio para buscar un expediente por su ID.
   * @param id
   */
  findById = id => {
    InstanciaService.getByExpedienteId(id)
      .then(response => {
        this.setStateFromResponse(response);
      })
      .catch(e => {
        this.setState({
          data:[],
          mensaje: `ID no encontrado`
        })
        console.log(`Error findByExpedienteId: InstanciaService\n${e}`);
      });
  }

  /**
   * Chequea si las validaciones estan correctas y pasa el ID a la funcion findById.
   */
  handleIdSearch = () => {
    if (this.validator.fieldValid('id')) {
      this.findById(this.state.id);
      this.setState({
        isSearchByDescription: false
      })
    }
  }

  /**
   * Dado un response de Axios, este setea el estado con la lista de expedientes a mostrar.
   * @param response
   */
  setStateFromResponse = response => {
    //se controla el contador del response porque da codigo 200 aunque no encuentre ningun expediente
      this.setState({
        data: response.data.results.map(ie => {
          return {
            id: ie.expediente_id.id,
            numero: ie.expediente_id.numero_mesa_de_entrada + "/" + ie.expediente_id.anho,
            fechaMe: moment(ie.expediente_id.fecha_mesa_entrada).isValid() ?
              moment(ie.expediente_id.fecha_mesa_entrada).format('DD/MM/YYYY - kk:mm:ss') : 'Sin fecha',
            descripcion: ie.expediente_id.descripcion,
            origen: ie.expediente_id.dependencia_origen_id.descripcion,
            tipoExpediente: ie.expediente_id.tipo_de_expediente_id.descripcion,
            dependenciaActual: ie.dependencia_actual_id.descripcion,
            estado: ie.estado_id.descripcion
          }
        }),
        totalRows: response.data.count
      }); 
  }

  /**
   * Toma la descripcion pasada del estado y ejecuta el servicio de busqueda por descripcion.
   * @param description
   */
  findByDescription = (description, page) => {
    InstanciaService.getByExpDescription(description, page)
      .then(response => {
        if (response.data.count === 0) {
          this.setState({
            data: [],
            mensaje:`Descripción no encontrada`
          })
        } else {
          this.setStateFromResponse(response);
        }
      })
      .catch((e) => {
        Popups.error('Ocurrio un error durante la busqueda.');
        console.log(`Error findByDescription: InstanciaService\n${e}`);
      });
  }

  /**
   * Chequea si las validaciones estan correctas y pasa la descripcion a la funcioni findByDescription.
   */
  handleDescriptionSearch = () => {
    if (this.validator.fieldValid('description')) {
      this.findByDescription(this.state.description, 1);
      this.setState({
        isSearchByDescription: true
      })
    }
  }

  handlePageChange= page =>{
    if (this.state.isSearchByDescription) {
      this.findByDescription(this.state.description, page)
    }
  }
  /**
   * Toma el anho y el numero del estado y ejecuta el servicio de busqueda por anho y numero de mesa de entrada.
   * @param year
   * @param num
   */
  findByYearNum = (year, num) => {
    InstanciaService.getByExpYearNum(year, num)
      .then(response => {
        if (response.data.count === 0) {
          this.setState({
            data: [],
            mensaje:`Número de expediente/Año no encontrados`
          })
        } else {
          this.setStateFromResponse(response);
        }
      })
      .catch(e => {
        Popups.error('Ocurrio un error durante la búsqueda.');
        console.log(`Error findByExpYearNum: InstanciaService\n${e}`);
      });
  }

  /**
   * Chequea si las validaciones estan correctas y pasa el anho y la descripcion a la funcion findByYearNum.
   */
  handleYearNumSearch = () => {
    if (this.validator.fieldValid('numExp') && this.validator.fieldValid('year')) {
      this.setState({
        isSearchByDescription: false
      })
      this.findByYearNum(this.state.year, this.state.num);
    }
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
    printDoc.document.write(`<Strong>Tipo de Expediente:</Strong> ${row.tipoExpediente}<br>`);
    printDoc.document.write(`<Strong>Descripción:</Strong> ${row.descripcion}<br>`);
    printDoc.document.write(`<Strong>Estado:</Strong> ${row.estado}<br>`);
    printDoc.document.write(`<Strong>Dependencia Actual:</Strong> ${row.dependenciaActual}<hr>`);
    printDoc.document.close();
    printDoc.focus();
    printDoc.print();
  }

  /**
   * Funcion para cargar los datos del expediente seleccionado al modal 
   */
  handleViewExpediente =row=>{ 
      this.setState({
        verNumero: row.numero,
        verDescripcion: row.descripcion,
        verFecha: row.fechaMe,
        verEstado: row.estado,
        verOrigen: row.origen,
        verDependencia: row.dependenciaActual,
        verTipo: row.tipoExpediente, 
      });
    //Obtiene todas las instancias del expediente a traves de su ID 
    InstanciaService.getInstanciasPorExp(row.id, '')
    .then((response) =>{
      this.setState({
        recorrido: response.data.map((instancia) =>{
          return  {
            id: instancia.id,
            fecha:moment(instancia.fecha_creacion).isValid() ?
              moment(instancia.fecha_creacion).format('DD/MM/YYYY - kk:mm:ss') : 'Sin fecha',
            dependencia:instancia.dependencia_actual_id.descripcion,
            estado: instancia.estado_id.id
          }  
          
        })
      }) 
    }) 
    .catch((e) => {
      Popups.error('Ocurrio un error al cargar la información.');
      console.log(`Error handleViewExpediente: InstanciaService\n${e}`);
    });   
 
    //Obtiene todos los comentarios de un expediente a traves de su ID 
    ComentarioService.getComentarioPorExpedienteID(row.id)
      .then((response) =>{
        this.setState({
          comentarios: response.data.map((comentario) =>{
            return{
              id: comentario.id,
              instancia: comentario.instancia.id,
              comentario: comentario.descripcion
            }
          })
        })  
      })
      .catch((e) => {
        Popups.error('Ocurrio un error al cargar la información.');
        console.log(`Error handleViewExpediente: ComentarioService\n${e}`);
      });  
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
        name: 'Tipo de Expediente',
        selector: 'tipoExpediente',
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
              className="btn btn-sm btn-link text-primary"
              title="Ver expediente"
              onClick= {()=> this.handleViewExpediente(row)}
              data-toggle="modal" data-target="#viewExpedienteModal">
              <FontAwesomeIcon icon="eye"/>
            </button>
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
      <>
         <iframe title='conToPrint' id="consultasContentsToPrint" style={{display:'none'}}></iframe>
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0 text-gray-800">Consultas</h1>
        </div>
        <Tabs defaultActiveKey="byId" id="uncontrolled-tab-example">
          <Tab eventKey="byId" title="Buscar por ID">
            <div className="col-6">
              <div className="form-group row">
                <label className="col-form-label col-sm-4" name='numeroID'>Número ID: </label>
                <div className="col-5 input-group">
                  <input
                    type="number"
                    name='id'
                    className="form-control form-control-sm"
                    onChange={e => this.handleIdChange(e)}
                    onBlur={e => this.handleIdChange(e)}
                    value={this.state.id}
                  />
                  {this.validator.message('id', this.state.id, 'required|numeric|min:1,num')}
                </div>
                <div className="col text-center">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={this.handleIdSearch}
                  > Buscar
                  </button>
                </div>
              </div>
            </div>
          </Tab>
          <Tab eventKey="byDescription" title="Buscar por descripción">
            <div className="col-6">
              <div className="form-group row">
                <label className="col-form-label col-sm-4">Descripción: </label>
                <div className="col-5 ">
                  <textarea
                    className="form-control form-control-sm"
                    name='description'
                    onChange={e => this.handleDescriptionChange(e)}
                    onBlur={e => this.handleDescriptionChange(e)}
                    value={this.state.description}
                  />
                  {this.validator.message('description', this.state.description, 'required|max:50')}
                </div>
                <div className="col text-center">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={this.handleDescriptionSearch}
                  > Buscar
                  </button>
                </div>
              </div>
            </div>
          </Tab>
          <Tab eventKey="byNumber" title="Buscar por número">
            <div className="col-6">
              <div className="form-group row">
                <label className="col-form-label col-sm-4">Número de Expediente: </label>
                <div className="col-5 input-group">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="numExp"
                    onChange={e => this.handleNumChange(e)}
                    onBlur={e => this.handleNumChange(e)}
                    value={this.state.num}
                  />
                  {this.validator.message('numExp', this.state.num, 'required|numeric|min:1,num')}
                </div>

              </div>
              <div className="form-group row">
                <label className="col-form-label col-sm-4">Año: </label>
                <div className="col-5 input-group">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    name="year"
                    onChange={e => this.handleYearChange(e)}
                    onBlur={e => this.handleYearChange(e)}
                    value={this.state.year}
                  />
                  {this.validator.message('year', this.state.year, 'required|numeric|min:0,num')}
                </div>
                <div className="col text-center">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={this.handleYearNumSearch}
                  > Buscar
                  </button>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
        <DataTable
          columns={columns}
          data={this.state.data}
          pagination
          paginationServer
          paginationPerPage={20}
          paginationTotalRows={this.state.totalRows}
          paginationComponentOptions={paginationOptions}
          onChangePage={this.handlePageChange}
          highlightOnHover={true}
          noHeader={true}
          dense={true}
          noDataComponent={<EmptyTable mensaje={this.state.mensaje} />}
          className="table-responsive table-sm table-bordered"
        />
        {/*Modal para ver el expediente con detalle*/}
        <VerExpediente
        verEstado = {this.state.verEstado}
        verOrigen = {this.state.verOrigen}
        verDependencia = {this.state.verDependencia}
        verNumero = {this.state.verNumero}
        verFecha = {this.state.verFecha}
        verDescripcion = {this.state.verDescripcion}
        verTipo = {this.state.verTipo}
        verRecorrido = {this.state.recorrido}
        comentarios = {this.state.comentarios}
        />
      </>
    );
  }
}

export default Consulta;