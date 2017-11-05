// @flow

import React, { Component } from 'react';
import 'firebaseui/dist/firebaseui.css';

type Props = {
  ui: Object
};

class FirebaseUIAuth extends Component<Props> {
  componentDidMount() {
    const { ui, ...uiConfig } = this.props;
    this.ui = ui;
    this.ui.start(this.container, uiConfig);
  }

  componentWillUnmount() {
    this.ui.reset();
  }

  props: Props;
  ui: Object;
  container: ?HTMLDivElement;

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
