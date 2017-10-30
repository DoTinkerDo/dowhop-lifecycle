// @flow

import React from 'react';
import injectSheet from 'react-jss';

const styles = {
  button: {
    border: 'none',
    outline: 'none',
    font: 'normal normal normal 14px/1.4em "Avenir Light", Avenir Light, Arial, sans-serif',
    backgroundColor: '#ec1928',
    color: '#ffffff',
    textAlign: 'center',
    transition: 'all 0.4s ease 0s',
    '&:hover': {
      backgroundColor: '#ffffff',
      color: '#ec1928'
    },
    '&:focus': {
      backgroundColor: '#ffffff',
      color: '#ec1928'
    },
    height: '40px',
    minHeight: '19px',
    width: '142px',
    marginTop: '5px',
    marginBottom: '5px'
  }
};

const DoWhopButton = (props: { children: Object, classes: Object, onClick: Function }) => {
  const { children, classes, onClick } = props;
  return (
    <button className={classes.button} onClick={onClick}>
      {children}
    </button>
  );
};

export default injectSheet(styles)(DoWhopButton);
