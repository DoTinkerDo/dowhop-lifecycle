import React, { Component } from 'react';
import Reviews from './Reviews';
import { Col, Row, FormGroup, FormControl, ButtonGroup, Button, Image } from 'react-bootstrap';
import StarRatingComponent from 'react-star-rating-component';

const form = {
  border: '1px solid #333'
};

class ReviewForm extends Component {
  constructor(props) {
    super(props);
     
    this.state = {
      // creator: false,
      rating: 0,
      comment: '',
      creatorComment: '',
      doerComment: '',
      doneWhopComment: '',
      // creatorRating: 0,
      // doerRating: 0,
      // doneWhopRating: 0,
      reviewSelection: 'doneWhop'
    };  

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
    this.onStarClick = this.onStarClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
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
  }

  onStarClick(nextValue, prevValue, name) {
    this.setState({ 
      rating: nextValue,
      // [`${name}Rating`]: nextValue
    });
  }

  handleButtonClick(reviewSelection) {
    this.setState({
      reviewSelection,
    });
  }

  render() {
    const { reviewSelection, creatorComment, doerComment, doneWhopComment } = this.state;
    return (
      <Row>
        <Row style={{ margin: "0px"}}>
          <Reviews creatorComment={creatorComment} doerComment={doerComment} doneWhopComment={doneWhopComment} />
        </Row>
        <Col xs={12} sm={6}>
          <form style={form} onSubmit={this.handleSubmit}>
            <FormGroup controlId="formBasicText" validationState={this.getValidationState()}>
              <ButtonGroup className="pull-right form-buttons">
                <Button active={reviewSelection === 'creator'} onClick={() => this.handleButtonClick('creator')}>Creator</Button>
                <Button active={reviewSelection === 'doer'} onClick={() => this.handleButtonClick('doer')}>Doer</Button>
                <Button active={reviewSelection === 'doneWhop'} onClick={() => this.handleButtonClick('doneWhop')}>DoWop</Button>
              </ButtonGroup>
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
                <Image src="http://www.fillmurray.com/40/40" alt="headshot" circle /><br />
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
