import React, {Component} from 'react';
import Header from './Header';
import AssumptionTable from './AssumptionTable';
import FixedAssumptionTable from './FixedAssumptionTable';
import EmployeeTable from './EmployeeTable';
import Dashboard from './Dashboard';
import sampleProducts from '../sample-products';
import sampleAssumptions from '../sample-assumptions';
import sampleEmployees from '../sample-employees';

export default class App extends Component {
  constructor() {
    super();

    //product methods
    this.addProduct = this.addProduct.bind(this);
    this.loadSampleProducts = this.loadSampleProducts.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.removeProduct = this.removeProduct.bind(this);

    //assumption methods
    this.addAssumption = this.addAssumption.bind(this);
    this.loadSampleAssumptions = this.loadSampleAssumptions.bind(this);
    this.updateAssumption = this.updateAssumption.bind(this);
    this.removeAssumption = this.removeAssumption.bind(this);

    //employee methods
    this.addEmployee = this.addEmployee.bind(this);
    this.loadSampleEmployees = this.loadSampleEmployees.bind(this);
    this.updateEmployee = this.updateEmployee.bind(this);
    this.removeEmployee = this.removeEmployee.bind(this);

    this.state = {
      products: {},
      fixedAssumptions: {},
      employees: {}
    };
  }

  //product methods
  addProduct(product) {
    //copy existing state
    const products = {...this.state.products};
    //create unique timestamp
    const timestamp = Date.now();
    //push new product to existing product with unique key
    products[`product-${timestamp}`] = product;
    //set the new state
    this.setState({products});
  }

  loadSampleProducts() {
    this.setState({
      products: sampleProducts
    });
  }

  updateProduct(key, updatedProduct) {
    const products = {...this.state.products};
    products[key] = updatedProduct;
    this.setState({products});
  }

  removeProduct(key) {
    const products = {...this.state.products};
    delete products[key];
    this.setState({products});
  }

  //assumption methods
  addAssumption(assumption) {
    const fixedAssumptions = {...this.state.fixedAssumptions};
    const timestamp = Date.now();
    fixedAssumptions[`fixedAssumption-${timestamp}`] = assumption;
    this.setState({fixedAssumptions});
  }

  loadSampleAssumptions() {
    this.setState({
      fixedAssumptions: sampleAssumptions
    });
  }

  updateAssumption(key, updatedAssumption) {
    const fixedAssumptions = {...this.state.fixedAssumptions};
    fixedAssumptions[key] = updatedAssumption;
    this.setState({fixedAssumptions});
  }

  removeAssumption(key) {
    const fixedAssumptions = {...this.state.fixedAssumptions};
    delete fixedAssumptions[key];
    this.setState({fixedAssumptions});
  }

  //employee methods
  addEmployee(employee) {
    const employees = {...this.state.employees};
    const timestamp = Date.now();
    employees[`employee-${timestamp}`] = employee;
    this.setState({employees});
  }

  loadSampleEmployees() {
    this.setState({
      employees: sampleEmployees
    });
  }

  updateEmployee(key, updatedEmployee) {
    const employees = {...this.state.employees};
    employees[key] = updatedEmployee;
    this.setState({employees});
  }

  removeEmployee(key) {
    const employees = {...this.state.employees};
    delete employees[key];
    this.setState({employees});
  }

  render() {
    return(
      <div>
        <Header />
        <div className="page-wrap">
          <div className="top">
            <div className="assumptionTable">
              <AssumptionTable
                products={this.state.products}
                addProduct={this.addProduct}
                loadSampleProducts={this.loadSampleProducts}
                updateProduct={this.updateProduct}
                removeProduct={this.removeProduct}
              />
            </div>
            <div className="fixedAssumptionTable">
              <FixedAssumptionTable
                fixedAssumptions={this.state.fixedAssumptions}
                addAssumption={this.addAssumption}
                loadSampleAssumptions={this.loadSampleAssumptions}
                updateAssumption={this.updateAssumption}
                removeAssumption={this.removeAssumption}
               />
             </div>
             <div className="employeeTable">
               <EmployeeTable
                 employees={this.state.employees}
                 addEmployee={this.addEmployee}
                 loadSampleEmployees={this.loadSampleEmployees}
                 updateEmployee={this.updateEmployee}
                 removeEmployee={this.removeEmployee}
               />
             </div>
           </div>
           <div className="dashboard">
            <Dashboard
              products={this.state.products}
              fixedAssumptions={this.state.fixedAssumptions}
              employees={this.state.employees}
             />
           </div>
        </div>
      </div>
    );
  }
}
