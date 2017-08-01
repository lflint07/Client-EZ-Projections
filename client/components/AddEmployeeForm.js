import React, {Component} from 'react';

export default class AddEmployeeForm extends Component {
  createEmployee(e) {
    e.preventDefault();
    const employee = {
      position: this.position.value,
      salary: Number(this.salary.value),
      count: Number(this.count.value)
    }
    this.props.addEmployee(employee);
    this.employeeForm.reset();
  }

  render() {
    return (
      <form ref={(input) => this.employeeForm = input} className="employee-form" onSubmit={(e) => this.createEmployee(e)}>
        <input ref={(input) => this.position = input} type="text" placeholder="Employee Position" />
        <input ref={(input) => this.salary = input} type="number" placeholder="Salary" />
        <input ref={(input) => this.count = input} type="number" placeholder="Count" />
        <button className="add-button" type="submit">+</button>
      </form>
    )
  }
}
