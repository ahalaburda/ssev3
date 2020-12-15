import React, {Component} from "react";
import DataTable from "react-data-table-component";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Timeline, TimelineEvent} from 'react-event-timeline';


class VerExpediente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      numero: '',
      descripcion: '',
      objetoDeGasto: '',
      fecha: '',
      estado: '',
      origen: '',
      dependenciaActual: '',
      tipoDeExpediente: '',
      recorrido: [],
      comentarios: [],
      totalRows: 0,
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
      recorrido: nextProps.verRecorrido,
      comentarios: nextProps.comentarios,

    }
  }

  /**
   *Funcion para ocultar/mostrar tabla de recorrido y comentario
   *y para cambiar el estado de los botones Mostrar/Ocultar
   * @param {*} table
   * @param {*} boton
   */
  showTable = (table, boton) => {
    let tabla = document.getElementById(table);
    if (tabla.style.display === "block") {
      tabla.style.display = "none";
    } else {
      tabla.style.display = "block";
    }
    let cambiarTexto = document.getElementById(boton);
    if (cambiarTexto.innerHTML === 'Ocultar') {
      cambiarTexto.innerHTML = 'Mostrar';
    } else {
      cambiarTexto.innerHTML = 'Ocultar';

    }
  }

   /**
   * Retorna el codigo del color dependiendo del estado 
   * en el que se encuentra el expediente en esa instancia
   * @param {*} estado 
   */
  selectColor =(estado)=>{
    switch (estado) {
      case 1:
        return '#f6c23e';
      case 2:
        return '#1cc88a';
      case 3:
        return '#36b9cc';
      case 4:
        return '#e74a3b';
      case 5:
        return '#858796';
      default:
        return '#5a5c69';
    } 
  }
  
  render() {
    //desestructuracion de recorrido para poder mapearlo y mostrarolo en un timeline
    const {recorrido} = this.state;

    let commentsColumns = [
      {
        name: 'Fecha',
        selector: 'fecha_creacion',
        sortable: true,
        wrap: true,
        grow: 1
      },
      {
        name: 'Comentario',
        selector: 'comentario',
        sortable: true,
        wrap: true,
        grow: 3
      },
      {
        name: 'Dependencia',
        selector: 'dependencia',
        sortable: true,
        wrap: true,
        grow: 2
      }
    ];

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
              <div>
                <div>
                  <label className='modal-text'><strong>Tipo de Expediente:</strong> {this.state.tipoDeExpediente}
                  </label>
                </div>
                <div>
                  <label className='modal-text'><strong>Objeto:</strong> {this.state.objetoDeGasto}</label>
                </div>
                <div>
                  <label className='modal-text'><strong>Origen:</strong> {this.state.origen}</label>
                </div>
                <div>
                  <label className='modal-text'><strong>Dependencia Actual:</strong> {this.state.dependenciaActual}
                  </label>
                </div>
                <div>
                  <label className='modal-text'><strong>Fecha:</strong> {this.state.fecha}</label>
                </div>
                <div>
                  <label className='modal-text'><strong>Descripción:</strong> {this.state.descripcion}</label>
                </div>
                <div>
                  <label className='modal-text'><strong>Estado:</strong> {this.state.estado}</label>
                </div>
                <hr/>
                <div>
                  <label className='modal-text'>
                    <strong>Recorrido:</strong>
                    <button
                      id='mostrarRecorrido'
                      className="btn btn-sm btn-link text-primary"
                      onClick={() => this.showTable('recorrido', 'mostrarRecorrido')}>
                      Mostrar
                    </button>
                  </label>
                </div>

                <div id="recorrido" className='modal-table'>
                  <div className="row">
                    <div className="col-md-12">
                      
                        <Timeline lineColor={'#8f8b8b'}>
                        {recorrido.map(rec =>
                            <TimelineEvent 
                            key= {rec.id}
                            title= {rec.dependencia}
                            titleStyle={{color:'#000'}}
                            createdAt={rec.fecha}
                            icon={<FontAwesomeIcon icon='check'/>}
                            iconColor= {this.selectColor(rec.estado)}
                            bubbleStyle={{borderColor: this.selectColor(rec.estado), backgroundColor: '#fff'}}
                            >
                            </TimelineEvent>
                          )}
                      </Timeline>
                    </div>
                  </div>
                </div>

                <div>
                  <label className='modal-text'>
                    <strong>Comentarios:</strong>
                    <button
                      id='mostrarComentario'
                      className="btn btn-sm btn-link text-primary"
                      onClick={() => this.showTable('comentarios', 'mostrarComentario')}>
                      Mostrar
                    </button>
                  </label>
                </div>

                <div id='comentarios' className='modal-table'>
                  {/* Tabla de comentarios de expediente */}
                  <DataTable
                    columns={commentsColumns}
                    data={this.state.comentarios}
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

              <div className="modal-footer oculto-impresion">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary "
                  data-dismiss="modal">
                  Cerrar
                </button>
                <button
                  onClick={() => this.printModal()}
                  type="button"
                  title="Imprimir"
                  className="btn btn-sm btn-info">
                  <FontAwesomeIcon icon="print"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VerExpediente;
