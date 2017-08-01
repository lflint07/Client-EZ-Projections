import React, {Component} from 'react';

export default class AddAssumptionForm extends Component {
  createAssumption(event) {
    event.preventDefault();
    const assumption = {
      name: this.name.value,
      value: Number(this.value.value),
      category: this.category.value
    }
    this.props.addAssumption(assumption);
    this.assumptionForm.reset();
  }

  render() {
    return (
      <form ref={(input) => this.assumptionForm = input} className="assumption-edit" onSubmit={(e) => this.createAssumption(e)}>
        <input ref={(input) => this.name = input} type="text" placeholder="Name" />
        <input ref={(input) => this.value = input} type="number" placeholder="Value"/>
        <input ref={(input) => this.category = input} type="text" placeholder="Category"/>
        <button className="add-button" type="submit">+</button>
      </form>
    );
  }
}
