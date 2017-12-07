import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import projectStore from './store.es6';

import './style.scss';

ReactDOM.render(
    <Provider store={projectStore}>
        <h1>Hello world!</h1>
    </Provider>,
    document.getElementById('root')
);