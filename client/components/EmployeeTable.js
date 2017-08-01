import React, {Component} from 'react'
import AddEmployeeForm from './AddEmployeeForm';

export default class EmployeeTable extends Component {
  constructor() {
    super();
    this.renderEmployeeTable = this.renderEmployeeTable.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, key) {
    const employee = this.props.employees[key];
    let updatedEmployee = {};
    if (e.target.type === "number"){
      updatedEmployee = {
        ...employee,
        [e.target.name]: Number(e.target.value)
      };
    } else {
      updatedEmployee = {
        ...employee,
        [e.target.name]: e.target.value
      };
    }
    this.props.updateEmployee(key, updatedEmployee);
  }

  renderEmployeeTable(key){
    const employee = this.props.employees[key];

    return(
      <tr className="employee-edit" key={key}>
        <td><input name="position" type="text" value={employee.position} placeholder="Employee Position" onChange={(e) => this.handleChange(e, key)}/></td>
        <td><input name="salary" type="number" value={employee.salary} placeholder="Salary" onChange={(e) => this.handleChange(e, key)}/></td>
        <td><input name="count" type="number" value={employee.count} placeholder="Count" onChange={(e) => this.handleChange(e, key)}/></td>
        <td><button className="delete-button" onClick={() => this.props.removeEmployee(key)}>x</button></td>
      </tr>
    );
  }


  render () {
    return (
      <div>
        <h2>Employee Table</h2>
        <table>
          <thead>
            <tr>
              <th>Position</th>
              <th>Salary</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {
              Object.keys(this.props.employees)
              .map(this.renderEmployeeTable)
            }
          </tbody>
        </table>
        <AddEmployeeForm addEmployee={this.props.addEmployee}/>
        <button onClick={this.props.loadSampleEmployees}>Load Sample Employees</button>
      </div>
    );
  }
}
