import React, {Component} from "react";
import SimpleReactValidator from "simple-react-validator";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: ''
    }
    this.checkValid = this.checkValid.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validator = new SimpleReactValidator({
      className: 'text-danger',
      messages: {required: 'Este campo no puede estar vacío.'}
    })
  }

  /**
   * Si hay errores en los inputs, muestra los mensajes de error
   * @returns {boolean} true si todos estan correctos, si no false
   */
  checkValid = () => {
    if (this.validator.allValid()) return true;
    this.validator.showMessages();
    return false;
  }

  /**
   * Setea el estado para el password
   * @param e Evento del input
   */
  handlePassChange = e => {
    this.setState({password: e.target.value});
  }

  /**
   * Chequea que los campos no esten vacios y envia los datos
   * @param e
   */
  handleSubmit = e => {
    if (this.checkValid()) {
      this.props.handleLogin(e, {
        username: this.props.username,
        password: this.state.password
      });
    }
  }

  render() {
    return (
      <div className="bg-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-5 col-lg-6 col-md-6">
              <div className="card o-hidden-border-0 shadow-lg my-5">
                <div className="card-body p-0">
                  <div className="col-lg-0">
                    <div className="p-5">
                      <div className="text-center">
                        <p className="h4 text-gray-900 mb-4">Sistema de Seguimiento de Expedientes</p>
                      </div>
                      <form onSubmit={e => this.handleSubmit(e)} className="user">
                        <div className="form-group">
                          <input
                            name="userInput"
                            type="text"
                            className="form-control form-control-user"
                            placeholder="Ingresa tu usuario."
                            value={this.props.username}
                            onChange={this.props.handleUserChange}
                          />
                          {this.validator.message('userInput', this.props.username, 'required')}
                        </div>
                        <div className="form-group">
                          <input
                            name="passwordInput"
                            type="password"
                            className="form-control form-control-user"
                            placeholder="Tu contraseña"
                            value={this.state.password}
                            onChange={this.handlePassChange}
                          />
                          {this.validator.message('passwordInput', this.state.password, 'required')}
                        </div>
                        <button onClick={e => this.handleSubmit(e)} type="submit"
                                className="btn btn-primary btn-user btn-block">
                          Iniciar Sesi&oacute;n
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;