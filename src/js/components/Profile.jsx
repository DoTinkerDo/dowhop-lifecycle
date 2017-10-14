// @flow

import React from 'react';
import LoadingDots from './LoadingDots';
import CurrentUser from './CurrentUser';

const Profile = (props: {
  currentUser: Object,
  profile: Object,
  value: string,
  handleChange: Function,
  handleSubmit: Function
}) => {
  const { currentUser, value, profile, handleChange, handleSubmit } = props;
  // console.log(props.match.params.uid);
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
};

export default Profile;
