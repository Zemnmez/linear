import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';

class Storage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { }

    this.onStorageEvent = this.onStorageEvent.bind(this);
  }

  storageArea() { return {localStorage: localStorage, sessionStorage: sessionStorage}[ this.props.storageArea || "localStorage"] }

  key() { return this.props.name }

  deserialize(json) { return json? new Map(Object.entries(JSON.parse(json))): new Map() }

  currentValueFromLocalStorage() { return this.deserialize(localStorage.get(this.key())); }

  onStorageEvent({ key, oldValue, newValue, storageArea }) {
    if (storageArea != this.storageArea()) return;
    if (key != this.key()) return;
    if (oldValue == newValue) return;

    this.setState(this.deserialize(newValue));
  }

  componentDidMount() {
    this.setState(() => {
      window.addEventListener('storage', this.onStorageEvent, false);
      return this.currentValueFromLocalStorage();
    })
  }

  componentWillUnmount() { window.removeEventListener('storage', this.onStorageEvent, false) }

  render() {
    const { children } = this.props;
    React.Children.only(children)(this.state);
  }

}

Storage.propTypes = {
  children: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  storageArea: PropTypes.string
}
