import React, {Component} from "react";
import ObjetosDeGastosService from "../../services/ObjetosDeGastos"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";
import SimpleEdit from "../Forms/SimpleEdit";
import NuevoObjetoDeGasto from "../Forms/NuevoObjetoDeGasto";
import Popups from "../Popups";

/**
 * Tabla para objeto de gastos
 */
class ObjetoDeGasto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showNew: false,
      showEdit: false,
      list: [],
      totalRows: 0,
      objetoDeGasto: {
        id: 0,
        descripcion: '',
        activo: true
      }
    };
    this.retrieveObjetosDeGastos = this.retrieveObjetosDeGastos.bind(this);
    this.getObjectRow = this.getObjectRow.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.addItem = this.addItem.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

  setListFromResponse = response => {
    this.setState({
      list: response.data.results.map(odg => {
        return {
          id: odg.id,
          descripcion: odg.descripcion,
          activo: odg.activo ? "Activo" : "Inactivo"
        }
      }),
      loading: false,
      totalRows: response.data.count
    });
  }

  /**
   * Obtener los objetos de gastos de la base de datos y cargarlos en la tabla
   */
  retrieveObjetosDeGastos(page) {
    this.setState({loading: true});
    ObjetosDeGastosService.getAll(page)
      .then(response => {
        if (response.data.count > 0) {
          this.setListFromResponse(response);
          this.setState({totalRows: response.data.count});
        } else {
          this.setState({loading: false});
          Popups.error('No se encontro ningun objeto de gasto.');
        }
      })
      .catch(e => {
        Popups.error('Ocurrio un error al obtener los objetos de gastos.');
        console.log(`Error retrieveObjetosDeGastos:\n${e}`);
      })
  }

  // Para la primera carga de pagina, o al volver a recargar el valor por efecto sera 1 (uno)
  componentDidMount() {
    this.retrieveObjetosDeGastos(1);
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
   * Obtiene el objeto de la fila de la tabla
   * @param row La fila seleccionada
   */
  getObjectRow = row => {
    ObjetosDeGastosService.getById(row.id).then(response => {
      this.setState({
        objetoDeGasto: response.data,
      })
    });
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
      ObjetosDeGastosService.delete(row.id)
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
      Popups.error("No se encontró el objeto de gasto.");
    }
  }

  /**
   * Agrega el nuevo objeto de gasto a la tabla
   * @param newItem Nuevo objeto de gasto
   */
  addItem = newItem => {
    this.setState({
      list: [...this.state.list, newItem]
    });
  }

  /**
   * Actualiza la tabla con el objeto de gasto modificado
   * @param newItem Objeto de gasto modificado
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

  handlePageChange = page => {
    this.retrieveObjetosDeGastos(page);
  }

  render() {
    //columnas para la tabla
    const columns = [
      {
        name: 'Descripción',
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
              className="btn btn-sm btn-link text-primary" data-toggle="modal" data-target="#editModal"
              onClick={() => this.getObjectRow(row)}>
              <FontAwesomeIcon icon="edit"/>
            </button>
            <button
              className="btn btn-sm btn-link text-danger" onClick={() => {
              if (window.confirm('Estás seguro de eliminar?')) {
                this.handleDeleteClick(row)
              }
            }
            }>
              <FontAwesomeIcon icon="trash-alt"/>
            </button>
          </div>,
        button: true,
      }
    ];
    const paginationOptions = {
      noRowsPerPage: true,
      rangeSeparatorText: 'de',
      selectAllRowsItemText: 'Todos'
    }

    return (
      <>
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0 text-gray-800">Objetos de Gastos</h1>
          <button className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                  onClick={() => this.setShowNew(true)}>
            <FontAwesomeIcon icon="plus" size="sm" className="text-white-50"/>&nbsp;Nuevo
          </button>
        </div>
        <div>

          {/*Tabla de lista de objetos de gasto*/}
          <DataTable
            columns={columns}
            data={this.state.list}
            defaultSortField="descripcion"
            progressPending={this.state.loading}
            pagination
            paginationServer
            paginationPerPage={20}
            paginationTotalRows={this.state.totalRows}
            onChangePage={this.handlePageChange}
            paginationComponentOptions={paginationOptions}
            highlightOnHover={true}
            noHeader={true}
            dense={true}
            className="table table-sm table-bordered"
          />

          {/*Modal de nuevo objeto de gasto*/}
          <NuevoObjetoDeGasto
            setShow={this.setShowNew}
            showModal={this.state.showNew}
            newItem={this.addItem}
          />

          {/*Modal de nuevo objeto de gasto*/}
          <SimpleEdit
            title="Objeto de gasto"
            item={this.state.objetoDeGasto}
            saveModalEdit={this.updateItem}
            service={ObjetosDeGastosService}
            setShow={this.setShowEdit}
            showModal={this.state.showEdit}
          />
        </div>
      </>
    );
  }
}

export default ObjetoDeGasto;