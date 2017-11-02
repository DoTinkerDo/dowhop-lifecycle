// @flow

import React from 'react';
import injectSheet from 'react-jss';

const styles = {
  icon: {
    marginRight: '5px'
  }
};

const SocialIcons = (props: { siteName: string, classes: Object }) => {
  const { siteName, classes } = props;
  return <span className={`fa ${siteName} fa-2x ${classes.icon}`} />;
};

export default injectSheet(styles)(SocialIcons);
