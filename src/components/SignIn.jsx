import React from 'react';
import { auth, googleAuthProvider } from './firebase';
import { Row, Col, Button } from 'react-bootstrap';

const signInStyles = {
  position: 'absolute',
  top: '50%',
  left: '40%',
  fontSize: '150%'
};

function SignIn() {
  return (
    <Row>
      <Col xs={12} style={signInStyles}>
        <Button onClick={() => auth.signInWithPopup(googleAuthProvider)}>Sign In</Button>
      </Col>
    </Row>
  );
}

export default SignIn;
