import React, {Component} from 'react';
import $ from 'jquery';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000/api';
axios.defaults.headers.post['Content-Type'] = 'application/json';

class Estados extends Component  {
  constructor(props) {
    super(props);
    this.state ={
      estados: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getEstados() {
    axios.get('/estados/?format=json')
      .then(response => {
        this.setState({ estados: response.data });
        console.log(response);
      })
      .catch(console.log);
  }

  postEstados(estado) {
    axios.post('/api/estados/', {
      "descripcion": estado

    })
      .then(response => {
        console.log(response);
      });
  }

  putEstados(id) {
    axios.put('/estados/' + id).then(r => console.log(r.statusText));
  }

  deleteEstados(id) {
    axios.delete('/estados/' + id).then(r => console.log(r.statusText));
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