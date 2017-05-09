import React from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup, Button } from 'react-bootstrap';

function SelectionButtons({ user, creatorName, reviewSelected, handleButtonClick }) {
  const doerName = user.displayName.split(' ')[0];
  return (
    doerName === creatorName ? (            
      <ButtonGroup className="pull-right">
        <Button active={reviewSelected === 'doer'} onClick={() => handleButtonClick('doer')}>Doer</Button>
        <Button active={reviewSelected === 'doneWhop'} onClick={() => handleButtonClick('doneWhop')}>DoneWhop</Button>
      </ButtonGroup>
    ) : (
      <ButtonGroup className="pull-right form-buttons">
        <Button active={reviewSelected === 'creator'} onClick={() => handleButtonClick('creator')}>Creator</Button>
        <Button active={reviewSelected === 'doneWhop'} onClick={() => handleButtonClick('doneWhop')}>DoneWhop</Button>
      </ButtonGroup>
    )
  );
}

SelectionButtons.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
  }),
  creatorName: PropTypes.string.isRequired,
  reviewSelected: PropTypes.string.isRequired,
  handleButtonClick: PropTypes.func.isRequired,
};

export default SelectionButtons;
