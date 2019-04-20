import React from 'react';
import CV from "./index.js"
import renderer from 'react-test-renderer';
import bio from 'bio.js';

it('renders correctly', () => {
  const tree = renderer
    .create(<CV {...{
      data: bio
    }}/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
