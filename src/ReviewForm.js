import React, { Component } from 'react';
import { database } from './firebase';
import SelectionButtons from './SelectionButtons';
import { Col, Row, FormGroup, FormControl, Image } from 'react-bootstrap';
import StarRatingComponent from 'react-star-rating-component';
import map from 'lodash/map';


const formStyles = {
  border: '1px solid #333'
};

class ReviewForm extends Component {
  constructor(props) {
    super(props);
     
    this.state = {
      rating: 0,
      comment: '',
      reviewSelected: 'doneWhop'
    };

    this.doWhopsRef = database.ref(`/doWhops/${this.props.doWhopName}/`);

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onStarClick = this.onStarClick.bind(this);
  }

  handleButtonClick(reviewSelected) {
    this.setState({ reviewSelected });
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

  // comments
  handleSubmit(e) {
    e.preventDefault();
    const user = this.props.user;
    const reviewSelected = this.state.reviewSelected;
    const doWhopName = this.props.doWhopName;
    database.ref(`/doWhops/${doWhopName}/${reviewSelected}`)
      .child('comment')
      .child(user.uid)
      .push(this.state.comment);

    this.setState({
      [`${this.state.reviewSelected}Comment`]: this.state.comment,
      comment: ''
    });
  }

  // rating 
  onStarClick(nextValue, prevValue, name) {
    const user = this.props.user;
    const reviewSelected = this.state.reviewSelected;
    const doWhopName = this.props.doWhopName;
    const ratingRef = database.ref(`/doWhops/${doWhopName}/${reviewSelected}`);

    ratingRef.once('value').then(snapshot => {
      if (snapshot.child('rating').val() && snapshot.child('rated').child(user.uid).val()) {
        const ratingKey = snapshot.child('rated').child(user.uid).child('key').val();
        database.ref(`/doWhops/${doWhopName}/${reviewSelected}`)
          .child('rating')
          .child(ratingKey)
          .remove();
        database.ref(`/doWhops/${doWhopName}/${reviewSelected}`)
          .child('rating')
          .child(ratingKey)
          .set(nextValue);
        this.setState({ rating: nextValue });
      } else {
        let key = database.ref(`/doWhops/${doWhopName}/${reviewSelected}`)
          .child('rating')
          .push(nextValue).key;
        database.ref(`/doWhops/${doWhopName}/${reviewSelected}`)
          .child('rated')
          .child(user.uid)
          .set({
            key: key
          });
        this.setState({ rating: nextValue });
      }
    });
  }

  render() {
    const { reviewSelected } = this.state;
    const { user, creatorName } = this.props;

    return (
      <Row>

        <Col xs={12} sm={6}>
          <form style={formStyles} onSubmit={this.handleSubmit}>
            <FormGroup controlId="formBasicText" validationState={this.getValidationState()}>
              <SelectionButtons
                user={user}
                creatorName={creatorName}
                reviewSelected={reviewSelected}
                handleButtonClick={this.handleButtonClick}
              />
              <br />
              <div className="form-input">
                <StarRatingComponent
                  name={this.state.reviewSelected}
                  starCount={5}
                  value={this.state.rating}
                  onStarClick={this.onStarClick}
                  starColor="#ce453b"
                />  
                <br />
                <Image src={user.photoURL} alt={user.displayName} style={{ width: "45px", height: "45px" }} circle /><br />
                <FormControl
                  type="text"
                  value={this.state.comment}
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
