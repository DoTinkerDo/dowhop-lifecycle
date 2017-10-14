// @flow

import React from 'react';
import { filter } from 'lodash';
import { Col, Card, CardBody, CardImg, CardTitle, Row } from 'reactstrap';
import LoadingDots from './LoadingDots';
import CurrentUser from './CurrentUser';

const Profile = (props: {
  currentUser: Object,
  profile: Object,
  value: string,
  handleChange: Function,
  handleSubmit: Function,
  appUsers: Object,
  match: Object
}) => {
  const { currentUser, value, profile, handleChange, handleSubmit } = props;
  const { uid } = props.match.params;
  const selectedUser = filter(props.appUsers, user => user.uid === uid);
  const { photoURL, displayName, profileAbout, email } = selectedUser[0] || '';
  if (currentUser.uid === uid) {
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
      <Col xs={12} md={6}>
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
