import { Presentation } from './Presentation';
import React from 'react';
import CV from "./index.js"
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import bio from 'bio.js';

it('renders correctly', () => {
  const tree = renderer
    .create(<MemoryRouter><Presentation></Presentation></MemoryRouter>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

