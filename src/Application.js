import React, { Component } from 'react';
import { auth, database } from './firebase';
import { Grid } from 'react-bootstrap';
import Reviews from './Reviews';
import CurrentUser from './CurrentUser';
import SignIn from './SignIn';
import Header from './Header';
import ReviewForm from './ReviewForm';

class Application extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      currentUser: null,
      creatorName: 'creator',
      doWhopName: 'Brew Beer',
      creatorRating: 0,
      doerRating: 0,
      doneWhopRating: 0,
      creatorComment: '',
      doerComment: '',
      doneWhopComment: '',
    };

    this.doWhopsRef = database.ref(`/dowhop/${this.state.doWhopName}`);
  }

  componentDidMount() {
    auth.onAuthStateChanged(currentUser => {
      this.setState({ currentUser });
      if (currentUser) {
        const creatorname = 'creator dowhop';
        const doername = 'Johann Billar';
        this.doWhopsRef.on('value', (snapshot) => {
          this.setState({
            creatorRating: snapshot.child('creator').child('rating').child(doername).val(),
            creatorComment: snapshot.child('creator').child('comment').child(doername).val(),
            doerRating: snapshot.child('doer').child('rating').child(creatorname).val(),
            doerComment: snapshot.child('doer').child('comment').child(creatorname).val(),
            doneWhopRating: snapshot.child('doneWhop').child('rating').child(doername).val(),
            doneWhopComment: snapshot.child('doneWhop').child('comment').child(doername).val(),
          });
        });
      }
    });
  }

  render() {
    const {
      currentUser,
      doWhops,
      creatorName,
      doWhopName,
      creatorRating,
      doerRating,
      doneWhopRating,
      creatorComment,
      doerComment,
      doneWhopComment,
    } = this.state;

    return (
      <Grid>
        {!currentUser && <SignIn />}
        {
          currentUser &&
          <div>
            <CurrentUser user={currentUser} />
            <Header creatorName={creatorName} doWhopName={doWhopName} />
            <Reviews
              creatorRating={creatorRating}
              doerRating={doerRating}
              doneWhopRating={doneWhopRating}
              creatorComment={creatorComment}
              doerComment={doerComment}
              doneWhopComment={doneWhopComment}
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
