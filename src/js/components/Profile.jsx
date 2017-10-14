// @flow

import React from 'react';
import { filter } from 'lodash';
import { Col, Card, CardBody, CardImg, CardTitle, Row } from 'reactstrap';
import LoadingDots from './LoadingDots';
import CurrentUser from './CurrentUser';

const Profile = (props: {
  currentUser: Object,
  profile: string,
  value: string,
  handleChange: Function,
  handleSubmit: Function,
  appUsers: Object,
  location: Object
}) => {
  const { currentUser, profile, value, handleChange, handleSubmit } = props;
  // const { uid } = props.match.params;
  const uid = props.location.search.slice(1);
  const selectedUser = filter(props.appUsers, user => user.uid === uid);
  const { photoURL, displayName, profileAbout, email } = selectedUser[0] || '';

  if (currentUser.uid === uid || !uid) {
    return (
      <div>
        {!currentUser ? (
          <LoadingDots />
        ) : (
          <CurrentUser
            user={currentUser}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            value={value}
            profile={profile}
          />
        )}
      </div>
    );
  }
  return (
    <Row>
      <Col>
        {!photoURL && <LoadingDots />}
        <Card>
          <CardImg src={photoURL} alt={`headshot for ${displayName}`} />
          <CardBody>
            <CardTitle>{displayName}</CardTitle>
            <p>{profileAbout || 'Bio'}</p>
            <p>{email}</p>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Profile;
