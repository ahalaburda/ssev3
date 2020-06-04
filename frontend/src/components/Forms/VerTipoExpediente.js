import React, {Component} from "react";

class VerTipoExpediente extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="modal fade" id="viewTipoExpedienteModal" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{this.props.descripcion}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <h5>lista de dependencias</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VerTipoExpediente;