import React, {Component} from "react";
import DataTable from "react-data-table-component";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Popups from "../Popups";
import TiposDeExpedientesService from "../../services/TiposDeExpedientes";
import VerTipoExpediente from "../Forms/VerTipoExpediente";
import NuevoTipoExpediente from "../Forms/NuevoTipoExpediente";
import SimpleEdit from "../Forms/SimpleEdit";


/**
 * Tabla para tipo de expediente
 */
class TipoDeExpediente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNew: false,
      showEdit: false,
      list: [],
      title: '',
      dependencias: [],
      tipoExpediente: {
        id: 0,
        descripcion: '',
        activo: true
      }
    };
    this.retrieveTiposDeExpedientes = this.retrieveTiposDeExpedientes.bind(this);
    this.setShowNew = this.setShowNew.bind(this);
    this.setShowEdit = this.setShowEdit.bind(this);
    this.handleViewClick = this.handleViewClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.addItem = this.addItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }
  
  /**
   * Obtener los tipos de expedientes de la base de datos y cargarlos en la tabla
   */
  retrieveTiposDeExpedientes() {
    TiposDeExpedientesService.getAll()
      .then(response => {
        this.setState({
          list: response.data.results.map(tde => {
            return {
              id: tde.id,
              descripcion: tde.descripcion,
              activo: tde.activo ? "Activo" : "Inactivo"
            }
          })
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  componentDidMount() {
    this.retrieveTiposDeExpedientes();
  }

  /**
   * Setear el estado 'showNew' para mostrar u ocultar el modal
   */
  setShowNew = show => {
    this.setState({showNew: show});
  }

  /**
   * Setear el estado 'showEdit' para mostrar u ocultar el modal
   */
  setShowEdit = show => {
    this.setState({showEdit: show})
  }

  /**
   * Mostrar los detalles del tipo de expediente ordenando sus dependencias de acuerdo al campop 'orden'
   * @param row La fila seleccionada
   */
  handleViewClick = row => {
    TiposDeExpedientesService.getDetails(row.id)
      .then(response => {
        this.setState({
          title: row.descripcion,
          dependencias: response.data.results.sort((a, b) => a.orden - b.orden).map(d => {
            return d.dependencia_id.descripcion
          })
        })
      });
  }

  /**
   * Setea el estado 'tipoExpediente' para pasarlo al SimpleEdit
   * @param row La fila a editarse
   */
  handleEditClick = row => {
    TiposDeExpedientesService.getById(row.id)
      .then(response => {
        this.setState({
          tipoExpediente: response.data
        })
      })
    this.setShowEdit(true);
  }

  /**
   * Elimina el registro seleccionado y actualiza la tabla
   * @param row El registro a eliminarse
   */
  handleDeleteClick = row => {
    let newList = this.state.list;
    let index = newList.findIndex(i => i.id === row.id);
    if (index > -1) {
      TiposDeExpedientesService.delete(row.id)
        .then(response => {
          if (response.status === 204) {
            newList.splice(index, 1);
            this.setState({
              list: newList
            })
            Popups.success("Eliminado con exito.");
          } else {
            Popups.error("Ocurrio un error, no se pudo eliminar.");
          }
        })
        .catch(e => {
          console.log(e);
        })
    } else {
      Popups.error("No se encontró el tipo de expediente.");
    }
  }

  /**
   * Agrega el nuevo tipo de expediente a la tabla
   * @param newItem Nuevo tipo de expediente
   */
  addItem = newItem => {
    this.setState({
      list: [...this.state.list, newItem]
    });
  }

  /**
   * Actualiza la tabla con el tipo de expediente modificado
   * @param newItem Tipo de expediente modificado
   */
  updateItem = newItem => {
    let newList = this.state.list;
    let index = newList.findIndex(i => i.id === newItem.id);
    if (index > -1) {
      newList.splice(index, 1, {
        id: newItem.id,
        descripcion: newItem.descripcion,
        activo: newItem.activo ? "Activo" : "Inactivo"
      });
      this.setState({
        list: newList
      });
    }
  }

  render() {
    const paginationOptions = {
      noRowsPerPage: true,
      rangeSeparatorText: 'de',
      selectAllRowsItem: true,
      selectAllRowsItemText: 'Todos'
    }

    //columnas para la tabla
    const columns = [
        {
          name: 'Descripcion',
          selector: 'descripcion',
          sortable: true,
        },
        {
          name: 'Activo',
          selector: 'activo',
          sortable: true,
        },
        {
          name: 'Acciones',
          cell: row =>
            <div>
              <button
                className="btn btn-sm btn-link text-primary"
                onClick={() => this.handleViewClick(row)}
                data-toggle="modal" data-target="#viewTipoExpedienteModal">
                <FontAwesomeIcon icon="eye"/>
              </button>
              <button
                className="btn btn-sm btn-link text-primary" onClick={() => this.handleEditClick(row)}>
                <FontAwesomeIcon icon="edit"/>
              </button>
              <button
                className="btn btn-sm btn-link text-danger"
                onClick={() => {
                  if (window.confirm("Estás seguro de eliminar?")) {this.handleDeleteClick(row)}}
                }>
                <FontAwesomeIcon icon="trash-alt"/>
              </button>
            </div>,
          button: true,
        }
      ];

    return (
      <>
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0 text-gray-800">Tipos de expedientes</h1>
          <button className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" onClick={() => this.setShowNew(true)}>
            <FontAwesomeIcon icon="plus" size="sm" className="text-white-50"/>&nbsp;Nuevo
          </button>
        </div>

        {/*Tabla de lista de tipos de expedientes*/}
        <DataTable
          columns={columns}
          data={this.state.list}
          defaultSortField="descripcion"
          pagination
          paginationServer
          paginationPerPage={20}
          paginationComponentOptions={paginationOptions}
          highlightOnHover={true}
          noHeader={true}
          dense={true}
          className="table table-sm table-bordered"
        />

        {/*Modal de nuevo expediente*/}
        <NuevoTipoExpediente
          setShow={this.setShowNew}
          showModal={this.state.showNew}
          newItem={this.addItem}/>

        {/*Modal para ver tipo de expediente con sus rutas*/}
        <VerTipoExpediente
          titulo={this.state.title}
          dependencias={this.state.dependencias}/>

        {/*Modal para editar tipo de expediente*/}
        <SimpleEdit
          title="Tipo de Expediente"
          item={this.state.tipoExpediente}
          saveModalEdit={this.updateItem}
          service={TiposDeExpedientesService}
          setShow={this.setShowEdit}
          showModal={this.state.showEdit}
        />
      </>
    );
  }
}

export default TipoDeExpediente;
