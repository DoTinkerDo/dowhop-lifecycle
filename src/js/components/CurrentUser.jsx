// @flow

import React from 'react';
import { Button, Col, Card, CardSubtitle, CardText, CardBody, CardImg, CardTitle, Input, Row } from 'reactstrap';
import injectSheet from 'react-jss';
import LoadingDots from './LoadingDots';

const styles = {
  margin: {
    marginTop: '1%'
  }
};

const CurrentUser = (props: {
  user: Object,
  profile: string,
  value: string,
  handleChange: Function,
  handleSubmit: Function,
  classes: Object
}) => {
  const { user, profile, value, handleChange, handleSubmit, classes } = props;
  return (
    <Row>
      <Col xs="12" sm="6" md="5">
        {!user.photoURL && <LoadingDots />}
        <Card>
          <CardTitle className="center-text">Placeholder for User Profile Headline</CardTitle>
          <CardImg src={user.photoURL} alt={`headshot for ${user.displayName}`} />
          <CardBody>
            <CardSubtitle>Name:</CardSubtitle>
            <CardText>{user.displayName}</CardText>
            <CardSubtitle>Bio:</CardSubtitle>
            <CardText>{profile.bio || 'Write a short bio to tell about yourself'}</CardText>
            <CardSubtitle>Contact:</CardSubtitle>
            <CardText>{user.email}</CardText>
            <Input type="text" value={value} placeholder="Enter your bio" onChange={handleChange} />
            <Button onClick={e => handleSubmit(e, value, user.uid)} className={classes.margin}>
              Save
            </Button>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default injectSheet(styles)(CurrentUser);
