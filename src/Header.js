import React, { Component } from 'react';
import { Col, Row, PageHeader } from 'react-bootstrap';

const DoWhopImageURL = "https://static.wixstatic.com/media/3cdc845cbd8a4c70a5c9e3a25ce767ed.jpg/v1/fill/w_980,h_510,q_85,usm_0.66_1.00_0.01/3cdc845cbd8a4c70a5c9e3a25ce767ed.jpg"

const headerImage = {
  backgroundImage: `url(${DoWhopImageURL})`,
  width: "100%",
  height: "225px"
};

class Header extends Component {
  render() {
    return (
      <Row>
        <Col xs={12} sm={6}>
          <section style={headerImage} role="presentational">
            <PageHeader className="text-right header-text">
              Brew Beer<br />
              <small>with Karl</small>
            </PageHeader>
          </section>
        </Col>
      </Row>
    );
  }
}

export default Header;
