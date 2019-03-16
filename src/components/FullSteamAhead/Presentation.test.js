import { Presentation } from './Presentation';
import React from 'react';
import ReactDOM from 'react-dom';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Presentation>
      <div> this is slide 1!</div>
    </Presentation>, div);
});
