import React from 'react';
import PropTypes from 'prop-types';
import flyd from 'flyd';

const Context = React.createContext({
  state: {},
  dispatch: () => {
    throw new Error('Wrap the Consumer in the <Provider> element');
  },
});

const update$ = flyd.stream();

export function combineReducers(reducers) {
  return (state, action) =>
    Object.entries(reducers).reduce(
      (acc, [key, func]) => ({
        ...acc,
        [key]: func(state[key], action),
      }),
      {}
    );
}

export default class Provider extends React.Component {
  static propTypes = {
    init: PropTypes.object,
    reducer: PropTypes.func,
    children: PropTypes.element,
  };

  static defaultProps = {
    init: {},
    reducer: state => state,
    children: <div>Provider enabled</div>,
  };

  state = this.props.init;

  componentDidMount() {
    // this.dispatch('INITIALISATION');
    update$('INITIALISATION')
      .pipe(flyd.scan(this.props.reducer, this.state))
      .map(this.applyState);
  }

  dispatch = action => {
    update$(action);
  };

  applyState = state => {
    this.setState(state);
  };
  // dispatch = action => {
  //   console.info('[DISPATCH]', action);
  //   this.setState(
  //     state => this.props.reducer(state, action), // this.callReducer(action, state),
  //     () => console.log('[NEW STATE]', this.state)
  //   );
  // };

  render() {
    const {
      state,
      dispatch,
      props: { children },
    } = this;
    return (
      <Context.Provider
        value={{
          state,
          dispatch,
        }}
      >
        {children}
      </Context.Provider>
    );
  }
}

const connect = (mapStateToProps, mapDispatchToProps) => Children => () => (
  <Context.Consumer>
    {({ state, dispatch }) => {
      const stateToProps =
        typeof mapStateToProps === 'function' ? mapStateToProps(state) : {};
      const dispatchToProps =
        typeof mapDispatchToProps === 'function'
          ? mapDispatchToProps(dispatch)
          : {};
      const props = { ...stateToProps, ...dispatchToProps };
      return <Children {...props} />;
    }}
  </Context.Consumer>
);

export { Context as Store, update$ as dispatch, connect };
