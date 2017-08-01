import React, {Component} from 'react';

export default class AddProductForm extends Component {
  createProduct(event) {
    event.preventDefault();
    const product = {
      name: this.name.value,
      price: Number(this.price.value),
      unitsPerStore: Number(this.unitsPerStore.value),
      inventoryTurnoverInMonths: Number(this.inventoryTurnoverInMonths.value),
      unitsPerOrder: Number(this.unitsPerOrder.value),
      totalCost: Number(this.totalCost.value),
      reorderPoint: Number(this.reorderPoint.value)
    }
    this.props.addProduct(product);
    this.productForm.reset();
  }

  render() {
    return (
        <form ref={(input) => this.productForm = input} className="product-form" onSubmit={(e) => this.createProduct(e)}>
          <input ref={(input) => this.name = input} type="text" placeholder="Product Name" />
          <input ref={(input) => this.price = input} type="number" placeholder="Price" />
          <input ref={(input) => this.unitsPerStore = input} type="number" placeholder="Units per Store" />
          <input ref={(input) => this.inventoryTurnoverInMonths = input} type="number" placeholder="Inv Turnover: Months" />
          <input ref={(input) => this.unitsPerOrder = input} type="number" placeholder="Units per Order " />
          <input ref={(input) => this.totalCost = input} type="number" placeholder="Total Cost" />
          <input ref={(input) => this.reorderPoint = input} type="number" placeholder="Reorder Point" />
          <button className="add-button" type="submit">+</button>
        </form>
    );
  }
}
