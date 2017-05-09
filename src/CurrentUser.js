import React from 'react';
import PropTypes from 'prop-types';
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

CurrentUser.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
};

export default CurrentUser;
