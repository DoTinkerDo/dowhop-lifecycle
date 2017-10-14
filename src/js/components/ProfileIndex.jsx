// @flow

import React from 'react';
import { map } from 'lodash';
import AuthButton from './AuthButton';
import ProfileCard from './ProfileCard';

const ProfileIndex = ({ appUsers }: Object) => (
  <div>
    <AuthButton />
    <h2>Users</h2>
    <div className="profile-grid">{map(appUsers, user => <ProfileCard key={user.uid} user={user} />)}</div>
  </div>
);

export default ProfileIndex;
