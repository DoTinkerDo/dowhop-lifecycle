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
      reviewSelection: 'doneWhop'
    };

    this.doWhopsRef = database.ref(`/dowhop/${this.props.doWhopName}/`);

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onStarClick = this.onStarClick.bind(this);
  }

  handleButtonClick(reviewSelection) {
    this.setState({ reviewSelection });
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
    e.preventDefault();
    this.setState({
      [`${this.state.reviewSelection}Comment`]: this.state.comment,
      comment: ''
    });
    const user = this.props.user;
    const reviewSelection = this.state.reviewSelection;
    const doWhopName = this.props.doWhopName;
    database.ref(`/dowhop/${doWhopName}/${reviewSelection}`)
      .child('comment')
      // .child(user.uid)
      .child(user.displayName)
      .set(this.state.comment)
  }

  onStarClick(nextValue, prevValue, name) {
    this.setState({ 
      rating: nextValue,
    });

    const user = this.props.user;
    const reviewSelection = this.state.reviewSelection;
    const doWhopName = this.props.doWhopName;
    database.ref(`/dowhop/${doWhopName}/${reviewSelection}`)
      .child('rating')
      // .child(user.uid)
      .child(user.displayName)
      .set(nextValue)
  }

  render() {
    const { reviewSelection } = this.state;
    const { user, creatorName } = this.props;

    return (
      <Row>

        <Col xs={12} sm={6}>
          <form style={formStyles} onSubmit={this.handleSubmit}>
            <FormGroup controlId="formBasicText" validationState={this.getValidationState()}>
              <SelectionButtons
                user={user}
                creatorName={creatorName}
                reviewSelection={reviewSelection}
                handleButtonClick={this.handleButtonClick}
              />
              <br />
              <div className="form-input">
                <StarRatingComponent
                  name={this.state.reviewSelection}
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
