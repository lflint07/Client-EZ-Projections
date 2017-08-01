import _ from 'lodash';
import {round} from '../helpers';
import React, {Component} from 'react';

export default class CostDetail extends Component {
  constructor() {
    super();
    this.renderCostDetail = this.renderCostDetail.bind(this);
  }

  renderCostDetail(key) {
    const product = this.props.products[key];
    const unitsSoldRow = this.props.unitsSold(key);
    const unitsAddedRow = this.props.units(key, unitsSoldRow)[2];
    const unitsOrderedRow = this.props.unitsOrdered(key, unitsAddedRow);
    const totalCostRow = this.props.totalCost(key, unitsOrderedRow);
    const costPerUnitRow = this.props.costPerUnit(key, unitsOrderedRow, totalCostRow);

    return(
      <tbody key={key}>
        <tr>
          <td className="costDetailInputUnitsOrdered">Units Ordered</td>
          {
            this.props.unitsOrdered(key, unitsAddedRow)
            .map((month, i) => {
              return <td className="costDetailInputUnitsOrdered" key={i}>{round(month, 0)}</td>
            })
          }
        </tr>
        <tr>
          <td className="costDetailInputTotalCost">Total Cost</td>
          {
            this.props.totalCost(key, unitsOrderedRow)
            .map((month, i) => {
              return <td className="costDetailInputTotalCost" key={i}>{round(month, 0)}</td>
            })
          }
        </tr>
        <tr>
          <td className="costDetailInputCostUnit">Cost/Unit</td>
          {
            this.props.costPerUnit(key, unitsOrderedRow, totalCostRow)
            .map((month, i) => {
              return <td className="costDetailInputCostUnit" key={i}>{round(month, 0)}</td>
            })
          }
        </tr>
        <tr>
          <td className="costDetailInputProductName">{product.name}</td>
          {
            this.props.monthlyCost(key, costPerUnitRow, unitsSoldRow)
            .map((month, i) => {
              return <td className="costDetailInputProductName" key={i}>{round(month, 0)}</td>
            })
          }
        </tr>
      </tbody>
    );
  }

  render() {
    const {products} = this.props;

    return(
      <div className="costDetail">
        <table>
          <thead>
            <tr className="costDetailHeader">
              <th className="costDetailInput">Cost Detail</th>
              {
                _.times(36, i =>
                  <th className="costDetailInput" key={i}>{i+1}</th>
                )
              }
            </tr>
          </thead>
            {
              Object.keys(products)
              .map(this.renderCostDetail)
            }
        </table>
      </div>
    );
  }
}
