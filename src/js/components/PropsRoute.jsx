// @flow

import React from 'react';
import { Route } from 'react-router-dom';
import renderMergedProps from '../helpers/renderMergedProps';

const PropsRoute = ({ component, ...rest }: Object) =>
  <Route {...rest} render={routeProps => renderMergedProps(component, routeProps, rest)} />;

export default PropsRoute;
