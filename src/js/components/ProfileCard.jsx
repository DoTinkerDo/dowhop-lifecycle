// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardImg, CardBody, CardText } from 'reactstrap';

const ProfileCard = (props: { displayName: string, photoURL: string, uid: string }) => {
  const { displayName, photoURL, uid } = props;
  return (
    <div className="grid-card">
      <Link to={`/my-profile?${uid}`}>
        <Card>
          <CardImg src={photoURL} alt={`Headshot for ${displayName}`} />
          <CardBody>
            <CardText>{displayName}</CardText>
          </CardBody>
        </Card>
      </Link>
    </div>
  );
};

export default ProfileCard;
