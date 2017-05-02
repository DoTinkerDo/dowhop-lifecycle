import React, { Component } from 'react';
import { auth, database } from './firebase';
import { Grid } from 'react-bootstrap';
import Reviews from './Reviews';
import CurrentUser from './CurrentUser';
import SignIn from './SignIn';
import Header from './Header';
import ReviewForm from './ReviewForm';
import pick from 'lodash/pick';
import map from 'lodash/map';
import { weightedRating } from './helpers/weightedRating';

class Application extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      users: {},
      userObject: null,
      ratings: null,
      currentUser: null,
      // hard-coded state...
      type: 'doer',
      creatorName: 'creator',
      doWhopName: 'Brew Beer',
      creatorRating: 0,
      doerRating: 0,
      doneWhopRating: 0,
      creatorComment: '',
      doerComment: '',
      doneWhopComment: '',
    };

    this.usersRef = null;
    this.userRef = null;
    this.doWhopsRef = database.ref(`/doWhops/${this.state.doWhopName}`);
    this.ratingsRef = this.doWhopsRef.child('/doneWhop').child('/ratings');
  }

  componentDidMount() {
    auth.onAuthStateChanged(currentUser => {
      this.setState({ currentUser });

        if (currentUser) {
          this.usersRef = database.ref('/users');
          this.userRef = this.usersRef.child(currentUser.uid);
          this.userRef.once('value').then(snapshot => {
            if (snapshot.val()) return;
            const userData = pick(currentUser, ['displayName', 'photoURL', 'email', 'uid' ]);
            userData.type = this.state.type;
            this.userRef.set(userData);
          });

          this.usersRef.on('value', snapshot => {
            // setting current userObject with type...
            const currentUserUid = this.state.currentUser.uid;
            map(snapshot.val(), (userObject, key) => {
              if (key === currentUserUid) {
                this.setState({ userObject });
              }
            });
            // setting Object with all app users... 
            this.setState({ users: snapshot.val() });
          });

          // creates and sets star rating state with an array of ratings
          this.ratingsRef.on('value', snapshot => {
            const ratings = map(snapshot.val(), rating => rating);
            this.setState({ ratings });
          });

          // const creatorname = 'creator dowhop';
          // const doername = this.state.currentUser.displayName;
          // const doername = 'Johann Billar';
          // this.doWhopsRef.on('value', (snapshot) => {
          //   this.setState({
          //     creatorRating: snapshot.child('creator').child('rating').child(doername).val(),
          //     creatorComment: snapshot.child('creator').child('comment').child(doername).val(),
          //     doerRating: snapshot.child('doer').child('rating').child(creatorname).val(),
          //     doerComment: snapshot.child('doer').child('comment').child(creatorname).val(),
          //     doneWhopRating: snapshot.child('doneWhop').child('rating').child(doername).val(),
          //     doneWhopComment: snapshot.child('doneWhop').child('comment').child(doername).val(),
          //   });
          // });
        }
    });
  }

  componentWillUnmount() {
    this.ratingsRef.off();
    this.userRef.off();
  }

  render() {
    const {
      ratings,
      // userObject,
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

    const calculatedWeightedRating = weightedRating(ratings);
    console.log('app weightedRating', calculatedWeightedRating)

    return (
      <Grid>
        {!currentUser && <SignIn />}
        {
          currentUser &&
          <div>
            <CurrentUser user={currentUser} />
            <Header creatorName={creatorName} doWhopName={doWhopName} />
            <Reviews
              rating={calculatedWeightedRating}
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
              ratings={ratings}
            />
          </div>
        }
      </Grid>
    );
  }
}

export default Application;
