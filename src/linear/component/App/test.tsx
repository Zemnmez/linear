import { MemoryRouter } from 'react-router';
import React from 'react';
import Base from './base';

export const Test:
    React.FC<{}>
=
    ({ children }) => <Base>
        <MemoryRouter
            initialEntries={["/"]}
            initialIndex={0}
        >
            {children}
        </MemoryRouter>
    </Base>

export default Test;