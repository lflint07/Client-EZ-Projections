import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {getFunName} from '../helpers';

export default class Company extends Component {
  goToCompany(event) {
    event.preventDefault();

    //grab text from box
    console.log(this.companyInput.value);
    //transition to /company/:compId
  }

  render() {
    return (
     <form onSubmit={(e) => this.goToCompany(e)}>
       <h2>Please Enter A Company</h2>
       <input
         type="text"
         placeholder="Company Name"
         defaultValue={getFunName()}
         ref={input => {this.companyInput = input}}
       />
       <button type="submit">Go to Company -></button>
     </form>);
  }
}

Company.contextTypes = {
  router: React.PropTypes.object
}
