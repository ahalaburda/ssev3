import React, {Component} from 'react';
import $ from 'jquery';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000/api';
axios.defaults.headers.post['Content-Type'] = 'application/json';

class TipoDeExpedientes extends Component  {
    constructor(props) {
        super(props);
        this.state ={
            tipos_de_expedientes: []
        };
    }

    getTipos_de_expedientes() {
        axios.get('/tipos_de_expedientes/?format=json')
            .then(response => {
                this.setState({ tipos_de_expedientes: response.data });
                console.log(response);
            })
            .catch(console.log);
    }



    handleSubmit(e) {
        e.preventDefault();
        this.posttipos_de_expedientes($("#inputEstado").val());
    }

    render() {
        let data = this.props.tipos_de_expedientes && this.props.tipos_de_expedientes.map(e => {
            return <h5 key={e.id} className="card-title">{e.descripcion}</h5>
        });

        return (
            <div>
                <h1>tipos_de_expedientes</h1>
                <div className="card">
                    <div className="card-body">
                        {data}
                    </div>
                </div>
            </div>
        );
    }
}

export default TipoDeExpedientes