import React, {Component} from "react";

class VerTipoExpediente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titulo: '',
      dependencias: []
    }
  }

  // componentWillReceiveProps(nextProps, nextContext) {
  //   this.setState({
  //     titulo: nextProps.titulo,
  //     dependencias: nextProps.dependencias
  //   });
  // }

  //reemplazo de funcion componentWillReceiveProps
  static getDerivedStateFromProps(nextProps) {
    return {
      titulo: nextProps.titulo,
      dependencias: nextProps.dependencias
    }
  }

  render() {
    const colOne = this.state.dependencias.slice(0, 10).map((d, i) => {
      return <li className="list-group-item py-1" key={i}>{d}</li>
    });
    const colTwo = this.state.dependencias.slice(10).map((d, i) => {
      return <li className="list-group-item py-1" key={i}>{d}</li>
    });

    return (
      <div className="modal fade" id="viewTipoExpedienteModal" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content modal-text">
            <div className="modal-header">
              <h5 className="modal-title">{this.state.titulo}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Dependencias</label>
                <ul className="list-group list-group-flush small-size">
                  <div className="row">
                    <div className="col">
                      {colOne}
                    </div>
                    <div className="col">
                      {colTwo}
                    </div>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VerTipoExpediente;