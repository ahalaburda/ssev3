import React, {Component} from "react";
import DataTable from "react-data-table-component";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { EmptyTable } from "./EmptyTable";
import moment from "moment";
import InstanciaService from "../../services/Instancias";
import VerExpediente from "../Forms/VerExpediente";
import ComentarioService from "../../services/Comentarios";
import Popups from "../Popups";

class Consulta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      mensaje : '',
      recorrido:[]
    }
  }

  // componentWillReceiveProps(nextProps, nextContext) {
  //   this.setState({list: nextProps.data})
  // }

  //reemplazo de funcion componentWillReceiveProps
  static getDerivedStateFromProps(nextProps) {
    return {
      list: nextProps.data,
      mensaje: nextProps.mensaje
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
    printDoc.document.write(`<Strong>Destino:</Strong> ${row.destino}<br>`);
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
              moment(instancia.fecha_creacion).format('DD/MM/YYYY') : 'Sin fecha',
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
        <DataTable
          columns={columns}
          data={this.state.list}
          pagination
          paginationComponentOptions={paginationOptions}
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