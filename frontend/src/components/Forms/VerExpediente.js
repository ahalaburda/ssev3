import React, {Component} from "react";
import DataTable from "react-data-table-component";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class VerExpediente extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data:[],
        numero:'',
        descripcion:'',
        objetoDeGasto:'',
        fecha:'',
        estado:'',
        origen:'',
        dependenciaActual:'',
        tipoDeExpediente:'',
        movimiento:{
          fecha_creacion:'',
          dependencia:'',
          comentario:'hola'
        },
        comentarios: [],
        totalRows:0
    }
  }

  //reemplazo de funcion componentWillReceiveProps
  static getDerivedStateFromProps(nextProps) {
    return {
        numero: nextProps.verNumero,
        fecha: nextProps.verFecha,
        descripcion: nextProps.verDescripcion,
        objetoDeGasto: nextProps.verObjetoDeGasto,
        estado: nextProps.verEstado,
        origen: nextProps.verOrigen,
        dependenciaActual: nextProps.verDependencia,
        tipoDeExpediente: nextProps.verTipo,
        movimiento: nextProps.verMovimiento,
        comentarios: nextProps.comentarios,
        
    }
     
  }


  render() {
   
  let columns = [
    {
      name: 'Fecha',
      selector: 'fecha_creacion',
      sortable: true,
      wrap: true,
      grow:1
    },
    {
      name: 'Dependencia',
      selector: 'dependencia',
      sortable: true,
      wrap: true,
      grow:3
    },
    {
      name: 'Comentario',
      selector: 'comentario',
      sortable: true,
      wrap: true,
      grow:3
    }
  ];
  // if (this.state.comentarios !== undefined) {  
 
  //    console.log(this.state.comentarios);
  //  }
  
  const paginationOptions = {
    noRowsPerPage: true,
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos'
  };
    
    return (
      <div className="modal fade" id="viewExpedienteModal" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered " role="document">
          <div className="modal-content ">
            <div className="modal-header modal-header-reportes">
                <h5 className="modal-title"><strong>Expediente N°{this.state.numero}</strong></h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div >
                <div>
                    <label><strong>Tipo de Expediente:</strong> {this.state.tipoDeExpediente}</label>
                </div>
                <div>
                    <label><strong>Objeto:</strong> {this.state.objetoDeGasto}</label>
                </div>
                <div>
                    <label><strong>Origen:</strong> {this.state.origen}</label>
                </div>
                <div>
                    <label><strong>Dependencia Actual:</strong> {this.state.dependenciaActual}</label>
                </div>
                <div>
                    <label><strong>Fecha:</strong> {this.state.fecha}</label>
                </div>
                <div>
                    <label><strong>Descripción:</strong> {this.state.descripcion}</label>
                </div>
                <div>
                    <label><strong>Estado:</strong> {this.state.estado}</label> 
                </div>    
                <div>
                  <div className="text-center">
                    <button onClick={()=>this.cargarDatos()}>Ver Historial</button>
                  </div>
                
                  <div>
                     {/* Tabla de historial de expediente */}
                    <DataTable
                      columns={columns}
                      data={this.state.movimiento}
                      defaultSortField="fecha_creacion"
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
                     
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-sm btn-secondary "
                data-dismiss="modal">
                Cerrar
              </button>
              <button
                type="button"
                title="Imprimir"
                className="btn btn-sm btn-info">
                <FontAwesomeIcon icon="print"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VerExpediente;