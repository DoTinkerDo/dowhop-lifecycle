import React, { Component } from 'react';
import { auth, database } from './firebase';
import { Grid } from 'react-bootstrap';
import Reviews from './Reviews';
import Header from './Header';
import ReviewForm from './ReviewForm';
import map from 'lodash/map';
import { weightedRating } from './helpers/weightedRating';

class Application extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      currentUserUID: null,
      currentUser: null,
      reviewSelected: 'doneWhop', 
      eventId: 'event1',
      creatorRating: null,
      doerRating: null,
      doneWhopRating: null,
      creatorComments: [],
      doerComments: [],
      doneWhopComments: [],
      isOpen: false,
    };

    this.ratingRef = null;
    this.doWhopsRef = database.ref(`/proto/${this.state.eventId}/reviews`);

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
  }

  componentDidMount() {
    database.ref('logged_in_users/').on('value', snapshot => {
      console.log(snapshot.val());
    });

    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ currentUser: user });
      } else {
        this.setState({ currentUser: null });
      }
    });

    this.fetchRatings('creator');
    this.fetchRatings('doer');
    this.fetchRatings('doneWhop');
    this.fetchComments();

    // this.timer = setTimeout(
    //     () => this.forceUpdateHandler(), 
    //     100
    //   );
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
        const nodes = snapshot.child(reviewSelected).child('/comments').val();
        return map(nodes, (node) => node);
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

  toggleOpen() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  forceUpdateHandler() {
    this.forceUpdate();
    console.log('update called');
  }

  componentWillUnmount() {
    this.userRef.off();
    this.ratingRef.off();
    this.doWhopsRef.off();
  }

  render() {
    const {
      currentUser,
      doWhopName,
      creatorRating,
      doerRating,
      doneWhopRating,
      creatorComments,
      doerComments,
      doneWhopComments,
      reviewSelected,
      isOpen,
    } = this.state;
    // const currentUser = window.person;

    // console.log('currentUser -> ', currentUser && currentUser);

      // var time = setTimeout(
      //   () => this.forceUpdateHandler(), 
      //   100
      // )
      // clearTimeout(time);

    return (
      <Grid onClick={this.forceUpdateHandler}>
        {currentUser === null ? (
          <div>Please Sign In</div>
         ) : (
            <div>
              <Header creatorName={window.currentDoWhopProto && window.currentDoWhopProto.creatorName}
                doWhopName={window.currentDoWhopProto && window.currentDoWhopProto.titleDescription}
                bannerImageURL={window.currentDoWhopProto && window.currentDoWhopProto.bannerImageURL}
                toggleOpen={this.toggleOpen}
              />
              <Reviews
                creatorRating={creatorRating && weightedRating(creatorRating)}
                doerRating={doerRating && weightedRating(doerRating)}
                doneWhopRating={doneWhopRating && weightedRating(doneWhopRating)}
                creatorComments={creatorComments}
                doerComments={doerComments}
                doneWhopComments={doneWhopComments}
                isOpen={isOpen}
              />
              <ReviewForm
                user={currentUser}
                creatorName={window.currentDoWhopProto && window.currentDoWhopProto.creatorName}
                doWhopName={doWhopName}
                reviewSelected={reviewSelected}
                handleButtonClick={this.handleButtonClick}
                eventId={window.currentUserDoWhopId}
              />
            </div>
          )}
      </Grid>
    );
  }
}

export default Application;
