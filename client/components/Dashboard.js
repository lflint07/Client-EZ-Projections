import _ from 'lodash';
import React, {Component} from 'react';
import {isEmpty} from '../helpers';
import EmployeeInfo from './EmployeeInfo';
import Inventory from './Inventory';
import SalesDetail from './SalesDetail';
import CostDetail from './CostDetail';
import ProfitLossStatement from './ProfitLossStatement';
import BalanceSheet from './BalanceSheet';
import CashFlow from './CashFlow';

export default class Dashboard extends Component {

  //INVENTORY METHODS
  units(key, unitsSoldRow){
    const product = this.products[key];
    const unitsRow = [product.unitsPerOrder];
    const unitsAddedRow = [];
    const remainingRow = [];
    _.times(36, i => {
      if(unitsRow[i] <= product.reorderPoint){
        unitsAddedRow.push(product.unitsPerOrder);
      } else {
        unitsAddedRow.push(0);
      }
      let remainingUnits = unitsRow[i] - unitsSoldRow[i] + (unitsAddedRow[i]);
      remainingRow.push(remainingUnits);
      if(i<35){
        unitsRow.push(remainingUnits);
      }
    });

    return [
      unitsRow,
      remainingRow,
      unitsAddedRow
    ];
  }

  unitsSold(key){
    const product = this.products[key];
    const fixedAssumptions = this.fixedAssumptions;
    const unitsSoldRow=[];
    _.times(36, i => {
      let units = product.unitsPerStore * (fixedAssumptions.assumption1.value / product.inventoryTurnoverInMonths);
      unitsSoldRow.push(units);
    });
    return unitsSoldRow;
  }

  //SALES DETAIL methods
  monthlySales(key, unitsSoldRow){
    const product = this.products[key];
    const salesRow = [];
    _.times(36, i => {
      let salesForMonth = product.price * unitsSoldRow[i];
      salesRow.push(salesForMonth);
    });

    return salesRow;
  }

  //COST DETAIL methods
  unitsOrdered(key, unitsAddedRow){
    const product = this.products[key];
    const unitsOrderedRow = [product.unitsPerOrder];
    _.times(35, i => {
      if (unitsAddedRow[i+1] === product.unitsPerOrder) {
        unitsOrderedRow.push(product.unitsPerOrder);
      } else {
        unitsOrderedRow.push(0);
      }
    });
    return unitsOrderedRow;
  }

  totalCost(key, unitsOrderedRow){
    const product = this.products[key];
    const totalCostRow = [];
    _.times(36, i => {
      if (unitsOrderedRow[i] === product.unitsPerOrder) {
        totalCostRow.push(product.totalCost);
      } else {
        totalCostRow.push(0);
      }
    });
    return totalCostRow;
  }

  costPerUnit(key, unitsOrderedRow, totalCostRow){
    const product = this.products[key];
    const costPerUnitRow = [];
    _.times(36, i => {
      if (totalCostRow[i] === product.totalCost){
        let costPerUnit = product.totalCost/unitsOrderedRow[i];
        _.times(product.inventoryTurnoverInMonths, i => {
          if (costPerUnitRow.length === 36) {
            return costPerUnitRow;
          }
          costPerUnitRow.push(costPerUnit);
        });
      }
    });
    return costPerUnitRow;
  }

  monthlyCost(key, costPerUnitRow, unitsSoldRow){
    const product = this.products[key];
    const monthlyCostRow = [];
    _.times(36, i => {
      let monthlyCostUnits = costPerUnitRow[i] * unitsSoldRow[i];
      monthlyCostRow.push(monthlyCostUnits);
    });
    return monthlyCostRow;
  }

  //P&L methods
  //total income
  totalIncome(){
    const productIds = Object.keys(this.products);
    const incomeArrayList = productIds.map((key) => {
      const unitsSoldRow = this.unitsSold(key);
      return this.monthlySales(key, unitsSoldRow);
    });
    const totalIncomeRow = incomeArrayList.reduce((total, array) => {
      array.forEach((number, i) => {
        total[i]=(total[i] || 0) + number;
      });
      return total;
    }, []);

    return totalIncomeRow;
  }
  //total cost
  costOfAll(){
    const productIds = Object.keys(this.products);
    const costArrayList = productIds.map((key) => {
      const unitsSoldRow = this.unitsSold(key);
      const unitsAddedRow = this.units(key, unitsSoldRow)[2];
      const unitsOrderedRow = this.unitsOrdered(key, unitsAddedRow);
      const totalCostRow = this.totalCost(key, unitsOrderedRow);
      const costPerUnitRow = this.costPerUnit(key, unitsOrderedRow, totalCostRow);
      return this.monthlyCost(key, costPerUnitRow, unitsSoldRow);
    });

    const costOfAllRow = costArrayList.reduce((total, array) => {
      array.forEach((number, i) => {
        total[i]=(total[i] || 0) + number;
      });
      return total;
    }, []);

    return costOfAllRow;
  }

  //gross margin method
  grossMargin(totalIncomeRow, costOfAllRow){
    return totalIncomeRow.map((number, i) => {
      return number = number - costOfAllRow[i];
    });
  }

  //total sales related expenses
  totalSalesExpenses(totalIncomeRow, filterExpenses, getExpensesArray){
    const assumptionIds = Object.keys(this.fixedAssumptions);
    const assumptionArrayList = assumptionIds.filter(filterExpenses)
      .map(getExpensesArray);
    const salesExpArrays = assumptionArrayList.map((array, i) => {
      return array.map((number, i ) => {
        return number = (number * 0.01) * totalIncomeRow[i];
      });
    });

    const totalExpenseRow = salesExpArrays.reduce((total, array) => {
      array.forEach((number, i) => {
        total[i]=(total[i] || 0) + number;
      });
      return total;
    }, []);

    return totalExpenseRow;
  }

  //fixed expenses
  totalExpenses(filterExpenses, getExpensesArray){
    const assumptionIds = Object.keys(this.fixedAssumptions);
    const assumptionArrayList = assumptionIds.filter(filterExpenses)
      .map(getExpensesArray);
    const totalExpenseRow = assumptionArrayList.reduce((total, array) => {
      array.forEach((number, i) => {
        total[i]=(total[i] || 0) + number;
      });
      return total;
    }, []);

    return totalExpenseRow;
  }

  //EBITDA methods
  ebitda(grossMarginRow, totalExpensesRow) {
    return grossMarginRow.map((number, i) => {
      return number = number - totalExpensesRow[i];
    });
  }

  //BALANCE SHEET METHODS
  actRec(totalIncomeRow){
    return totalIncomeRow.map((number, i) => {
      if (i === 0){
        return number;
      }
      return number = (this.fixedAssumptions.assumption18.value / 30) * number;
    });
  }

  inv(costOfAllRow){
    //make a total cost row from cost DETAIL
    const productIds = Object.keys(this.products);
    const totalCostArray = productIds.map((key) => {
      const unitsSoldRow = this.unitsSold(key);
      const unitsAddedRow = this.units(key, unitsSoldRow)[2];
      const unitsOrderedRow = this.unitsOrdered(key, unitsAddedRow);
      return this.totalCost(key, unitsOrderedRow);
    });
    const invOutlay = totalCostArray.reduce((total, array) => {
      array.forEach((number, i) => {
        total[i]=(total[i] || 0) + number;
      });
      return total;
    }, []);
    //then subtract the total cost of sales row from p&L
    const changeInValue = invOutlay.map((number, i) => {
      return number = number - costOfAllRow[i];
    });
    //find sum of row using last value
    let sum = 0;
    return changeInValue.map((number) => {
      return sum = sum + number;
    });
  }

  totalCurrentAssets(cashRow, arRow, invRow){
    //add AR & inv & cash
    return cashRow.map((number, i) => {
      return number = number + arRow[i] + invRow[i];
    });
  }

  totalAssets(){
    //same as current assets for now
    //add later
  }

  actPay(costOfAllRow, totalExpensesRow){
    //(ap value/ 30) * (cost of sales + fixed expenses)
    const totalExp = costOfAllRow.map((number, i) => {
      return number = number + totalExpensesRow[i];
    });

    return totalExp.map((number, i) => {
      if (i === 0){
        return number;
      }
      return number = (this.fixedAssumptions.assumption19.value / 30) * number;
    });
  }

  totalLiabilities(){
    //right now just AP
    //add this later - use actPay for now
  }

  capitalStock(equityRow){
    //accumulative, equity financing
    let sum = 0;
    return equityRow.map((number) => {
      return sum = sum + number;
    });
  }

  retainedEarnings(ebitdaRow){
    //accumulative, ebitda + last months ebitda
    let sum = 0;
    return ebitdaRow.map((number) => {
      return sum = sum + number;
    });
  }

  totalEquity(capitalStockRow, retainedEarningsRow){
    //capital Stock + retainedEarnings
    return capitalStockRow.map((number, i) => {
      return number = number + retainedEarningsRow[i];
    });
  }

  totalLiabilityAndEquity(totalLiabilityRow, totalEquityRow){
    //add total Liabilities and total equity
    return totalLiabilityRow.map((number, i) => {
      return number = number + totalEquityRow[i];
    });

  }

  //CASH FLOW METHODS
  changeInAR(arRow){
    //loop through actRec row and display if there is a change or push
    return arRow.map((number, i, array) => {
      if (i === 0) {
        return number;
      }

      return number = number - array[i-1];
    });
  }

  totalCashInflows(changeInArRow, totalIncomeRow){
    //sum of change in AR and total income
    return totalIncomeRow.map((number, i) => {
      return number = number - changeInArRow[i];
    })
  }

  changeInInv(invRow){
    // sames as change in AR from bal sheet but with inv
    return invRow.map((number, i, array) => {
      if (i === 0) {
        return number;
      }

      return number = number - array[i-1];
    });
  }

  changeInAP(apRow){
    //sames as change in AR from bal sheet but with AP
    return apRow.map((number, i, array) => {
      if (i === 0) {
        return number;
      }

      return number = number - array[i-1];
    });
  }

  totalCashOutFlows(changeInvRow, changeApRow, cosRow, fixExpRow){
    //sum of change of inv, change in AP, total COS, fixed exp
     return changeInvRow.map((number, i) => {
      return number = number + cosRow[i] + fixExpRow[i] - changeApRow[i];
    });
  }

  netCashFlow(cashInRow, cashOutRow){
    //cash inflows - cash outflows or add if negatives
    return cashInRow.map((number, i) => {
      return number = number - cashOutRow[i];
    });
  }

  equityFinancing(){
    //capital outlay
    const equityRow = [this.fixedAssumptions.assumption17.value];
    _.times(35, i => {
      equityRow.push(0);
    });
    return equityRow;
  }

  cash(netCashRow, equityRow){
    const beginCash = [0];
    const endCash = [];
    //beginning cash flow + net cash flow + equity financing
    _.times(36, i => {
      const balance = beginCash[i] + netCashRow[i] + equityRow[i];
      //ending cash pushed over one month
      endCash.push(balance);
      if (i < 35){
        beginCash.push(balance);
      }
    });

    return [
      beginCash,
      endCash
    ];
  }

  //RENDERING

  render(){
    const {products, fixedAssumptions} = this.props;

    if( isEmpty(products) || isEmpty(fixedAssumptions) ) {
      return <h4>Missing Products or Assumptions</h4>;
    }

    return(
      <div className="dashboard">
        <h2>Dashboard</h2>
        <div className="dashboardItem">
          <EmployeeInfo
            employees={this.props.employees}
          />
        </div>
        <div className="dashboardItem">
          <Inventory
            products={this.props.products}
            fixedAssumptions={this.props.fixedAssumptions}
            units = {this.units}
            unitsSold={this.unitsSold}
          />
        </div>
        <div className="dashboardItem">
          <SalesDetail
            products={this.props.products}
            fixedAssumptions={this.props.fixedAssumptions}
            unitsSold={this.unitsSold}
            monthlySales={this.monthlySales}
          />
        </div>
        <div className="dashboardItem">
          <CostDetail
            products={this.props.products}
            fixedAssumptions={this.props.fixedAssumptions}
            units={this.units}
            unitsSold={this.unitsSold}
            unitsOrdered={this.unitsOrdered}
            totalCost={this.totalCost}
            costPerUnit={this.costPerUnit}
            monthlyCost={this.monthlyCost}
          />
        </div>
        <div className="dashboardItem">
          <ProfitLossStatement
            products={this.props.products}
            fixedAssumptions={this.props.fixedAssumptions}
            units={this.units}
            unitsSold={this.unitsSold}
            unitsOrdered={this.unitsOrdered}
            totalCost={this.totalCost}
            costOfAll={this.costOfAll}
            costPerUnit={this.costPerUnit}
            monthlySales={this.monthlySales}
            monthlyCost={this.monthlyCost}
            totalIncome={this.totalIncome}
            grossMargin={this.grossMargin}
            totalSalesExpenses={this.totalSalesExpenses}
            totalExpenses={this.totalExpenses}
            ebitda={this.ebitda}
          />
        </div>
        <div className="dashboardItem">
          <BalanceSheet
            products={this.props.products}
            fixedAssumptions={this.props.fixedAssumptions}
            totalIncome={this.totalIncome}
            actRec={this.actRec}
            unitsSold={this.unitsSold}
            units={this.units}
            totalCost={this.totalCost}
            costPerUnit={this.costPerUnit}
            monthlyCost={this.monthlyCost}
            unitsOrdered={this.unitsOrdered}
            monthlySales={this.monthlySales}
            costOfAll={this.costOfAll}
            inv={this.inv}
            actPay={this.actPay}
            totalExpenses={this.totalExpenses}
            totalSalesExpenses={this.totalSalesExpenses}
            equityFinancing={this.equityFinancing}
            capitalStock={this.capitalStock}
            grossMargin={this.grossMargin}
            ebitda={this.ebitda}
            retainedEarnings={this.retainedEarnings}
            totalEquity={this.totalEquity}
            totalLiabilityAndEquity={this.totalLiabilityAndEquity}
            cash={this.cash}
            changeInAR={this.changeInAR}
            totalCashInflows={this.totalCashInflows}
            changeInInv={this.changeInInv}
            changeInAP={this.changeInAP}
            totalCashOutFlows={this.totalCashOutFlows}
            netCashFlow={this.netCashFlow}
            totalCurrentAssets={this.totalCurrentAssets}
          />
        </div>
        <div className="dashboardItem">
          <CashFlow
            products={this.props.products}
            fixedAssumptions={this.props.fixedAssumptions}
            totalIncome={this.totalIncome}
            unitsSold={this.unitsSold}
            monthlySales={this.monthlySales}
            units={this.units}
            unitsOrdered={this.unitsOrdered}
            totalCost={this.totalCost}
            costPerUnit={this.costPerUnit}
            monthlyCost={this.monthlyCost}
            costOfAll={this.costOfAll}
            totalExpenses={this.totalExpenses}
            totalSalesExpenses={this.totalSalesExpenses}
            equityFinancing={this.equityFinancing}
            actRec={this.actRec}
            changeInAR={this.changeInAR}
            totalCashInflows={this.totalCashInflows}
            inv={this.inv}
            changeInInv={this.changeInInv}
            actPay={this.actPay}
            changeInAP={this.changeInAP}
            totalCashOutFlows={this.totalCashOutFlows}
            netCashFlow={this.netCashFlow}
            cash={this.cash}
          />
        </div>
      </div>
    );
  }
}
