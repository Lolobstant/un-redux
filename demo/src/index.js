import React from 'react';
import { render } from 'react-dom';

import Provider, { combineReducers, connect } from '../../src';

const rootReducer = combineReducers({
  reducerOne: (state = 10, action) => {
    if (action === 'INC') return state + 1;
    return state;
  },
  reducerTwo: (state = 5, action) => {
    if (action === 'DEC') return state - 1;
    return state;
  },
});

function Example({ incNum, decNum, increaseAction, decreaseAction }) {
  return (
    <div>
      <h1>un-redux Demo</h1>
      <h2>Number of Increase:</h2>
      <p>{incNum}</p>
      <button type="button" onClick={increaseAction}>
        Increase
      </button>
      <hr />
      <h2>Number of Decrease:</h2>
      <p>{decNum}</p>
      <button type="button" onClick={decreaseAction}>
        Decrease
      </button>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    incNum: state.reducerOne,
    decNum: state.reducerTwo,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    increaseAction: () => dispatch('INC'),
    decreaseAction: () => dispatch('DEC'),
  };
}

const ExampleConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(Example);

function Demo() {
  return (
    <Provider init={{}} reducer={rootReducer}>
      <ExampleConnected />
    </Provider>
  );
}

render(<Demo />, document.querySelector('#demo'));
