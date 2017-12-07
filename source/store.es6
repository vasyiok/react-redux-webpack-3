import {applyMiddleware, createStore} from 'redux';
import rootReducer from './reducers/index.es6';
import thunk from 'redux-thunk';

export default createStore(
    rootReducer,
    applyMiddleware(thunk)
);