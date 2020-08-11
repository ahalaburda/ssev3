import React, {Component} from "react";
import DataTable from "react-data-table-component";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class Consulta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({list: nextProps.data})
  }

  render() {
    //fila temporal
    const temp_data = [
      {
        id: '12343',
        numero: '3324',
        fechaMe: '31-12-2020 11:26',
        descripcion: 'Pago y remuneracion Pago y remuneracion de hogar, bienestar y salud Pago y remuneracion',
        origen: 'Direccion Gral de Administracion y Finanzas',
        destino: 'Direccion Gral de Administracion y Finanzas',
        dependenciaActual: 'Direccion Gral de Administracion y Finanzas',
        estado: 'No recibido'
      }
    ]
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
      },
      {
        name: 'Origen',
        selector: 'origen',
        wrap: true
      },
      {
        name: 'Destino',
        selector: 'destino',
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
        grow: -1
      },
      {
        name: 'Dependencia Actual',
        selector: 'dependenciaActual',
        wrap: true
      },
      {
        name: 'Acciones',
        cell: () =>
          <div>
            <button className="btn btn-sm btn-link text-primary">
              <FontAwesomeIcon icon="eye"/>
            </button>
            <button className="btn btn-sm btn-link text-primary">
              <FontAwesomeIcon icon="print"/>
            </button>
          </div>,
        button: true
      }
    ];

    const paginationOptions = {
      rowsPerPageText: 'Filas por página',
      rangeSeparatorText: 'de',
      selectAllRowsItem: true,
      selectAllRowsItemText: 'Todos'
    };

    return (
      //remplazar temp_data por this.state.list
      <DataTable
        columns={columns}
        data={this.state.list}
        pagination
        paginationComponentOptions={paginationOptions}
        highlightOnHover={true}
        noHeader={true}
        dense={true}
        className="table-responsive table-sm table-bordered"
      />
    );
  }
}

export default Consulta;