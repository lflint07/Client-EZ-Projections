import _ from "lodash";
import React, {Component} from 'react';

export default class EmployeeInfo extends Component {
  constructor(){
    super();
    this.renderEmployeeInfo = this.renderEmployeeInfo.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, key) {
    
  }

  renderEmployeeInfo(key){
    const employee = this.props.employees[key];

    return (
      <tr key={key}>
        <td>{employee.position}</td>
        {
          _.times(36, i =>
            <td key={i}><input name="count" type="number" className="employee-input" onChange={(e) => this.handleChange(e, key)}/></td>
          )
        }
      </tr>
    );
  }

  render () {
    const {employees} = this.props;

    return (
      <div className="employee-info">
        <h3>Employee Info</h3>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              {
                _.times(36, i =>
                  <th key={i}>{i+1}</th>
                )
              }
            </tr>
          </thead>
          <tbody>
            {
              Object.keys(employees)
              .map(this.renderEmployeeInfo)
            }
          </tbody>
        </table>
      </div>
    );
  }
}
