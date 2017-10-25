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
  headlineValue: string,
  handleImageSubmit: Function,
  profileUrl: Object
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
    headline,
    handleImageSubmit,
    profileUrl
  } = props;

  const uid = props.location.search.slice(1);
  const selectedUser = filter(appUsers, user => user.uid === uid);
  const { profileImageUrl, displayName, profileAbout, profileHeadline, email } = selectedUser[0] || '';
  console.log(profileImageUrl);
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
            profileUrl={profileUrl.profileImageUrl.url}
            imageName={profileUrl.profileImageUrl.name}
            headlineValue={headlineValue}
            handleHeadlineChange={handleHeadlineChange}
            handleHeadlineSubmit={handleHeadlineSubmit}
            headline={headline}
            handleImageSubmit={handleImageSubmit}
          />
        )}
      </div>
    );
  }
  return (
    <Row>
      <Col xs="12" sm="6">
        {!profileImageUrl && <LoadingDots />}
        <Card>
          {profileHeadline && <CardTitle className="center-text profile-headline">{profileHeadline}</CardTitle>}
          <CardImg src={profileImageUrl} alt={`headshot for ${displayName}`} />
          <CardBody>
            <CardSubtitle>Name</CardSubtitle>
            <CardText>{displayName}</CardText>
            {profileAbout && <CardSubtitle>About</CardSubtitle>}
            {profileAbout && <CardText>{profileAbout}</CardText>}
            {email && <CardSubtitle>Contact</CardSubtitle>}
            {email && <CardText>{email}</CardText>}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Profile;
