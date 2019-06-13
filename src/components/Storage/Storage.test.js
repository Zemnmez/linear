import React from 'react';
import { render } from '@testing-library/react';
import Storage from './Storage';
import { Map } from 'immutable';

const MockStorage = new class MockStorage {
  storageMap = new Map();

  get(key) { return this.storageMap.get(key) }

  set(key, newValue) {

    if (typeof key!="string") throw "key must be string, instead " + typeof key;
    if (typeof newValue!="string") throw "value must be string, instead " + typeof value;

    [key, newValue] = [""+key, ""+newValue];
    const oldValue = this.get(key);
    this.storageMap = this.storageMap.set(key, newValue)
    this.storageEventHandler && this.storageEventHandler({
      oldValue, newValue, storageArea: this, key
    });
  }

  bindStorageEvent(hnd) { this.storageEventHandler = hnd }

  unbindStorageEvent() { delete this.storageEventHandler }
}()

it('passes props correctly', () => {
  const props = {
    name: "test-storage-component",
    values: {
      key: "some value",
      key2: "some value"
    },
    storageArea: MockStorage
  };
  window.localStorage = {
    get: () => 1
  };


  const { getByText } = render(<Storage {...props}>
    {(...args) => <div>{JSON.stringify(args)}</div>}
  </Storage>);
  expect(getByText(JSON.stringify([ props.values ]))).toBeInTheDocument();
});
