// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
// import injectSheet from 'react-jss';
import { logout } from '../actions/authentication';
import LoadingDots from './LoadingDots';

// const styles = {
//   pullRight: {
//     float: 'right !important',
//     marginBottom: '2%'
//   }
// };

const AuthButton = withRouter(({ history, authentication, logOut }) => (
  <Row className="float-right">
    <Col xs="12">
      {authentication.isAuthenticated ? (
        <Button
          onClick={() => {
            logOut();
            history.push('/my-profile/login');
          }}
        >
          Logout
        </Button>
      ) : (
        <Link to="/login">
          <Button>Login</Button>
        </Link>
      )}
      {authentication.status === 'AWAITING_AUTH_RESPONSE' && <LoadingDots />}
    </Col>
  </Row>
));

const mapStateToProps = ({ authentication }) => ({ authentication });

const mapDispatchToProps = (dispatch: Function) => ({
  logOut() {
    dispatch(logout());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthButton);
