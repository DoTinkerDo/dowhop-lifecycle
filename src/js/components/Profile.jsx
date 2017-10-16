// @flow

import React from 'react';
import { filter } from 'lodash';
import { Col, Card, CardSubtitle, CardText, CardBody, CardImg, CardTitle, Row } from 'reactstrap';
import LoadingDots from './LoadingDots';
import CurrentUser from './CurrentUser';

const Profile = (props: {
  currentUser: Object,
  about: Object,
  value: string,
  handleChange: Function,
  handleSubmit: Function,
  appUsers: Object,
  location: Object,
  appUsers: Object,
  handleHeadlineChange: Function,
  handleHeadlineSubmit: Function,
  headline: Object,
  headlineValue: string
}) => {
  const {
    currentUser,
    about,
    value,
    handleChange,
    handleSubmit,
    appUsers,
    headlineValue,
    handleHeadlineChange,
    handleHeadlineSubmit,
    headline
  } = props;

  const uid = props.location.search.slice(1);
  const selectedUser = filter(appUsers, user => user.uid === uid);
  const { photoURL, displayName, profileAbout, email } = selectedUser[0] || '';

  if (currentUser.uid === uid || !uid) {
    return (
      <div>
        {!currentUser ? (
          <LoadingDots />
        ) : (
          <CurrentUser
            uid={currentUser.uid}
            email={currentUser.email}
            displayName={currentUser.displayName}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            value={value}
            about={about}
            photoURL={currentUser.photoURL}
            headlineValue={headlineValue}
            handleHeadlineChange={handleHeadlineChange}
            handleHeadlineSubmit={handleHeadlineSubmit}
            headline={headline}
          />
        )}
      </div>
    );
  }
  return (
    <Row>
      <Col xs="12" sm="6" md="5">
        {!photoURL && <LoadingDots />}
        <Card>
          <CardTitle className="center-text">Placeholder for {displayName} Profile Headline!</CardTitle>
          <CardImg src={photoURL} alt={`headshot for ${displayName}`} />
          <CardBody>
            <CardSubtitle>Name:</CardSubtitle>
            <CardText>{displayName}</CardText>
            {profileAbout && <CardSubtitle>About:</CardSubtitle>}
            {profileAbout && <CardText>{profileAbout}</CardText>}
            <CardSubtitle>Contact:</CardSubtitle>
            <CardText>{email}</CardText>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Profile;
