// @flow

import React from 'react';
import injectSheet from 'react-jss';

const styles = {
  colors: {
    backgroungColor: 'red'
  }
};

const DoWhopButton = ({ children, classes }: Object) => <button className={classes.colors}>{children}</button>;

export default injectSheet(styles)(DoWhopButton);
