import React, { Component } from 'react';
import { auth, googleAuthProvider } from './firebase';
import { Row, Col, Button } from 'react-bootstrap';

class SignIn extends Component {
  render() {
    return (
      <Row>
        <Col xs={12} style={{ position: "absolute", top: "50%", left: "40%", fontSize: "150%"}}>
          <Button onClick={() => auth.signInWithPopup(googleAuthProvider)}>
            Sign In
          </Button>
        </Col>
      </Row>
    );
  }
}

export default SignIn;
