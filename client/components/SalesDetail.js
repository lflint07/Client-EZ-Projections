import _ from 'lodash';
import {round} from '../helpers';
import React, {Component} from 'react';

export default class SalesDetail extends Component {
  constructor() {
    super();
    this.renderSalesDetail = this.renderSalesDetail.bind(this);
  }

  renderSalesDetail(key) {
    const product = this.props.products[key];
    const unitsSoldRow = this.props.unitsSold(key);

    return(
      <tbody key={key}>
        <tr>
          <td className="salesDetailInputName">{product.name}</td>
          {
            this.props.monthlySales(key, unitsSoldRow)
            .map((month, i) => {
              return <td className="salesDetailInputUnitsSold" key={i}>{round(month, 0)}</td>
            })
          }
        </tr>
      </tbody>
    )
  }

  render() {
    const {products} = this.props;

    return(
      <div className="salesDetail">
        <table>
          <thead>
            <tr className="salesDetailHeader">
              <th>Sales Detail</th>
              {
                _.times(36, i =>
                  <th className="salesDetailInput" key={i}>{i+1}</th>
                )
              }
            </tr>
          </thead>
            {
              Object.keys(products)
              .map(this.renderSalesDetail)
            }
        </table>
      </div>
    );
  }
}
