import React, {Component} from 'react';
import {formatPrice} from '../helpers';

export default class Product extends Component {
  render() {
    const {details} = this.props;

    return (
      <tr>
        <td>
          {details.name}
        </td>
        <td>
          {formatPrice(details.price)}
        </td>
        <td>
          {details.unitsPerStore}
        </td>
        <td>
          {details.inventoryTurnoverInMonths}
        </td>
        <td>
          {details.unitsPerOrder}
        </td>
        <td>
          {details.totalCost}
        </td>
        <td>
          {details.reorderPoint}
        </td>
      </tr>
    );
  }
}
