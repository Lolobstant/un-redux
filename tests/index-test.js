import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import TestRenderer from 'react-test-renderer';

import Provider, { Store, combineReducers, connect } from 'src/';

it('Should export Provider, Store, combineReducers, connect', () => {
  expect(Provider).toExist();
  expect(Store).toExist();
  expect(combineReducers).toExist();
  expect(connect).toExist();
});

describe('Provider', () => {
  it('Should render without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Provider />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('Should have an object as initial state and function as reducer', () => {
    const provider = new Provider(Provider.defaultProps);
    expect(provider.state).toEqual(Provider.defaultProps.init);
  });

  it('Should accept in props an init object', () => {
    const expected = { toto: 'titi' };
    const provider = new Provider({ init: expected });
    expect(provider.state).toEqual(expected);
  });
});

describe('Store', () => {
  it('Should pass a renderProp with state and dispatch func', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Store.Consumer>
        {({ state, dispatch }) => {
          expect(state).toEqual({});
          expect(dispatch).toExist();
          expect(dispatch).toThrow(
            'Wrap the Consumer in the <Provider> element'
          );
        }}
      </Store.Consumer>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('combineReducers', () => {
  it('Should take an object and return a function', () => {
    expect(typeof combineReducers({})).toEqual('function');
  });

  it('The function returned should return a state', () => {
    const reducers = {
      one: (state = '', action) => {
        expect(action).toEqual('action');
        return `${state}one`;
      },
      two: (state = '') => `${state}two`,
    };
    const expected = { one: 'one', two: 'two' };
    const actual = combineReducers(reducers)({}, 'action');
    expect(actual).toEqual(expected);
  });
});

describe('connect', () => {
  it('Should be a function', () => {
    expect(typeof connect).toBe('function');
  });
  it('Should return a function', () => {
    const actual = connect();
    expect(typeof actual).toBe('function');
  });
  it('Should return a component, with the component passed as child ', () => {
    const cases = [
      {
        element: function element(props) {
          expect(props).toExist();
          const { propOne, propTwo, act1, ownPropOne, ownPropTwo } = props;
          expect(propOne).toExist();
          expect(propTwo).toExist();
          expect(ownPropOne).toExist();
          expect(ownPropTwo).toExist();
          expect(propOne).toEqual('state.one');
          expect(propTwo).toEqual('state.two');
          expect(ownPropOne).toEqual('prop.one');
          expect(ownPropTwo).toEqual('prop.two');
          expect(act1).toExist();
          expect(act1).toThrow('Wrap the Consumer in the <Provider> element');
          return (
            <div>
              <span className="One">{propOne}</span>
              <main className="Two">{propTwo}</main>
            </div>
          );
        },
        mapStateToProps: expect.createSpy().andCall((state, ownProp) => {
          expect(state).toExist();
          expect(ownProp).toExist();
          expect(ownProp).toEqual({
            ownPropOne: 'prop.one',
            ownPropTwo: 'prop.two',
          });
          return {
            propOne: 'state.one',
            propTwo: 'state.two',
          };
        }),
        mapDispatchToProps: expect.createSpy().andCall((dispatch, ownProp) => {
          expect(dispatch).toExist();
          expect(ownProp).toExist();
          expect(ownProp).toEqual({
            ownPropOne: 'prop.one',
            ownPropTwo: 'prop.two',
          });
          expect(typeof dispatch).toBe('function');
          return {
            act1: () => dispatch('act1'),
          };
        }),
      },
      {
        element: () => <h1 className="Three">test-three</h1>,
      },
    ];

    cases.map(el => {
      const Connected = connect(
        el.mapStateToProps,
        el.mapDispatchToProps
      )(el.element);
      const testRenderer = TestRenderer.create(
        <Connected ownPropOne="prop.one" ownPropTwo="prop.two" />
      );

      if (el.mapStateToProps) expect(el.mapStateToProps).toHaveBeenCalled();
      if (el.mapDispatchToProps)
        expect(el.mapDispatchToProps).toHaveBeenCalled();
      return el;
    });
  });
});
