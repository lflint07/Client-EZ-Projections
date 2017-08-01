import _ from 'lodash';
import {round} from '../helpers';
import React, {Component} from 'react';

export default class Inventory extends Component {
  constructor() {
    super();
    this.renderInventory = this.renderInventory.bind(this);
  }

  renderInventory(key) {
    const product = this.props.products[key];
    const unitsSoldRow = this.props.unitsSold(key);
    const unitsRow = this.props.units(key,unitsSoldRow);

    return(
      <tbody key={key}>
        <tr>
          <td className="inventoryProductInputName">{product.name}</td>
          {
            this.props.units(key, unitsSoldRow)[0]
            .map((month, i) => {
              return <td className="inventoryProductInputName" key={i}>{round(month, 0)}</td>
            })
          }
        </tr>
        <tr>
          <td className="inventoryProductInputUnitsSold">Units Sold</td>
          {
            this.props.unitsSold(key)
            .map((month, i) => {
              return <td className="inventoryProductInputUnitsSold" key={i}>{round(month, 0)}</td>
            })
          }
        </tr>
        <tr>
          <td className="inventoryProductInputUnitsAdded">Units Added</td>
          {
            this.props.units(key, unitsSoldRow)[2]
            .map((month, i) => {
              return <td className="inventoryProductInputUnitsAdded" key={i}>{round(month, 0)}</td>
            })
          }
        </tr>
        <tr>
          <td className="inventoryProductInputRemaining">Remaining</td>
          {
            this.props.units(key, unitsSoldRow)[1]
            .map((month, i) => {
              return <td className="inventoryProductInputRemaining" key={i}>{round(month,0)}</td>
            })
          }
        </tr>
      </tbody>
    );
  }

  render() {
    const {products} = this.props;

    return(
      <div className="inventory">
        <table>
          <thead>
            <tr className="inventoryProductColumn">
              <th className="inventoryProductHeader">Inventory</th>
              {
                _.times(36, i =>
                  <th className="inventoryProductInput" key={i}>{i+1}</th>
                )
              }
            </tr>
          </thead>
            {
              Object.keys(products)
              .map(this.renderInventory)
            }
        </table>
      </div>
    );
  }
}
