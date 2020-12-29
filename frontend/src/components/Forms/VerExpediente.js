import React, {Component} from "react";
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
   * Funcion utilizada para imprimir el modal
   */
  printModal =()=>{
    let expNum = document.getElementById("expNum").innerHTML;
    let expData = document.getElementById("expData").innerHTML;
    let expRec = document.getElementById("recorrido").innerHTML;
    let expCom = document.getElementById("comentarios").innerHTML;
    let printDoc = document.getElementById("ifmcontentstoprintnt").contentWindow;
    printDoc.document.open();
    printDoc.document.write(expNum);
    printDoc.document.write(expData);
    printDoc.document.write("<Strong>Recorrido:</Strong>");
    printDoc.document.write(expRec);
    printDoc.document.write("<Strong>Comentarios:</Strong>");
    printDoc.document.write(expCom);
    printDoc.document.close();
    printDoc.focus();
    printDoc.print();
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
    //desestructuracion de recorrido y comentarios para poder mapearlo y mostrarlos en un timeline
    const {recorrido, comentarios} = this.state;

    return (
      <>
        <iframe id="ifmcontentstoprint" style={{display:'none'}}></iframe>
        <div className="modal fade" id="viewExpedienteModal"  role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered "  role="document">
            <div className="modal-content ">
                <div className="modal-header modal-header-reportes">
                  <h5 className="modal-title" id='expNum'><strong>Expediente N°{this.state.numero}</strong></h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div id='expData'>
                    <div>
                      <label className='modal-text '><strong>Tipo de Expediente:</strong> {this.state.tipoDeExpediente}
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
                  </div>
                  <div>
                    <label className='modal-text'>
                      <strong>Recorrido:</strong>
                    </label>  
                    <button
                      id='mostrarRecorrido'
                      className="btn btn-sm btn-link text-primary"
                      onClick={() => this.showTable('recorrido', 'mostrarRecorrido')}>
                      Mostrar
                    </button>
                    
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
                              icon={<FontAwesomeIcon icon='calendar-check'/>}
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
                    </label>
                    <button
                      id='mostrarComentario'
                      className="btn btn-sm btn-link text-primary"
                      onClick={() => this.showTable('comentarios', 'mostrarComentario')}>
                      Mostrar
                    </button>
                  </div>

                  <div id='comentarios' className='modal-table'>
                    <Timeline lineColor={'#8f8b8b'}>
                      {comentarios.map(com =>
                        <TimelineEvent 
                        key= {com.id}
                        title= {com.dependencia}
                        titleStyle={{color:'#000'}}
                        createdAt={com.fecha}
                        icon={<FontAwesomeIcon icon='comment-alt'/>}
                        iconColor= {this.selectColor(com.estado)}
                        bubbleStyle={{borderColor: this.selectColor(com.estado), backgroundColor: '#fff'}}
                        >
                          {com.comentario}
                        </TimelineEvent>
                      )}
                    </Timeline>
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
                  onClick={()=>this.printModal()}
                  type="button"
                  title="Imprimir"
                  className="btn btn-sm btn-info">
                  <FontAwesomeIcon icon="print"/>
                </button>
              </div>           
            </div>
          </div>
        </div>
        
      </>
    );
  }
}

export default VerExpediente;
