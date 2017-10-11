// @flow

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
// import injectSheet from 'react-jss';
import FirebaseUIAuth from './FirebaseUIAuth';
import firebase, { ui } from '../../firebase';

// const styles = {
//   margin: {
//     marginBottom: '20%'
//   }
// };

class Login extends Component {
  uiConfig = {
    callbacks: {
      signInSuccess: () => false
    },
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ]
  };

  props: {
    location: Object,
    authentication: Object
  };

  render() {
    // const { classes } = this.props;
    const { from } = this.props.location.state || { from: { pathname: '/' } };

    if (this.props.authentication.isAuthenticated) {
      return <Redirect to={from} />;
    }
    return (
      <Row>
        <p className="text-center">You must be logged in to view the page at {from.pathname}</p>
        <FirebaseUIAuth ui={ui} {...this.uiConfig} />
      </Row>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({ authentication });

export default connect(mapStateToProps)(Login);

// export default injectSheet(styles)(Login);
