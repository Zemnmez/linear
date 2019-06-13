import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import log from "@zemnmez/macros/log.macro";

export default class Storage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: undefined
    }

    this.onStorageEvent = this.onStorageEvent.bind(this);
  }

  values() { return this.props.values }

  key() { return this.props.name }

  deserialize(json) {
    return json? new Map(Object.entries(JSON.parse(json))): new Map()
}

  storageArea() { return this.props.storageArea || localStorage }

  currentValueFromStorage() { return this.deserialize(this.storageArea().get(this.key())) }

  bindStorageEvent(handler) {
    const storageArea = this.storageArea();
    if (storageArea.bindStorageEvent) return storageArea.bindStorageEvent(handler);

    return window.addEventListener('storage', handler, false);
  }

  unbindStorage(handler) {
    const storageArea = this.storageArea();
    if (storageArea.unbindStorageEvent) return storageArea.unbindStorageEvent(handler);

    return window.removeEventListener('storage', handler, false);
  }

  onStorageEvent({ key, oldValue, newValue, storageArea }) {
    if (storageArea != this.storageArea()) return;
    if (key != this.key()) return;
    if (oldValue == newValue) return;

    this.setState({entries: this.deserialize(newValue)});
  }

  componentDidUpdate() {
    const [key, value] = [this.key(), JSON.stringify(this.values())];
    log({key, value});
    this.storageArea().set(key, value);
  }

  componentDidMount() {
    this.setState(() => {
      this.bindStorageEvent(this.onStorageEvent);
      return { entries: this.currentValueFromStorage() };
    })
  }

  componentWillUnmount() { this.unbindStorage(this.onStorageEvent) }

  render() {
    const { children } = this.props;
    log(this.state);

    return children(this.state.entries);
  }

}

Storage.propTypes = {
  children: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired,
  storageArea: PropTypes.shape({
    get: PropTypes.func.isRequired,
    set: PropTypes.func.isRequired,
    getBytesInUse: PropTypes.func, // will become required when we use it
    remove: PropTypes.func,
    clear: PropTypes.func,
    bindStorageEvent: PropTypes.func, // for testing
    unbindStorageEvent: PropTypes.func // testing
  })
}

export const PersistProps = ({ name }) => Component => React.forwardRef(
  (props, ref) => <Storage {...{
    name, values: props
  }}>
    {props => <Component ref={ref} {...props}/>}
  </Storage>
);

