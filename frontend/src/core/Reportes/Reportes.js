import React, {Component} from "react";
import DatePicker from 'react-date-picker';
import Select from "react-select";
import Popups from "../../components/Popups";
import Reporte from "../../components/Tables/Reporte";
import DependenciasService from "../../services/Dependencias";
import ObjetosDeGastosService from "../../services/ObjetosDeGastos";
import InstanciaService from "../../services/Instancias";
import moment from 'moment';
import SimpleReactValidator from 'simple-react-validator';



class Reportes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      startDate: new Date(),
      endDate: '',
      origen: [],
      origenSelected: '',
      objetoDeGasto: [],
      objetoSelected: '',
      description: ''
    }
    this.retrieveDependencias = this.retrieveDependencias.bind(this);
    this.retrieveObjetosDeGastos = this.retrieveObjetosDeGastos.bind(this);
    this.validator = new SimpleReactValidator();
  }
  

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
      loading: false
    });
  }

 

  /**
   * Obtiene todos los expedientes de la base de datos y los carga en la tabla
   */
  retrieveExpedientes() {
    this.setState({loading: true});
    InstanciaService.getAll()
      .then(response => {
        if (response.data.count > 0) {
          this.setListFromResponse(response);
          this.setState({totalRows: response.data.count});
        } else {
          this.setState({loading: false});
          Popups.error('No se encontro ningun expediente');
        }
      })
      .catch(e => {
        Popups.error('Ocurrio un error al obtener los expedientes.');
        console.log(`Error retrieveExpedientes:\n${e}`);
      })
  }

  /**
   * Obtiene todas las dependencias de la base de datos y los cargar como opciones para el select
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
    this.retrieveExpedientes();
  }

  handleDescriptionChange = e => {
    this.setState({description: e.target.value});
  }

  setOrigen = origen => {
    this.setState({origenSelected: origen});  
  }

  setObjetoGasto = objeto => {
    this.setState({objetoSelected : objeto})
  }

   

  /**
   * Toma la descripcion pasada del estado y ejecuta el servicio de busqueda por descripcion.
   * @param description
   */
  findExp = (origen, description) => {
    InstanciaService.getByExpObjeto(origen)
    // InstanciaService.getByExpDescription(description)
      .then(response => {
        if (response.data.count === 0) {
          Popups.error('Expediente(s) no encontrado(s).');
        } else {
          this.setListFromResponse(response);
        }
      })
      .catch((e) => {
        Popups.error('Ocurrio un error durante la busqueda.');
        console.log(`Error findByDescription: InstanciaService\n${e}`);
      });
  }

  

  
  handleSearch = () => { 
    if (this.validator.fieldValid('selectObjeto')) {
      this.findExp(this.state.objetoSelected.value,this.state.description);
    }
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
                    
                    options = {this.state.origen}
                    placeholder = "Selecciona..."
                    name = "selectOrigen" 
                    value= {this.state.origenSelected}
                    onChange = {origen => this.setOrigen(origen)}                  
                    isClearable ="True"
                    isSearchable ="True"                  
                  />
                  {this.validator.message('selectOrigen', this.state.origenSelected, 'required')}
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
                    value =  {this.state.objetoSelected}
                    onChange = {objeto => this.setObjetoGasto(objeto)}
                    isClearable="True" 
                    isSearchable="True"
                  />
                  {this.validator.message('selectObjeto', this.state.objetoSelected, 'required')}
                </div>             
            </div>
          </div>

          <div className='col-md-2'>
            <label className="col-form-label m-0 font-weight-bold">Filtrar por Descripción: </label>
            <input
              type="text"
              name='id'
              className="form-control form-control-sm-1"
              onChange={e => this.handleDescriptionChange(e)}
            />
          </div>
        </div>
        
        <div className='col-md-12'>   
          <div className='row'>  
            <div className='card-header py-3 col-md-9'>
              <div className="btn-group ml-auto">
                  <button type="button" className="btn btn-sm btn-success shadow-sm" onClick={val => this.findByEstado('recibido')}>Recibido</button>
                  <button type="button" className="btn btn-sm btn-warning shadow-sm" onClick={val => this.findByEstado('no recibido')}>No Recibido</button>
                  <button type="button" className="btn btn-sm btn-info shadow-sm" onClick={val => this.findByEstado('derivado')}>Derivado</button>
                  <button type="button" className="btn btn-sm btn-dark shadow-sm" onClick={val => this.findByEstado('pausado')}>Pausado</button>
                  <button type="button" className="btn btn-sm btn-danger shadow-sm" onClick={val => this.findByEstado('rechazado')}>Rechazado</button>
                  <button type="button" className="btn btn-sm btn-secondary shadow-sm" onClick={val => this.findByEstado('finalizado')}>Finalizado</button>                       
              </div>               
            </div>   

            <div className="py-3 col-md-3 text-right">
              <button
                className="btn btn-sm btn-primary"
                onClick={this.handleSearch}
              > Buscar
              </button>
            </div> 
          </div>
        </div>

      </div> 
      <Reporte data={this.state.data} />
      </>
    );
  }
}  
export default Reportes;