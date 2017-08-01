import _ from 'lodash';
import {round} from '../helpers';
import React, {Component} from 'react';

export default class ProfitLossStatement extends Component {
  constructor() {
    super();

    this.filterSales = this.filterSales.bind(this);
    this.filterExpenses = this.filterExpenses.bind(this);
    this.getExpensesArray = this.getExpensesArray.bind(this);
    this.renderIncomeSummary = this.renderIncomeSummary.bind(this);
    this.renderTotalIncome = this.renderTotalIncome.bind(this);
    this.renderCostSummary = this.renderCostSummary.bind(this);
    this.renderTotalCost = this.renderTotalCost.bind(this);
    this.renderGrossMargin = this.renderGrossMargin.bind(this);
    this.renderFixedExpenses = this.renderFixedExpenses.bind(this);
    this.renderSalesExpenses = this.renderSalesExpenses.bind(this);
  }

  // expense filtering methods
  filterSales(key) {
    const fixedAssumption = this.props.fixedAssumptions[key];
    return fixedAssumption.category === "sales" ? fixedAssumption : null;
  }

  filterExpenses(key) {
    const fixedAssumption = this.props.fixedAssumptions[key];
    return fixedAssumption.category === "expense" ? fixedAssumption : null;
  }

  getExpensesArray(key) {
    const fixedAssumption = this.props.fixedAssumptions[key];
    const expArray = [];
    _.times(36, i => {
      expArray.push(fixedAssumption.value)
    });

    return expArray;
  }

  //rendering methods
  renderIncomeSummary(key) {
    const product = this.props.products[key];
    const unitsSoldRow = this.props.unitsSold(key);

    return (
        <tr className="profitLossStatementInput" key={key}>
          <td>{product.name}</td>
          {
            this.props.monthlySales(key, unitsSoldRow)
            .map((month, i) => {
              return <td className="profitLossStatementInput" key={i}>{round(month, 0)}</td>
            })
          }
        </tr>
    )
  }

  renderTotalIncome(){
    return(
      this.props.totalIncome()
      .map((month, i) => {
        return <td className="profitLossStatementTotalIncome" key={i}>{round(month,0)}</td>
      })
    )
  }

  renderCostSummary(key) {
    const product = this.props.products[key];
    const unitsSoldRow = this.props.unitsSold(key);
    const unitsAddedRow = this.props.units(key, unitsSoldRow)[2];
    const unitsOrderedRow = this.props.unitsOrdered(key, unitsAddedRow);
    const totalCostRow = this.props.totalCost(key, unitsOrderedRow);
    const costPerUnitRow = this.props.costPerUnit(key, unitsOrderedRow, totalCostRow);

    return(
      <tr key={key}>
        <td className="profitLossStatementInput">{product.name}</td>
        {
          this.props.monthlyCost(key, costPerUnitRow, unitsSoldRow)
          .map((month, i) => {
            return <td className="profitLossStatementInput" key={i}>{round(month, 0)}</td>
          })
        }
      </tr>
    )
  }

  renderTotalCost(){
    return(
      this.props.costOfAll()
      .map((month, i) => {
        return <td className="profitLossStatementInput" key={i}>{round(month, 0)}</td>
      })
    )
  }

  renderGrossMargin(){
    const totalIncomeRow = this.props.totalIncome();
    const costOfAllRow = this.props.costOfAll();

    return(
      this.props.grossMargin(totalIncomeRow, costOfAllRow)
      .map((month, i) => {
        return <td className="profitLossStatementInputGrossMargin" key={i}>{round(month, 0)}</td>
      })
    )
  }

  renderSalesExpenses(key) {
    const fixedAssumption = this.props.fixedAssumptions[key];
    const totalIncomeRow = this.props.totalIncome();
    const saleExpRow = totalIncomeRow.map((number, i) => {
      return number = number * (fixedAssumption.value * 0.01);
    });

    return(
      <tr key={key}>
        <td className="profitLossStatementInput">{fixedAssumption.name}</td>
        {
          saleExpRow.map((month, i) => {
            return <td className="profitLossStatementInput" key={i}>{round(month,0)}</td>
          })
        }
      </tr>
    )
  }

  renderFixedExpenses(key) {
    const fixedAssumption = this.props.fixedAssumptions[key];

    return(
      <tr className="profitLossStatementInput" key={key}>
        <td>{fixedAssumption.name}</td>
        {
          _.times(36, i =>
            <td className="profitLossStatementInput" key={i}>{round(fixedAssumption.value,0)}</td>
          )
        }
      </tr>
    )
  }

  renderTotalExpenses(){
    const totalIncomeRow = this.props.totalIncome();
    const fixedExpRow = this.props.totalExpenses(this.filterExpenses, this.getExpensesArray);
    const salesExpRow = this.props.totalSalesExpenses(totalIncomeRow, this.filterSales, this.getExpensesArray);
    const totalExpRow = salesExpRow.map((number, i) => {
      return number = number + fixedExpRow[i];
    });

    return(
      totalExpRow.map((month, i) => {
        return <td className="profitLossStatementInputTotalExpenses" key={i}>{round(month,0)}</td>
      })
    )
  }

  renderEbitda(){
    const totalIncomeRow = this.props.totalIncome();
    const costOfAllRow = this.props.costOfAll();
    const grossMarginRow = this.props.grossMargin(totalIncomeRow, costOfAllRow);
    const fixedExpRow = this.props.totalExpenses(this.filterExpenses, this.getExpensesArray);
    const salesExpRow = this.props.totalSalesExpenses(totalIncomeRow, this.filterSales, this.getExpensesArray);
    const totalExpensesRow = salesExpRow.map((number, i) => {
      return number = number + fixedExpRow[i];
    });

    return (
      this.props.ebitda(grossMarginRow, totalExpensesRow)
        .map((month, i) => {
          return <td className="profitLossStatementInputEBITDA" key={i}>{round(month,0)}</td>
        })
    )
  }

  render() {
    const {products, fixedAssumptions} = this.props;

    return(
      <div className="profitLossStatement">
        <table>
          <thead className="profitLossStatementHeader">
            <tr>
              <th>Profit & Loss Statement</th>
              {
                _.times(36, i =>
                  <th className="profitLossStatementHeader" key={i}>{i+1}</th>
                )
              }
            </tr>
          </thead>
          <tbody>
            {
              Object.keys(products)
              .map(this.renderIncomeSummary)
            }
            <tr className="profitLossStatementTotalIncome">
              <td className="profitLossStatementTotalIncome">Total Income</td>
              {this.renderTotalIncome()}
            </tr>
            {
              Object.keys(products)
              .map(this.renderCostSummary)
            }
            <tr className="profitLossStatementInput">
              <td className="profitLossStatementInput">Total Cost of Sales</td>
              {this.renderTotalCost()}
            </tr>
            <tr className="profitLossStatementInputGrossMargin">
              <td className="profitLossStatementInputGrossMargin">Gross Margin</td>
              {this.renderGrossMargin()}
            </tr>
            {
              Object.keys(fixedAssumptions)
              .filter(this.filterSales)
              .map(this.renderSalesExpenses)
            }
            {
              Object.keys(fixedAssumptions)
              .filter(this.filterExpenses)
              .map(this.renderFixedExpenses)
            }
            <tr className="profitLossStatementInputTotalExpenses">
              <td className="profitLossStatementInputTotalExpenses">Total Expenses</td>
              {this.renderTotalExpenses()}
            </tr>
            <tr className="profitLossStatementInputEBITDA">
              <td>EBITDA</td>
              {this.renderEbitda()}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
