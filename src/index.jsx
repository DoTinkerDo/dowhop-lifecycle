// @flow

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './js/components/App';

import './sass/main.scss';

// add only for testing
// window.Perf = Perf;
// Perf.start();

const renderApp = () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById('root')
  );
};
renderApp();

if (module.hot) {
  module.hot.accept('./js/components/App', () => {
    renderApp();
  });
}
