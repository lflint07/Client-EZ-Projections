import React, {Component} from 'react';
import AddAssumptionForm from './AddAssumptionForm';

export default class FixedAssumptionTable extends Component {
  constructor() {
    super();
    this.renderFixedAssumptionTable = this.renderFixedAssumptionTable.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, key) {
    const fixedAssumption = this.props.fixedAssumptions[key];
    let updatedAssumption = {};
    if (e.target.type === "number"){
      updatedAssumption = {
        ...fixedAssumption,
        [e.target.name]: Number(e.target.value)
      };
    } else {
      updatedAssumption = {
        ...fixedAssumption,
        [e.target.name]: e.target.value
      };
    }
    this.props.updateAssumption(key, updatedAssumption);
  }

  renderFixedAssumptionTable(key) {
    const fixedAssumption = this.props.fixedAssumptions[key];
    return(
      <div className="assumption" key={fixedAssumption.id}>
        <div className="fixedAssumptionName" >{fixedAssumption.name}</div>
        <div className="fixedAssumptionCategory">{fixedAssumption.category}</div>
        <div className="fixedAssumptionValue">{fixedAssumption.value}</div>
      </div>
    );
  }

  // <thead className="fixedAssumptionInputTableHeader" key={key}>
  //   <tr className="fixedAssumptionTableEdit">
  //     <td className="fixedAssumptionTableName"><input name="name" type="text" value={fixedAssumption.name} placeholder="Assumption" onChange={(e) => this.handleChange(e, key)}/></td>
  //     <td className="fixedAssumptionTableValue"><input name="value" type="number" value={fixedAssumption.value} placeholder="Value" onChange={(e) => this.handleChange(e, key)}/></td>
  //     <td className="fixedAssumptionTableCategory"><input name="category" type="text" value={fixedAssumption.category} placeholder="Category" onChange={(e) => this.handleChange(e, key)}/></td>
  //     <td><button className="delete-button" onClick={() => this.props.removeAssumption(key)}>x</button></td>
  //   </tr>
  // </thead>

  // <table>
  //   <thead>
  //     <tr className="fixedAssumptionTableHeader">
  //       <th>Assumption</th>
  //       <th>Value</th>
  //       <th>Category</th>
  //     </tr>
  //   </thead>
  //   <tbody className="fixedAssumptionInput">
  //     {
  //       Object.keys(this.props.fixedAssumptions)
  //       .map(this.renderFixedAssumptionTable)
  //     }
  //   </tbody>
  // </table>

  render(){
    console.log(this.props.fixedAssumptions);
    return(
      <div>
        <h2>Fixed Assumptions</h2>
        <div className="assumptions-wrapper">
          {
            Object.keys(this.props.fixedAssumptions)
            .map(this.renderFixedAssumptionTable)
          }
        </div>
        <AddAssumptionForm addAssumption={this.props.addAssumption} />
        <button onClick={this.props.loadSampleAssumptions}>Load Sample Assumptions</button>
      </div>
    );
  }
}
