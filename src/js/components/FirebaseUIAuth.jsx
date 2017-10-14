// @flow

import React, { Component } from 'react';
import 'firebaseui/dist/firebaseui.css';

class FirebaseUIAuth extends Component {
  componentDidMount() {
    const { ui, ...uiConfig } = this.props;
    this.ui = ui;
    this.ui.start(this.container, uiConfig);
  }

  componentWillUnmount() {
    this.ui.reset();
  }

  props: {
    ui: Object
  };

  ui: Object;
  container: string;

  render() {
    return (
      <div
        ref={el => {
          this.container = el;
        }}
      />
    );
  }
}

export default FirebaseUIAuth;
