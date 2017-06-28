import React, { Component } from 'react';
import StarRating from './StarRating';
import { Col, Row, Image, Collapse } from 'react-bootstrap';

class Reviews extends Component {
  render() {
    const {
      creatorRating,
      doerRating,
      doneWhopRating,
      creatorComments,
      doerComments,
      doneWhopComments,
      isOpen
    } = this.props;

    let creatorComment = '';
    if (creatorComments.length > 0) {
      creatorComment = creatorComments.map((comment, idx) =>
        <p key={idx}>
          {comment}
        </p>
      );
    }

    let doerComment = '';
    if (doerComments.length > 0) {
      doerComment = doerComments.map((comment, idx) =>
        <p key={idx}>
          {comment}
        </p>
      );
    }

    let doneWhopComment = '';
    if (doneWhopComments.length > 0) {
      doneWhopComment = doneWhopComments.map((comment, idx) =>
        <p key={idx}>
          {comment}
        </p>
      );
    }

    return (
      <Collapse in={isOpen}>
        <Row>
          <Col xs={12} sm={6}>
            <Row>
              <Col xs={4} className="review">
                <Image src="https://www.fillmurray.com/40/40" alt="headshot" circle />
                Creator<br />
                <StarRating name="creator" starColor="#ec1928" editing={false} value={creatorRating} />
                {creatorComment}
              </Col>
              <Col xs={4} className="review">
                <Image src="https://www.fillmurray.com/40/40" alt="headshot" circle />
                Doer<br />
                <StarRating name="doer" starColor="#ec1928" editing={false} value={doerRating} />
                {doerComment}
              </Col>
              <Col xs={4} className="review">
                <Image
                  src="dowhopicon.gif"
                  style={{ width: '25px', height: '25px', marginBottom: '13px' }}
                  alt="icon"
                  circle
                />
                DoWhop<br />
                <StarRating name="doneWhop" starColor="#ec1928" editing={false} value={doneWhopRating} />
                {doneWhopComment}
              </Col>
            </Row>
          </Col>
        </Row>
      </Collapse>
    );
  }
}

export default Reviews;
