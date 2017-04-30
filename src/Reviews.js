import React, { Component } from 'react';
import StarRatingComponent from 'react-star-rating-component';
import { Col, Row, Image } from 'react-bootstrap';
import { weightedRating } from './helpers/weightedRating';

class Reviews extends Component {
  render() {
    const {
      ratings,
      creatorRating,
      doerRating,
      doneWhopRating,
      creatorComment,
      doerComment,
      doneWhopComment,
    } = this.props;

    console.log(ratings && weightedRating(ratings));

    return (
      <Row>
        <Col xs={12} sm={6}>
          <Row >
            <Col xs={4} className="review">
              <Image src="http://www.fillmurray.com/40/40" alt="headshot" circle />
              Creator<br />
              <StarRatingComponent
                name="creator"
                starColor="#ce453b"
                editing={false}
                value={creatorRating}
              />
              <p>{creatorComment}</p>
            </Col>
            <Col xs={4}className="review">
              <Image src="http://www.fillmurray.com/40/40" alt="headshot" circle />
              Doer<br />
              <StarRatingComponent
                name="doer" 
                starColor="#ce453b"
                editing={false}
                value={doerRating}
              />
              <p>{doerComment}</p>
            </Col>
            <Col xs={4} className="review">
              <Image src="dowhopicon.gif" style={{ width: "35px", height: "35px", marginBottom: "5px" }} alt="icon" circle />
              DoWhop<br />
              <StarRatingComponent
                name="doneWhop"
                starColor="#ce453b"
                editing={false}
                value={ratings && weightedRating(ratings)}
              />
              <p>{doneWhopComment}</p>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default Reviews;
