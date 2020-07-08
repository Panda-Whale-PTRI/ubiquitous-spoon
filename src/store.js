/**
 * ************************************
 *
 * @module  store.js
 * @author
 * @date
 * @description Redux 'single source of truth'
 *
 * ************************************
 */

import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './reducers/index';
import { loadState } from './localStorage';

const persistedState = loadState();

// console.log('Initial Persited State :: ', persistedState);

// we are adding composeWithDevTools here to get easy access to the Redux dev tools
const store = createStore(reducers, persistedState, composeWithDevTools());

/* 
  a subscription method for checking the current state of redux
  every changes to redux will call this function cos its
  subscribed to the store
*/
// store.subscribe(() => {
//   const currentState = store.getState();
//   console.log('Curretn Source of Truth :: ', currentState);
// });

export default store;
