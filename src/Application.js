import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import { auth, database } from './firebase';
import CurrentUser from './CurrentUser';
import SignIn from './SignIn';
import Header from './Header';
import ReviewForm from './ReviewForm';

class Application extends Component {
  constructor(props) {
    super(props);
    
    this.state = { currentUser: null }
  }

  componentDidMount() {
    auth.onAuthStateChanged(currentUser => {
      this.setState({ currentUser });
    });
  }

  render() {
    const { currentUser } = this.state;
    return (
      <Grid>
        {!currentUser && <SignIn />}
        {
          currentUser &&
          <div>
            <CurrentUser user={currentUser} />
            <Header />
            <ReviewForm user={currentUser} />
          </div>
        }
      </Grid>
    );
  }
}

export default Application;
