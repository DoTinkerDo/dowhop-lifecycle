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
    this.ratingRef = null;
    this.doWhopsRef = database.ref(`/doWhops/${this.state.doWhopName}`);

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

          this.fetchRatings('creator');
          this.fetchRatings('doer');
          this.fetchRatings('doneWhop');
          this.fetchComments();
        }
    });
  }

  fetchRatings(reviewSelected) {
    const selectedRating = `${reviewSelected}Rating`;
    this.ratingRef = this.doWhopsRef.child(reviewSelected).child('/ratings');

    this.ratingRef.on('value', snapshot => {
      const ratings = map(snapshot.val(), rating => rating);
      this.setState({ [selectedRating]: ratings  });
    });
  }

  fetchComments() {
    this.doWhopsRef.on('value', (snapshot) => {

      function getNode(reviewSelected, snapshot) {
        const nodes = snapshot.child(reviewSelected).child('comment').val();
        return map(nodes, (node, key) => node.comment);
      }

      const creatorCommentState = getNode('creator', snapshot);
      const doerCommentState = getNode('doer', snapshot);
      const doneWhopCommentState = getNode('doneWhop', snapshot);

      this.setState({
        creatorComments: creatorCommentState,
        doerComments: doerCommentState,
        doneWhopComments: doneWhopCommentState,
      });
    });
  }

  handleButtonClick(reviewSelected) {
    this.setState({ reviewSelected });
  }

  componentWillUnmount() {
    this.userRef.off();
    this.ratingRef.off();
    this.doWhopsRef.off();
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
