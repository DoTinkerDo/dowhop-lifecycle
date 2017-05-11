import React from 'react';
import PropTypes from 'prop-types';
import { Col, PageHeader, Row  } from 'react-bootstrap';

const doWhopImageURL = "https://static.wixstatic.com/media/3cdc845cbd8a4c70a5c9e3a25ce767ed.jpg/v1/fill/w_980,h_510,q_85,usm_0.66_1.00_0.01/3cdc845cbd8a4c70a5c9e3a25ce767ed.jpg";

const headerStyles = {
  header: {
    border: "none",
    color: "#ffffff",
    paddingTop: "90px",
    paddingRight: "20px",
  },
  bannerImage: {
    backgroundImage: `url(${doWhopImageURL})`,
    width: "100%",
    height: "225px",
    cursor: "pointer",
  },
};

function Header({ doWhopName, creatorName, toggleOpen }) {
  return (
    <Row onClick={toggleOpen}>
      <Col xs={12} sm={6}>
        <section style={headerStyles.bannerImage}>
          <PageHeader style={headerStyles.header} className="text-right">
            {doWhopName}<br />
            <small>with {creatorName}</small>
          </PageHeader>
        </section>
      </Col>
    </Row>
  );
}

Header.propTypes = {
  doWhopName: PropTypes.string.isRequired,
  creatorName: PropTypes.string.isRequired,
  toggleOpen: PropTypes.func.isRequired,
};

export default Header;
