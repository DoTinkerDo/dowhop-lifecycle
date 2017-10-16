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
  uid: string,
  email: string,
  about: Object,
  headline: Object,
  value: string,
  headlineValue: string,
  displayName: string,
  photoURL: string,
  handleChange: Function,
  handleHeadlineChange: Function,
  handleHeadlineSubmit: Function,
  handleSubmit: Function,
  headline: Object,
  classes: Object
}) => {
  const {
    uid,
    email,
    about,
    value,
    handleChange,
    handleSubmit,
    classes,
    displayName,
    photoURL,
    headlineValue,
    handleHeadlineChange,
    handleHeadlineSubmit,
    headline
  } = props;
  // console.log('HEADLINE: ', headline);
  return (
    <div>
      <Row>
        <Col xs="12" sm="6" md="5">
          {!photoURL && <LoadingDots />}
          <Card>
            <CardTitle className="center-text">{headline && headline.profileHeadline}</CardTitle>
            <Input
              type="text"
              value={headlineValue}
              placeholder="Write your headline..."
              onChange={handleHeadlineChange}
            />
            <Button onClick={e => handleHeadlineSubmit(e, headlineValue, uid)} className={classes.margin}>
              Submit
            </Button>
            <CardImg src={photoURL} alt={`headshot for ${displayName}`} />
            <CardBody>
              <CardSubtitle>Name:</CardSubtitle>
              <CardText>{displayName}</CardText>
              <CardSubtitle>About:</CardSubtitle>
              <CardText>{about && about.profileAbout}</CardText>
              <CardSubtitle>Contact:</CardSubtitle>
              <CardText>{email}</CardText>
              <Input type="text" value={value} placeholder="Write your about story..." onChange={handleChange} />
              <Button onClick={e => handleSubmit(e, value, uid)} className={classes.margin}>
                Submit
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default injectSheet(styles)(CurrentUser);
