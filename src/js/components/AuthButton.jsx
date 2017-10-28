// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import DoWhopButton from './DoWhopButton';
import { logout } from '../actions/authentication';
import LoadingDots from './LoadingDots';

const AuthButton = withRouter(({ history, authentication, logOut }) => (
  <Row className="float-right">
    <Col xs="12">
      {authentication.isAuthenticated ? (
        <DoWhopButton
          onClick={() => {
            logOut();
            history.push('/my-profile/login');
          }}
        >
          Logout
        </DoWhopButton>
      ) : (
        <Link to="/my-profile/login">
          <DoWhopButton>Login</DoWhopButton>
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
