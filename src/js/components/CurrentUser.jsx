// @flow

import React from 'react';
import { Col, Card, CardSubtitle, CardText, CardBody, CardImg, Row } from 'reactstrap';
import LoadingDots from './LoadingDots';
import ProfileHeadlineInput from './ProfileHeadlineInput';
import ProfileAboutInput from './ProfileAboutInput';

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
  headline: Object
}) => {
  const {
    uid,
    email,
    about,
    value,
    handleChange,
    handleSubmit,
    displayName,
    photoURL,
    headlineValue,
    handleHeadlineChange,
    handleHeadlineSubmit,
    headline
  } = props;
  return (
    <div>
      <Row>
        <Col xs="12" sm="6">
          {!photoURL && <LoadingDots />}
          <Card>
            <CardBody>
              <ProfileHeadlineInput
                headline={headline}
                headlineValue={headlineValue}
                handleHeadlineChange={handleHeadlineChange}
                handleHeadlineSubmit={handleHeadlineSubmit}
                uid={uid}
              />
            </CardBody>
            <CardImg src={photoURL} alt={`headshot for ${displayName}`} />
            <CardBody>
              <CardSubtitle>Name</CardSubtitle>
              <CardText>{displayName}</CardText>
              <ProfileAboutInput
                about={about}
                value={value}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                uid={uid}
              />
              <CardSubtitle>Contact</CardSubtitle>
              <CardText>{email}</CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CurrentUser;
