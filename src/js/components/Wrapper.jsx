// @flow

import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import injectSheet from 'react-jss';

const styles = {
  background: {
    backgroundColor: '#eeeeee'
  }
};

const Wrapper = ({ classes, children }: Object) => (
  <Container className={classes.background}>
    <Row>
      <Col md={12}>
        <div className="site-content">
          <div className="site-main">{children}</div>
        </div>
      </Col>
    </Row>
  </Container>
);

export default injectSheet(styles)(Wrapper);
