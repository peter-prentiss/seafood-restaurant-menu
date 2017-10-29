import React, { Component } from 'react';
import { getFunName } from '../helpers';
import PropTypes from 'prop-types';

class StorePicker extends Component {
  // constructor() {
  //   super();
  //   this.goToStore = this.goToStore.bind(this);
  // }

  goToStore(e) {
    console.log('You changed the url');
    e.preventDefault();
    const storeId = this.storeInput.value;
    console.log(`Going to ${storeId}`);
    this.props.history.push(`/store/${storeId}`);
  }

  render() {
    return (
      <form onSubmit={(e) => this.goToStore(e)} className="store-selector">
        <h2>Please Enter A Store</h2>
        <input type="text" required placeholder="Store Name" defaultValue={getFunName()} ref={(input) => { this.storeInput = input }}/>
        <button type="submit">Visit Store</button>
      </form>
    )
  }
}

StorePicker.propTypes = {
  history: PropTypes.object
}

export default StorePicker;
