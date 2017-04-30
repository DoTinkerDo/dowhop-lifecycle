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
  }

  componentDidMount() {
    auth.onAuthStateChanged(currentUser => {
      this.setState({ currentUser });

        if (currentUser) {
          this.usersRef =database.ref('/users');
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

          const creatorname = 'creator dowhop';
          // const doername = this.state.currentUser.displayName;
          const doername = 'Johann Billar';

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
          const ratingsRef = this.doWhopsRef.child('/doneWhop').child('/rating');

          let r = [];
          ratingsRef.on('child_added', (snapshot) => {
            let value = snapshot.val();
            r.push(value);
            this.setState({ ratings: r });
          });

          ratingsRef.on('child_removed', (snapshot) => {
            let value = snapshot.val();
            r.pop(value);
            this.setState({ ratings: r });
          });
        }
    });
  }

  render() {
    const {
      ratings,
      userObject,
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

    // console.log(userObject && userObject.type);
    console.log(this.state.ratings);

    return (
      <Grid>
        {!currentUser && <SignIn />}
        {
          currentUser &&
          <div>
            <CurrentUser user={currentUser} />
            <Header creatorName={creatorName} doWhopName={doWhopName} />
            <Reviews
              ratings={ratings}
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
