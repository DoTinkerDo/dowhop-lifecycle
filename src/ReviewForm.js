import React, { Component } from 'react';
import { database } from './firebase';
import SelectionButtons from './SelectionButtons';
import { Col, Row, FormGroup, FormControl, Image } from 'react-bootstrap';
import StarRatingComponent from 'react-star-rating-component';

const formStyles = {
  border: '1px solid #333'
};

class ReviewForm extends Component {
  constructor(props) {
    super(props);
     
    this.state = {
      rating: 0,
      comment: '',
    };

    this.doWhopsRef = database.ref(`/doWhops/${this.props.doWhopName}/`);

    this.getValidationState = this.getValidationState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onStarClick = this.onStarClick.bind(this);
  }

  getValidationState() {
    const length = this.state.comment.length;
    if (length > 10) return 'success';
    else if (length > 100) return 'warning';
    else if (length > 120) return 'error';
  }

  handleChange(e) {
    const comment = e.target.value;
    this.setState({ comment });
  }

  handleSubmit(e) {
    const user = this.props.user;
    const reviewSelected = this.props.reviewSelected;
    const doWhopName = this.props.doWhopName;

    database.ref(`/doWhops/${doWhopName}/${reviewSelected}`)
      .child('comment')
      .push({
        comment: this.state.comment,
        userId: user.uid,
        name: user.displayName,
      });

    e.preventDefault();
    this.setState({ comment: '' });
  }

  onStarClick(newRating, prevRating, name) {
    const user = this.props.user;
    const reviewSelected = this.props.reviewSelected;
    const reviewSelectedRef = this.doWhopsRef.child(reviewSelected);

    reviewSelectedRef.once('value').then(snapshot => {
      const userHasRated = snapshot.child('hasRated').child(user.uid).val();

      if (userHasRated) {
        const ratingKey = snapshot.child('hasRated').child(user.uid).child('key').val();
        reviewSelectedRef
          .child('ratings')
          .child(ratingKey)
          .set(newRating);
        this.setState({ rating: newRating });
      } else {
        const key = reviewSelectedRef
          .child('ratings')
          .push(newRating).key;
        reviewSelectedRef
          .child('hasRated')
          .child(user.uid)
          .set({
            key: key,
            user: user.displayName,
            [user.uid]: true
          });
        this.setState({ rating: newRating });
      }
    });
  }

  render() {
    const { comment, rating } = this.state;
    const { user, creatorName, handleButtonClick, reviewSelected } = this.props;

    return (
      <Row>
        <Col xs={12} sm={6}>
          <form style={formStyles} onSubmit={this.handleSubmit}>
            <FormGroup controlId="formBasicText" validationState={this.getValidationState()}>
              <SelectionButtons
                user={user}
                creatorName={creatorName}
                reviewSelected={reviewSelected}
                handleButtonClick={handleButtonClick}
              />
              <br />
              <div className="form-input">
                <StarRatingComponent
                  name={reviewSelected}
                  starCount={5}
                  value={rating}
                  onStarClick={this.onStarClick}
                  starColor="#ec1928"
                />  
                <br />
                <Image src={user.photoURL} alt={user.displayName} style={{ width: "45px", height: "45px" }} circle /><br />
                <FormControl
                  type="text"
                  value={comment}
                  placeholder="Comment..."
                  onChange={this.handleChange}
                />
              </div> 
            </FormGroup>
          </form>
        </Col>
      </Row>
    );
  }
}

export default ReviewForm;
