import React, {Component} from 'react';
import $ from 'jquery';
import axios from 'axios';

class Estados extends Component  {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  postEstados(estado) {
    axios.post('https://localhost:8000/api/estados/', {
      descripcion: estado
    })
      .then(response => {
        console.log(response);
      });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.postEstados($("#inputEstado").val());
  }

  render() {
    let data = this.props.estados && this.props.estados.map(e => {
      return <h5 key={e.id} className="card-title">{e.descripcion}</h5>
    });

    return (
      <div>
        <h1>Estados</h1>
          <div className="card">
            <div className="card-body">
              {data}
            </div>
          </div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <input type="text" id="inputEstado"/>
            <button type="submit">Guardar</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Estados