import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
import { startListeningToAuthChanges } from './actions/authentication';
import startListeningForCurrentUser from './actions/current-user';
import { startListeningForUserProfileChanges } from './actions/profile';
import { startListeningForUserProfileImageChanges } from './actions/user-profile-image';
import startListeningForAppUsers from './actions/app-users';
import { startListeningForProfileSocialMediaLinkChanges } from './actions/profile-social-media-links';
import startListeningForProfileChanges from './actions/app-profiles';

// const middleware = [thunk];
// const enhancers = [];
/* eslint-disable no-underscore-dangle */
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

// const store = createStore(reducer, composeEnhancers(applyMiddleware(...middleware), ...enhancers));

/* eslint-disable no-underscore-dangle */
const store = createStore(
  reducer,
  compose(
    applyMiddleware(thunk),
    typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
    //     // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    //     // typeof window === 'object' &&
    //     // typeof window.__REDUX_DEVTOOLS_EXTENSION__ &&
    //     // window.__REDUX_DEVTOOLS_EXTENSION__() !== 'undefined'
    //     //   ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    //     //   : f => f
  )
);
/* eslint-enable */

store.dispatch(startListeningToAuthChanges());
store.dispatch(startListeningForCurrentUser());
store.dispatch(startListeningForUserProfileChanges());
store.dispatch(startListeningForAppUsers());
store.dispatch(startListeningForUserProfileImageChanges());
store.dispatch(startListeningForProfileSocialMediaLinkChanges());
store.dispatch(startListeningForProfileChanges());

export default store;
