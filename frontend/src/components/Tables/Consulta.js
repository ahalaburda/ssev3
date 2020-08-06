import React from "react";
import DataTable from "react-data-table-component";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function Consulta(props) {
  const data = [
    {
      id: 2,
      numero: 3
    },
    {
      id: 4,
      numero: 3
    },
    {
      id: 5,
      numero: 3
    }
  ]
  const columns = [
    {
      name: 'ID',
      selector: 'id',
      sortable: true,
    },
    {
      name: 'Número',
      selector: 'numero'
    },
    {
      name: 'Acciones',
      cell: () =>
        <div>
          <button className="btn btn-sm btn-link text-primary">
            <FontAwesomeIcon icon="eye"/>
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
    <>
      <DataTable
        columns={columns}
        data={data}
        pagination
        paginationComponentOptions={paginationOptions}
        highlightOnHover={true}
        noHeader={true}
        dense={true}
        className="table-responsive table-sm table-bordered"
      />
    </>
  );
}

export default Consulta;