// @flow

import React from 'react';
import { Col, Card, CardSubtitle, CardText, CardBody, CardImg, Form, Input, Row } from 'reactstrap';
import LoadingDots from './LoadingDots';
import ProfileInput from './ProfileInput';

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
            <ProfileInput
              headline={headline}
              headlineValue={headlineValue}
              handleHeadlineChange={handleHeadlineChange}
              handleHeadlineSubmit={handleHeadlineSubmit}
              uid={uid}
            />
            <CardImg src={photoURL} alt={`headshot for ${displayName}`} />
            <CardBody>
              <CardSubtitle>Name:</CardSubtitle>
              <CardText>{displayName}</CardText>
              <div>
                <Form onSubmit={e => handleSubmit(e, value, uid)}>
                  <CardSubtitle>About:</CardSubtitle>
                  <CardText>{about && about.profileAbout}</CardText>
                  <Input
                    type="text"
                    value={value}
                    placeholder="Write your about story..."
                    onChange={handleChange}
                    className="profile-about-input"
                  />
                  <Input type="submit" hidden />
                </Form>
              </div>
              <CardSubtitle>Contact:</CardSubtitle>
              <CardText>{email}</CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CurrentUser;
