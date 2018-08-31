[![Build Status](https://travis-ci.org/Lolobstant/un-redux.svg?branch=master)](https://travis-ci.org/Lolobstant/un-redux)

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[![Coverage Status](https://coveralls.io/repos/github/Lolobstant/un-redux/badge.svg)](https://coveralls.io/github/Lolobstant/un-redux)

# un-redux

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

A lite implementation of Redux using React new Context API.
The flavor of redux in a very small package, with the aim to help to change your Redux application to use React Context API, or in opposite use the full capability of redux with as little change to your code as possible.

### Getting Started

#### Installation

`npm i -S un-redux`

#### Usage

```js
import React from 'react';
import { render } from 'react-dom';

import Provider, { combineReducers, connect } from 'un-redux';

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

render(
  <Provider reducer={rootReducer} init={{}}>
    <ExampleConnected />
  </Provider>,
  document.querySelector('#demo')
);
```

#### API Reference

##### Provider

The Provider component take an optional `init` prop, and reducer

##### Store

Can be used in place of `connect` function and using directly React Consumer API:

```js
<Store.Consumer>
  {({ state, dispatch }) => <MyComponent {...state} />}
</Store.Consumer>
```

##### combineReducers([{}])

Used in the same way as Redux combineReducers:

> The `combineReducers' helper function turns an object whose values are different reducing functions into a single reducing function

##### connect([mapStateToProps], [mapDispatchToProps])

Connects a React component to a un-redux state.

`mapStateToProps(state) > props`

`mapDispatchToProps(dispatch) > props`
