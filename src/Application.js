import React, { Component } from 'react';
import { database } from './firebase';
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
      currentUser: null,
      reviewSelected: 'doneWhop', 
      creatorName: 'Creator',
      doWhopName: 'Brew Beer',
      creatorRating: null,
      doerRating: null,
      doneWhopRating: null,
      creatorComments: [],
      doerComments: [],
      doneWhopComments: [],
      isOpen: false,
    };

    this.ratingRef = null;
    this.doWhopsRef = database.ref(`/doWhops/${this.state.doWhopName}`);

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
  }

  componentDidMount() {

    this.fetchRatings('creator');
    this.fetchRatings('doer');
    this.fetchRatings('doneWhop');
    this.fetchComments();
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

  componentWillUnmount() {
    this.userRef.off();
    this.ratingRef.off();
    this.doWhopsRef.off();
  }

  render() {
    const {
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
    const currentUser = window.person;

    return (
      <Grid>
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
              />
            </div>
          )}
      </Grid>
    );
  }
}

export default Application;
