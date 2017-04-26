import React, { Component } from 'react';
import { auth, database } from './firebase';
import { Grid } from 'react-bootstrap';
// import map from 'lodash/map';
import CurrentUser from './CurrentUser';
import SignIn from './SignIn';
import Header from './Header';
import ReviewForm from './ReviewForm';

class Application extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      currentUser: null,
      doWhops: null,
      creatorName: 'Creator',
      doWhopName: 'Brew Beer',
    };

    this.doWhopsRef = database.ref(`/dowhop/${this.state.doWhopName}`);
  }

  componentDidMount() {
    auth.onAuthStateChanged(currentUser => {
      // if (currentUser) {
        this.setState({ currentUser });
      // }
      this.doWhopsRef.on('value', (snapshot) => {
        this.setState({ doWhops: snapshot.val() });
      });
    });
  }

  render() {
    const { currentUser, doWhops, creatorName, doWhopName } = this.state;

    return (
      <Grid>
        {!currentUser && <SignIn />}
        {
          currentUser &&
          <div>
            <CurrentUser user={currentUser} />
            <Header
              creatorName={creatorName}
              doWhopName={doWhopName}
            />
            <ReviewForm
              user={currentUser}
              doWhops={doWhops}
              creatorName={creatorName}
              doWhopName={doWhopName}
            />
          </div>
        }
      </Grid>
    );
  }
}

export default Application;
