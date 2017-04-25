import React from 'react';
import { auth } from './firebase';
import { Button } from 'react-bootstrap';

function CurrentUser({ user }) {
  return (
    <div className="pull-right">
      <h3>{user.displayName}</h3>
      <p>{user.email}</p>
      <Button onClick={() => auth.signOut()}>
        Sign Out
      </Button>
    </div>
  );
}

export default CurrentUser;
