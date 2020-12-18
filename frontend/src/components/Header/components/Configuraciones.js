import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import moment from "moment";
import DatePicker from "react-datepicker";

class Configuraciones extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: moment().toDate()
    }
  }

  setStartDate = date => {
    this.setState({selectedDate: date});
  }

  render() {
    return (
      <li className="nav-item dropdown no-arrow">
        <div className="nav-link dropdown-toggle" id="yearDropdown" role="button" data-toggle="dropdown"
             aria-haspopup="true" aria-expanded="false">
          <FontAwesomeIcon icon="cogs" size="sm"/>
        </div>
        {/* Dropdown - Year picker */}
        <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
             aria-labelledby="yearDropdown">
          <h6 className="dropdown-header">
            Selecciona un año
          </h6>
          <div className="dropdown-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col align-self-center">
                  <DatePicker
                    className="form-control"
                    locale="es"
                    dateFormat="yyyy"
                    selected={moment().toDate()}
                    onChange={date => this.setStartDate(date)}
                    showYearPicker
                    value={this.state.selectedDate}
                    inline
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

export default Configuraciones;