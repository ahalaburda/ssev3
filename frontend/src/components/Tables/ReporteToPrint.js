import React ,{ Component } from "react";
import DataTable from "react-data-table-component";
import { EmptyTable } from "./EmptyTable";

class ReporteToPrint extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
            fecha_desde: '',
            fecha_hasta: '',
            origen: '',
            description: '',
            estado: '',
            mensaje: '',
            searchExisted: false
        }
    }

    //reemplazo de funcion componentWillReceiveProps
  static getDerivedStateFromProps(nextProps) {
    return {
        data: nextProps.data,
        fecha_desde: nextProps.fecha_desde,
        fecha_hasta: nextProps.fecha_hasta,
        origen: nextProps.origen,
        description: nextProps.description,
        estado: nextProps.estado,
        mensaje: nextProps.mensaje,
        searchExisted: nextProps.searchExisted
        
    }
  }

    render(){
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
            }
          ];
        return(
            <>
                <div>
                    <h3 className='modal-text'>Reporte</h3>  
                    <div>
                    {(this.state.fecha_desde !== '' && this.state.searchExisted) ?
                        <label className='modal-text '>Fecha de inicio: {this.state.fecha_desde} </label>
                        : <div/>}    
                    </div>
                    <div>
                    {(this.state.fecha_hasta !== '' && this.state.searchExisted) ?
                        <label className='modal-text '>Fecha final: {this.state.fecha_hasta} </label>
                        : <div/>}    
                    </div>
                    <div>
                    {(this.state.origen !== '' && this.state.searchExisted) ?
                        <label className='modal-text '>Origen: {this.state.origen}</label>
                        : <div/>}
                    </div>
                    <div>
                    {(this.state.estado !== '' && this.state.searchExisted) ?
                        <label className='modal-text '>Estado: {this.state.estado}</label>
                        : <div/>}
                    </div>
                    <div>
                    {(this.state.description !== '' && this.state.searchExisted) ?
                        <label className='modal-text '>Descripción: {this.state.description}</label>
                        : <div/>}
                    </div>
                    <hr/>
                </div>
                <div>
                    <DataTable
                    columns={columns}
                    data={this.state.data}
                    highlightOnHover={true}
                    noDataComponent={<EmptyTable mensaje={this.state.mensaje} />}
                    noHeader={true}
                    dense={true}
                    className="table-responsive table-sm table-bordered"
                    />
                </div>
            <hr/>
            </>
        )
    }
}

export default ReporteToPrint;