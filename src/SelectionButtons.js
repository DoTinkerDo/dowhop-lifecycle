import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';

function SelectionButtons({ user, creatorName, reviewSelection, handleButtonClick }) {
  const doerName = user.displayName.split(' ')[0];
  return (
    doerName === creatorName ? (            
      <ButtonGroup className="pull-right form-buttons">
        <Button active={reviewSelection === 'doer'} onClick={() => handleButtonClick('doer')}>Doer</Button>
        <Button active={reviewSelection === 'doneWhop'} onClick={() => handleButtonClick('doneWhop')}>DoWop</Button>
      </ButtonGroup>
    ) : (
      <ButtonGroup className="pull-right form-buttons">
        <Button active={reviewSelection === 'creator'} onClick={() => handleButtonClick('creator')}>Creator</Button>
        <Button active={reviewSelection === 'doneWhop'} onClick={() => handleButtonClick('doneWhop')}>DoWop</Button>
      </ButtonGroup>
    )
  );
}

export default SelectionButtons;
