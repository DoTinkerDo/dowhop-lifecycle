import React, { Component } from 'react';
import StarRatingComponent from 'react-star-rating-component';
import { Col, Row, Image } from 'react-bootstrap';

class Reviews extends Component {
  render() {
    const {
      creatorRating,
      doerRating,
      doneWhopRating,
      creatorComment,
      doerComment,
      doneWhopComment,
    } = this.props;

    return (
      <Row>
        <Col xs={12} sm={6}>
          <Row >
            <Col xs={4} className="review">
              <Image src="http://www.fillmurray.com/40/40" alt="headshot" circle />
              Creator<br />
              <StarRatingComponent
                name="creator"
                starColor="#ec1928"
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
                starColor="#ec1928"
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
                starColor="#ec1928"
                editing={false}
                value={doneWhopRating}
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
