import React from 'react';
import PropTypes from 'prop-types';

import injectSheet from 'react-jss';
import shortid from 'shortid';
import { clone } from 'ramda';

import style from './style';

export class MasterFilter extends React.Component {
  static propTypes = {
    filters: PropTypes.shape({}),
    onRefilter: PropTypes.func.isRequired,
    components: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.shape({})
      )
    ),
    classes: PropTypes.shape({
      root: PropTypes.string,
      row: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    filters: {},
    components: {},
  };

  state = {
    children: null,
  };

  componentWillMount() {
    const { components } = this.props;
    this.setState({
      children: this.mapRow(components),
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  mapColumns = filters => filters.map(({ Component, id }) => {
    const filter = this.props.filters[id];
    if (filter === undefined) {
      throw TypeError(`Filter for id: ${id} not found`);
    }
    return (
      <Component
        key={shortid.generate()}
        onChange={this.updateFilterState(id)}
        state={filter.state}
      />
    );
  });

  mapRow = components => components.map(row => (
    <div key={shortid.generate()} className={this.props.classes.row}>
      {this.mapColumns(row)}
    </div>
  ));

  updateFilterState = id => (newState) => {
    const { filters, onRefilter } = this.props;

    const newFilter = Object.assign({}, filters[id], {
      state: newState,
    });

    const newFilters = Object.assign({}, filters, {
      [id]: newFilter,
    });

    return onRefilter(newFilters);
  }

  render() {
    return (
      <div className={this.props.classes.root}>
        {this.state.children}
      </div>
    );
  }
}

export default injectSheet(style)(MasterFilter);
