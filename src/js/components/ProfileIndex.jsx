// @flow

import React from 'react';
import { map } from 'lodash';
import AuthButton from './AuthButton';
import ProfileCard from './ProfileCard';

const ProfileIndex = ({ appUsers }: Object) => (
  <div>
    <AuthButton className="float-right" />
    <h2 className="center-text">Users</h2>
    <div className="profile-grid">{map(appUsers, user => <ProfileCard key={user.uid} user={user} />)}</div>
  </div>
);

export default ProfileIndex;
