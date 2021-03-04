import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import {Popover, OverlayTrigger} from "react-bootstrap";
import helper from "../../../utils/helper";
import moment from "moment";

class Configuraciones extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      selectedDate: moment(helper.getCurrentYearSetting()).toDate()
    }
  }

  handleShowChange = () => {
    this.setState({show: !this.state.show});
  }

  setStartDate = date => {
    this.setState({selectedDate: date});
  }

  /**
   * Limpia el session storage y setea la nueva configuracion de anho
   */
  handleSaveClick = () => {
    //sessionStorage.clear();
    sessionStorage.setItem('year_setting', moment(this.state.selectedDate).format('YYYY'));
    this.handleShowChange();
    window.location.reload();
  }

  render() {
    const popover = (
      <Popover id="yearSelector-popover">
        <Popover.Title className="text-center">Selecciona el año</Popover.Title>
        <Popover.Content>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col">
                <DatePicker
                  className="form-control"
                  locale="es"
                  dateFormat="yyyy"
                  selected={this.state.selectedDate}
                  onChange={date => this.setStartDate(date)}
                  showYearPicker
                  value={this.state.selectedDate}
                  inline
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col text-center">
              <button className="btn btn-sm btn-primary" onClick={this.handleSaveClick}>Guardar</button>
            </div>
          </div>
        </Popover.Content>
      </Popover>
    )
    return (
      <OverlayTrigger trigger='click' show={this.state.show} onToggle={this.handleShowChange} placement="bottom"
                      overlay={popover}>
        <li className="nav-item">
          <div className="nav-link" role="button">
            <FontAwesomeIcon icon="cogs" size="sm"/>
          </div>
        </li>
      </OverlayTrigger>
    );
  }
}

export default Configuraciones;