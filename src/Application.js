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
      currentUser: null,
      // tempporary hard-coded state...
      reviewSelected: 'doneWhop', 
      type: 'doer',
      creatorName: 'creator',
      doWhopName: 'Brew Beer',
      creatorRating: null,
      doerRating: null,
      doneWhopRating: null,
      creatorComments: [],
      doerComments: [],
      doneWhopComments: [],
    };

    this.usersRef = null;
    this.userRef = null;
    this.doWhopsRef = database.ref(`/doWhops/${this.state.doWhopName}`);
    this.ratingsDoneWhopRef = this.doWhopsRef.child('doneWhop').child('/ratings');
    this.ratingsCreatorRef = this.doWhopsRef.child('creator').child('/ratings');
    this.ratingsDoerRef = this.doWhopsRef.child('doer').child('/ratings');

    this.handleButtonClick = this.handleButtonClick.bind(this);
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

          // 3 event listeners for rating changes
          this.ratingsDoneWhopRef.on('value', snapshot => {
            const ratings = map(snapshot.val(), rating => rating);
            this.setState({ doneWhopRating: ratings });
          });
          this.ratingsCreatorRef.on('value', snapshot => {
            const ratings = map(snapshot.val(), rating => rating);
            this.setState({ creatorRating: ratings });
          });
          this.ratingsDoerRef.on('value', snapshot => {
            const ratings = map(snapshot.val(), rating => rating);
            this.setState({ doerRating: ratings });
          });

          // const creatorname = 'creator dowhop';
          // const doername = this.state.currentUser.displayName;
          // const doername = 'Johann Billar';
          this.doWhopsRef.on('value', (snapshot) => {

            const commentsCreatorNode = snapshot.child('creator').child('comment').val();
            const creatorCommentState = map(commentsCreatorNode, (value, key) => value.comment);

            const commentsDoerNode = snapshot.child('doer').child('comment').val();
            const doerCommentState = map(commentsDoerNode, (value, key) => value.comment);

            const commentsDoneWhopNode = snapshot.child('doneWhop').child('comment').val();
            const doneWhopCommentState = map(commentsDoneWhopNode, (value, key) => value.comment);

            this.setState({
              creatorComments: creatorCommentState,
              doerComments: doerCommentState,
              doneWhopComments: doneWhopCommentState,
              // doerComment: snapshot.child('doer').child('comment').child(creatorname).val(),
              // doneWhopComment: snapshot.child('doneWhop').child('comment').child(doername).val(),
            });
          });
        }
    });
  }

  handleButtonClick(reviewSelected) {
    this.setState({ reviewSelected });
  }

  componentWillUnmount() {
    this.userRef.off();
    this.ratingsDoneWhopRef.off();
    this.ratingsCreatorRef.off();
    this.ratingsDoerRef.off();
  }

  render() {
    const {
      currentUser,
      creatorName,
      doWhopName,
      creatorRating,
      doerRating,
      doneWhopRating,
      creatorComments,
      doerComments,
      doneWhopComments,
      reviewSelected,
    } = this.state;

    // console.log('app creator comment are: ', creatorComment && creatorComment);

    return (
      <Grid>
        {!currentUser && <SignIn />}
        {
          currentUser &&
          <div>
            <CurrentUser user={currentUser} />
            <Header creatorName={creatorName} doWhopName={doWhopName} />
            <Reviews
              creatorRating={creatorRating && weightedRating(creatorRating)}
              doerRating={doerRating && weightedRating(doerRating)}
              doneWhopRating={doneWhopRating && weightedRating(doneWhopRating)}
              creatorComments={creatorComments}
              doerComments={doerComments}
              doneWhopComments={doneWhopComments}
            />
            <ReviewForm
              user={currentUser}
              creatorName={creatorName}
              doWhopName={doWhopName}
              reviewSelected={reviewSelected}
              handleButtonClick={this.handleButtonClick}
            />
          </div>
        }
      </Grid>
    );
  }
}

export default Application;
