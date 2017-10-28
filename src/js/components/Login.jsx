// @flow

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import FirebaseUIAuth from './FirebaseUIAuth';
import firebase, { ui } from '../../firebase';

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
    const { from } = this.props.location.state || { from: { pathname: '/my-profile' } };
    if (this.props.authentication.isAuthenticated) {
      return <Redirect to={from} />;
    }
    return (
      <Row>
        <Col>
          <p className="center-text">You must be logged in to view the page at {from.pathname}</p>
          <FirebaseUIAuth ui={ui} {...this.uiConfig} />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({ authentication });

export default connect(mapStateToProps)(Login);
