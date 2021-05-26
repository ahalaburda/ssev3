import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class SeleccionarTema extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: localStorage.getItem('theme')
        }
    }

    setLightTheme = () => {
        localStorage.setItem('theme', 'default')
        window.location.reload();
    }
    setDarkTheme = () => {
        localStorage.setItem('theme', 'dark')
        window.location.reload();
    }
    render() {
        return (
            <>
                {this.state.theme === 'dark' ?
                    <li className="nav-item">
                        <div className="nav-link" role="button"
                            title='Modo Claro' onClick={() => this.setLightTheme()}>
                            <FontAwesomeIcon icon="lightbulb" size="sm" />
                        </div>
                    </li> :
                    <li className="nav-item">
                        <div className="nav-link" role="button"
                            title='Modo Oscuro' onClick={() => this.setDarkTheme()}>
                            <FontAwesomeIcon icon="moon" size="sm" />
                        </div>
                    </li>
                }

            </>
        )
    }



}
export default SeleccionarTema;