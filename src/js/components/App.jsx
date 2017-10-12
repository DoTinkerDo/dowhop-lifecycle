// @flow

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../store';
import Wrapper from './Wrapper';
import Landing from './Landing';
import AuthButton from './AuthButton';
import PrivateRoute from './PrivateRoute';
import PropsRoute from './PropsRoute';
import Login from './Login';
import ProfileContainer from '../containers/ProfileContainer';
import FourOhFour from './FourOhFour';
import { startListeningToAuthChanges } from '../actions/authentication';
import startListeningForCurrentUser from '../actions/current-user';
import { startListeningForUserProfileChanges } from '../actions/profile';

store.dispatch(startListeningToAuthChanges());
store.dispatch(startListeningForCurrentUser());
store.dispatch(startListeningForUserProfileChanges());

const App = () => (
  <Provider store={store}>
    <Wrapper>
      <AuthButton />
      <Switch>
        <Route exact path="/" component={Landing} />
        <PropsRoute path="/login" component={Login} />
        <PrivateRoute path="/profile" component={ProfileContainer} redirectTo="/login" />
        <Route component={FourOhFour} />
      </Switch>
    </Wrapper>
  </Provider>
);

export default App;
