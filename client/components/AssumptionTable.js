import React, {Component} from 'react';
import AddProductForm from './AddProductForm';
// import Product from './Product';

export default class AssumptionTable extends Component {
  constructor() {
    super();
    this.renderAssumptionTable = this.renderAssumptionTable.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, key) {
    const product = this.props.products[key];
    let updatedProduct = {};
    if (e.target.type === "number"){
      updatedProduct = {
        ...product,
        [e.target.name]: Number(e.target.value)
      };
    } else {
      updatedProduct = {
        ...product,
        [e.target.name]: e.target.value
      };
    }
    this.props.updateProduct(key, updatedProduct);
  }

  renderAssumptionTable(key) {
    const product = this.props.products[key];
    return(
      <tr className="productEdit" key={key}>
        <td><input name="name" type="text" value={product.name} placeholder="Name" onChange={(e) => this.handleChange(e, key)} /></td>
        <td><input name="price" type="number" value={product.price} placeholder="Price" onChange={(e) => this.handleChange(e, key)} /></td>
        <td><input name="unitsPerStore" type="number" value={product.unitsPerStore} placeholder="Units per Store" onChange={(e) => this.handleChange(e, key)} /></td>
        <td><input name="inventoryTurnoverInMonths" type="number" value={product.inventoryTurnoverInMonths} placeholder="Inventory Turnover in Months" onChange={(e) => this.handleChange(e, key)} /></td>
        <td><input name="unitsPerOrder" type="number" value={product.unitsPerOrder} placeholder="Units per Order" onChange={(e) => this.handleChange(e, key)} /></td>
        <td><input name="totalCost" type="number" value={product.totalCost} placeholder="Total Cost" onChange={(e) => this.handleChange(e, key)} /></td>
        <td><input name="reorderPoint" type="number" value={product.reorderPoint} placeholder="Reorder Point" onChange={(e) => this.handleChange(e, key)} /></td>
        <td><button className="delete-button" onClick={() => this.props.removeProduct(key)}>x</button></td>
      </tr>
    );
  }


  render(){
    return(
      <div>
        <h2>Assumption Table</h2>
        <table>
          <thead>
            <tr className="assumptionTableInput">
              <th>Product Name</th>
              <th>Price</th>
              <th>Units Per Store</th>
              <th>Inv Turnover In Months</th>
              <th>Units Per Order</th>
              <th>Total Cost</th>
              <th>Reorder Point</th>
            </tr>
          </thead>
          <tbody className="assumptionTableInput">
            {
              Object.keys(this.props.products)
              .map(this.renderAssumptionTable)
            }

          </tbody>
        </table>
        <AddProductForm addProduct={this.props.addProduct} />
        <button onClick={this.props.loadSampleProducts}>Load Sample Products</button>
      </div>
    );
  }
}
