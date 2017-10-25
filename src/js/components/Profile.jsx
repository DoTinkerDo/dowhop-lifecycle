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
  const { displayName, profileAbout, profileHeadline, email } = selectedUser[0] || '';
  let { profileImageUrl } = selectedUser[0] || '';

  profileImageUrl = profileImageUrl || {
    url:
      'https://firebasestorage.googleapis.com/v0/b/dowhop-lifecycle.appspot.com/o/dowhop-icons%2Fdowhop-icon.png?alt=media&token=4ce2cb46-d5f0-4bbc-bb9d-b25ca886e634'
  };

  // Check if user is checking own profile with edit
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
  // otherwise just view a profile
  return (
    <Row>
      <Col xs="12" sm="6">
        <Card>
          {profileHeadline && <CardTitle className="center-text profile-headline">{profileHeadline}</CardTitle>}
          {!profileImageUrl && <LoadingDots />}
          {profileImageUrl && <CardImg src={profileImageUrl.url} alt={`headshot for ${displayName}`} />}
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
