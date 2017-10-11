// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import renderMergedProps from '../helpers/renderMergedProps';

const PrivateRoute = ({ component, redirectTo, authentication, ...rest }: Object) =>
  <Route
    {...rest}
    render={routeProps =>
      authentication.isAuthenticated
        ? renderMergedProps(component, routeProps, rest)
        : <Redirect
            to={{
              pathname: redirectTo,
              state: { from: routeProps.location }
            }}
          />}
  />;

const mapStateToProps = ({ authentication }) => ({ authentication });

export default connect(mapStateToProps)(PrivateRoute);
