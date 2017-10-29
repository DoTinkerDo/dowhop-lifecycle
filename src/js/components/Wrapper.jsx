// @flow

import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import injectSheet from 'react-jss';
import AuthButton from './AuthButton';

const styles = {
  background: {
    backgroundColor: '#eeeeee'
  }
};

const Wrapper = ({ classes, children }: Object) => (
  <Container className={classes.background}>
    <Row>
      <Col className="offset-md-3">
        <AuthButton />
      </Col>
    </Row>
    <Row>
      <Col className="site-content">
        <div className="site-main">{children}</div>
      </Col>
    </Row>
  </Container>
);

export default injectSheet(styles)(Wrapper);
