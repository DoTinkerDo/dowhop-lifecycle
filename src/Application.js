import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import Header from './Header';
import ReviewForm from './ReviewForm';

class Application extends Component {
  render() {
    return (
      <Grid>
        <Header />
        <ReviewForm />
      </Grid>
    );
  }
}

export default Application;
