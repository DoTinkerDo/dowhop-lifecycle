import React, { Component } from 'react';
// import StarRatingComponent from 'react-star-rating-component';
import StarRating from './StarRating';
import { Col, Row, Image } from 'react-bootstrap';

class Reviews extends Component {
  render() {
    const {
      creatorRating,
      doerRating,
      doneWhopRating,
      creatorComments,
      doerComments,
      doneWhopComments,
    } = this.props;

    let creatorComment = '';
    if (creatorComments.length > 0) {
      creatorComment = creatorComments.map((comment, idx) => <p key={idx}>{comment}</p>);
    }
    // } else {
    //   creatorComment = <img className="loading" src='loading.png' alt="loading indicator" />;
    // }

    let doerComment = '';
    if (doerComments.length > 0) {
      doerComment = doerComments.map((comment, idx) => <p key={idx}>{comment}</p>);
    }
    // } else {
    //   doerComment = <img className="loading" src='loading.png' alt="loading indicator" />;
    // }

    let doneWhopComment = '';
    if (doneWhopComments.length > 0) {
      doneWhopComment = doneWhopComments.map((comment, idx) => <p key={idx}>{comment}</p>);
    }
    // } else {
    //   doneWhopComment = <img className="loading" src='loading.png' alt="loading indicator" />;
    // }

    return (
      <Row>
        <Col xs={12} sm={6}>
          <Row >
            <Col xs={4} className="review">
              <Image src="http://www.fillmurray.com/40/40" alt="headshot" circle />
              Creator<br />
              <StarRating
                name="creator"
                starColor="#ec1928"
                editing={false}
                value={creatorRating}
              />
              {creatorComment}
            </Col>
            <Col xs={4}className="review">
              <Image src="http://www.fillmurray.com/40/40" alt="headshot" circle />
              Doer<br />
              <StarRating
                name="doer" 
                starColor="#ec1928"
                editing={false}
                value={doerRating}
              />
              {doerComment}
            </Col>
            <Col xs={4} className="review">
              <Image src="dowhopicon.gif" style={{ width: "35px", height: "35px", marginBottom: "5px" }} alt="icon" circle />
              DoWhop<br />
              <StarRating
                name="doneWhop"
                starColor="#ec1928"
                editing={false}
                value={doneWhopRating}
              />
              {doneWhopComment}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default Reviews;
