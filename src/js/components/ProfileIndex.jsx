// @flow

import React from 'react';
import { map } from 'lodash';
import { Row, Col } from 'reactstrap';
import ProfileCard from './ProfileCard';

const ProfileIndex = ({ appUsers }: Object) => (
  <div>
    <Row>
      <h2 className="center-text">Users</h2>
    </Row>
    <Row>
      <Col>
        <div className="profile-grid">{map(appUsers, user => <ProfileCard key={user.uid} {...user} />)}</div>
      </Col>
    </Row>
  </div>
);

export default ProfileIndex;
