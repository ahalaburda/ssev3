import React, {Component} from "react";
import DataTable from "react-data-table-component";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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
      totalRows: 0
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
   y para cambiar el estado de los botones Mostrar/Ocultar
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


  render() {

    let columns = [
      {
        name: 'Fecha de Entrada',
        selector: 'fecha_entrada',
        sortable: true,
        wrap: true,
        grow: 2
      },
      {
        name: 'Fecha de Salida',
        selector: 'fecha_salida',
        sortable: true,
        wrap: true,
        grow: 2
      },
      {
        name: 'Dependencia',
        selector: 'dependencia',
        sortable: true,
        wrap: true,
        grow: 4
      }
    ];

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
                  <label>
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
                  {/* Tabla de recorrido de expediente */}
                  <DataTable
                    columns={columns}
                    data={this.state.recorrido}
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

                <div>
                  <label>
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
                  {/* Tabla de historial de expediente */}
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
      </div>
    );
  }
}

export default VerExpediente;