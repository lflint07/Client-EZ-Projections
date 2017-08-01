import _ from 'lodash';
import {round} from '../helpers';
import React, {Component} from 'react';

export default class BalanceSheet extends Component {
  constructor(){
    super();

    this.filterSales = this.filterSales.bind(this);
    this.filterExpenses = this.filterExpenses.bind(this);
    this.getExpensesArray = this.getExpensesArray.bind(this);
    this.renderAR = this.renderAR.bind(this);
    this.renderAP = this.renderAP.bind(this);
    this.renderInv = this.renderInv.bind(this);
    this.renderCapitalStock = this.renderCapitalStock.bind(this);
    this.renderRetainedEarnings = this.renderRetainedEarnings.bind(this);
    this.renderTotalEquity = this.renderTotalEquity.bind(this);
    this.renderTotalLiabilityAndEquity = this.renderTotalLiabilityAndEquity.bind(this);
    this.renderCash = this.renderCash.bind(this);
    this.renderCurrentAssets = this.renderCurrentAssets.bind(this);
  }

  //EXPENSE FILTERING METHODS
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

  //RENDERING METHODS

  renderCash(){
    const totalIncomeRow = this.props.totalIncome();
    const arRow = this.props.actRec(totalIncomeRow);
    const changeInArRow = this.props.changeInAR(arRow);
    const cashInRow = this.props.totalCashInflows(changeInArRow, totalIncomeRow)

    const costOfAllRow = this.props.costOfAll();
    const invRow = this.props.inv(costOfAllRow);
    const changeInvRow = this.props.changeInInv(invRow);

    const fixedExpRow = this.props.totalExpenses(this.filterExpenses, this.getExpensesArray);
    const salesExpRow = this.props.totalSalesExpenses(totalIncomeRow, this.filterSales, this.getExpensesArray);
    const totalExpensesRow = salesExpRow.map((number, i) => {
      return number = number + fixedExpRow[i];
    });
    const apRow = this.props.actPay(costOfAllRow, totalExpensesRow);
    const changeApRow = this.props.changeInAP(apRow);
    const cashOutRow = this.props.totalCashOutFlows(changeInvRow, changeApRow, costOfAllRow, totalExpensesRow);
    const netCashRow = this.props.netCashFlow(cashInRow, cashOutRow);

    const equityRow = this.props.equityFinancing();

    return(
      this.props.cash(netCashRow, equityRow)[1]
      .map((month, i) => {
        return <td className="balanceSheetInputCash" key={i}>{round(month,0)}</td>
      })
    )
  }

  renderAR() {
    const totalIncomeRow = this.props.totalIncome();

    return(
      this.props.actRec(totalIncomeRow)
      .map((month, i) => {
        return <td className="balanceSheetInputAR" key={i}>{round(month,0)}</td>
      })
    )
  }

  renderInv(){
    const costOfAllRow = this.props.costOfAll();

    return(
      this.props.inv(costOfAllRow)
      .map((month, i) => {
        return <td className="balanceSheetInputInventory" key={i}>{round(month,0)}</td>
      })
    )
  }

  renderCurrentAssets(){
    const totalIncomeRow = this.props.totalIncome();
    const arRow = this.props.actRec(totalIncomeRow);
    const changeInArRow = this.props.changeInAR(arRow);
    const cashInRow = this.props.totalCashInflows(changeInArRow, totalIncomeRow)

    const costOfAllRow = this.props.costOfAll();
    const invRow = this.props.inv(costOfAllRow);
    const changeInvRow = this.props.changeInInv(invRow);

    const fixedExpRow = this.props.totalExpenses(this.filterExpenses, this.getExpensesArray);
    const salesExpRow = this.props.totalSalesExpenses(totalIncomeRow, this.filterSales, this.getExpensesArray);
    const totalExpensesRow = salesExpRow.map((number, i) => {
      return number = number + fixedExpRow[i];
    });
    const apRow = this.props.actPay(costOfAllRow, totalExpensesRow);
    const changeApRow = this.props.changeInAP(apRow);
    const cashOutRow = this.props.totalCashOutFlows(changeInvRow, changeApRow, costOfAllRow, totalExpensesRow);

    const netCashRow = this.props.netCashFlow(cashInRow, cashOutRow);
    const equityRow = this.props.equityFinancing();
    const cashRow = this.props.cash(netCashRow, equityRow)[1];

    return(
      this.props.totalCurrentAssets(cashRow, arRow, invRow)
      .map((month, i) => {
        return <td className="balanceSheetTotalCurrentAssets" key={i}>{round(month, 0)}</td>
      })
    )
  }

  renderAP(){
    const totalIncomeRow = this.props.totalIncome();
    const costOfAllRow = this.props.costOfAll();
    const fixedExpRow = this.props.totalExpenses(this.filterExpenses, this.getExpensesArray);
    const salesExpRow = this.props.totalSalesExpenses(totalIncomeRow, this.filterSales, this.getExpensesArray);
    const totalExpensesRow = salesExpRow.map((number, i) => {
      return number = number + fixedExpRow[i];
    });

    return(
      this.props.actPay(costOfAllRow, totalExpensesRow)
      .map((month, i) => {
        return <td className="balanceSheetInputAP" key={i}>{round(month,0)}</td>
      })
    )
  }

  renderCapitalStock(){
    const equityRow = this.props.equityFinancing();

    return(
      this.props.capitalStock(equityRow)
      .map((month, i) => {
        return <td className="balanceSheetInputCapitalStock" key={i}>{round(month,0)}</td>
      })
    )
  }

  renderRetainedEarnings(){
    const totalIncomeRow = this.props.totalIncome();
    const costOfAllRow = this.props.costOfAll();
    const grossMarginRow = this.props.grossMargin(totalIncomeRow, costOfAllRow);
    const fixedExpRow = this.props.totalExpenses(this.filterExpenses, this.getExpensesArray);
    const salesExpRow = this.props.totalSalesExpenses(totalIncomeRow, this.filterSales, this.getExpensesArray);
    const totalExpensesRow = salesExpRow.map((number, i) => {
      return number = number + fixedExpRow[i];
    });
    const ebitdaRow = this.props.ebitda(grossMarginRow, totalExpensesRow);

    return(
      this.props.retainedEarnings(ebitdaRow)
      .map((month, i) => {
        return <td className="balanceSheetInputRetainedEarnings" key={i}>{round(month,0)}</td>
      })
    )
  }

  renderTotalEquity(){
    const equityRow = this.props.equityFinancing();
    const capitalStockRow = this.props.capitalStock(equityRow);

    const totalIncomeRow = this.props.totalIncome();
    const costOfAllRow = this.props.costOfAll();
    const grossMarginRow = this.props.grossMargin(totalIncomeRow, costOfAllRow);
    const fixedExpRow = this.props.totalExpenses(this.filterExpenses, this.getExpensesArray);
    const salesExpRow = this.props.totalSalesExpenses(totalIncomeRow, this.filterSales, this.getExpensesArray);
    const totalExpensesRow = salesExpRow.map((number, i) => {
      return number = number + fixedExpRow[i];
    });
    const ebitdaRow = this.props.ebitda(grossMarginRow, totalExpensesRow);
    const retainedEarningsRow = this.props.retainedEarnings(ebitdaRow);

    return(
      this.props.totalEquity(capitalStockRow, retainedEarningsRow)
      .map((month, i) => {
        return <td className="balanceSheetInputTotalOwnersEquity" key={i}>{round(month,0)}</td>
      })
    )
  }

  renderTotalLiabilityAndEquity(){
    const totalIncomeRow = this.props.totalIncome();
    const costOfAllRow = this.props.costOfAll();
    const fixedExpRow = this.props.totalExpenses(this.filterExpenses, this.getExpensesArray);
    const salesExpRow = this.props.totalSalesExpenses(totalIncomeRow, this.filterSales, this.getExpensesArray);
    const totalExpensesRow = salesExpRow.map((number, i) => {
      return number = number + fixedExpRow[i];
    });
    const totalLiabilityRow = this.props.actPay(costOfAllRow, totalExpensesRow);

    const equityRow = this.props.equityFinancing();
    const capitalStockRow = this.props.capitalStock(equityRow);

    const grossMarginRow = this.props.grossMargin(totalIncomeRow, costOfAllRow);
    const ebitdaRow = this.props.ebitda(grossMarginRow, totalExpensesRow);
    const retainedEarningsRow = this.props.retainedEarnings(ebitdaRow);
    const totalEquityRow = this.props.totalEquity(capitalStockRow, retainedEarningsRow);


    return (
      this.props.totalLiabilityAndEquity(totalLiabilityRow, totalEquityRow)
      .map((month, i) => {
        return <td className="balanceSheetInputTotalLiabilityAndEquity" key={i}>{round(month,0)}</td>
      })
    )
  }

  render() {
    const {products} = this.props;

    return(
      <div className="balanceSheet">
        <table>
          <thead className="balanceSheetInputTitleRow">
            <tr>
              <th className="balanceSheetInputHeader">Balance Sheet</th>
              {
                _.times(36, i =>
                  <th className="balanceSheetInputColumns" key={i}>{i+1}</th>
                )
              }
            </tr>
          </thead>
          <tbody className="balanceSheetInputBody">
            <tr className="balanceSheetInputAssets">
              <td>Assets</td>
            </tr>
            <tr>
              <td className="balanceSheetInputCash">Cash</td>
              {this.renderCash()}
            </tr>
            <tr>
              <td className="balanceSheetInputAR">AR</td>
              {this.renderAR()}
            </tr>
            <tr>
              <td className="balanceSheetInputInventory">Inventory</td>
              {this.renderInv()}
            </tr>
            <tr>
              <td className="balanceSheetInputOther">Other Current</td>
            </tr>
            <tr className="balanceSheetTotalCurrentAssets">
              <td className="balanceSheetTotalCurrentAssets">Total Current Assets</td>
              {this.renderCurrentAssets()}
            </tr>
            <tr className="balanceSheetTotalAssets">
              <td className="balanceSheetTotalAssets">Total Assets</td>
              {this.renderCurrentAssets()}
            </tr>
            <tr className="balanceSheetInputLiabilities">
              <td className="balanceSheetInputLiabilities">Liabilities</td>
            </tr>
            <tr className="balanceSheetInputAP">
              <td className="balanceSheetInputAP">AP</td>
              {this.renderAP()}
            </tr>
            <tr>
              <td className="balanceSheetInputTotalLiabilities">Total Liabilities</td>
              {this.renderAP()}
            </tr>
            <tr>
              <td className="balanceSheetInputOwnersEquity">Owner's Equity</td>
            </tr>
            <tr>
              <td className="balanceSheetInputCapitalStock">Capital Stock</td>
              {this.renderCapitalStock()}
            </tr>
            <tr>
              <td className="balanceSheetInputRetainedEarnings">Retained Earnings</td>
              {this.renderRetainedEarnings()}
            </tr>
            <tr>
              <td className="balanceSheetInputTotalOwnersEquity">Total Owner's Equity</td>
              {this.renderTotalEquity()}
            </tr>
            <tr>
              <td className="balanceSheetInputTotalLiabilityAndEquity">Total Liabilities & Owner's Equity</td>
              {this.renderTotalLiabilityAndEquity()}
            </tr>
          </tbody>

        </table>
      </div>
    );
  }
}
