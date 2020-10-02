import React, {Component} from "react";
import DatePicker from 'react-date-picker';
import Select from "react-select";
import Popups from "../../components/Popups";
import Reporte from "../../components/Tables/Reporte";
import DependenciasService from "../../services/Dependencias";
import ObjetosDeGastosService from "../../services/ObjetosDeGastos";



class Reportes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      startDate: '',
      endDate: '',
      origen: [],
      objetoDeGasto: [],
      description: ''
    }
    this.retrieveDependencias = this.retrieveDependencias.bind(this);
    this.retrieveObjetosDeGastos = this.retrieveObjetosDeGastos.bind(this);
  }
  

  /**
   * Obtener las dependencias de la base de datos y cargarlos como opciones para el select
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
   * Obtener los objetos de gastos de la base de datos y ccargarlos como opciones para el select
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

  componentDidMount() {
    this.retrieveDependencias();
    this.retrieveObjetosDeGastos();
  }

  render() {
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
                    <label className="col-form-label col-sm-3" name='fechaDesde'>Desde: </label>
                    <DatePicker
                      className="col-1 input-group date"
                      calendarIcon =''
                      selected={this.state.startDate}
                      onChange={date => this.setState({startDate: date})}
                      selectsStart
                      startDate={this.state.startDate}
                      endDate={this.state.endDate}
                      value= {this.state.startDate}
                    />
                  </div>
                </div>
                
                <div className='col-md-6'>
                  <div className="form-group row">
                  <label className="col-form-label col-sm-3" name='fechaHasta'>Hasta:</label>
                  <DatePicker
                    className="col-1 input-group date"
                    calendarIcon= ''
                    selected={this.state.endDate}
                    onChange={date => this.setState({endDate:date})}
                    selectsEnd
                    startDate={this.state.startDate}
                    minDate={this.state.startDate}
                    endDate={this.state.endDate}
                    value= {this.state.endDate}
                  />
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
                    options={this.state.origen}
                    placeholder="Selecciona..."
                    name="select" 
                    isClearable="True"
                    isSearchable="True"                  
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
                    options={this.state.objetoDeGasto} 
                    placeholder="Selecciona..."
                    name="select"  
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
              name='id'
              className="form-control form-control-sm-1"
              
            />
          </div>
        </div>
        
        <div className='col-md-12'>   
          <div className='row'>  
            <div className='card-header py-3 col-md-9'>
              <div className="btn-group ml-auto">
                  <button type="button" className="btn btn-sm btn-success shadow-sm">Recibido</button>
                  <button type="button" className="btn btn-sm btn-warning shadow-sm">No Recibido</button>
                  <button type="button" className="btn btn-sm btn-info shadow-sm">Derivado</button>
                  <button type="button" className="btn btn-sm btn-danger shadow-sm">Rechazado</button>
                  <button type="button" className="btn btn-sm btn-secondary shadow-sm">Finalizado</button>                       
              </div>               
            </div>   

            <div className="py-3 col-md-3 text-right">
              <button
                className="btn btn-sm btn-primary"
              > Buscar
              </button>
            </div> 
          </div>
        </div>

      </div> 
      <Reporte />
      </>
    );
  }
}  
export default Reportes;