// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardImg } from 'reactstrap';

const ProfileCard = (props: Object) => {
  const { displayName, photoURL, uid } = props.user;
  return (
    <div className="grid-card">
      <Link to={`/my-profile/${uid}`}>
        <Card>
          <CardImg src={photoURL} alt={displayName} />
        </Card>
      </Link>
    </div>
  );
};

export default ProfileCard;
