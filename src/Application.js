import React, { Component } from 'react';
import Header from './Header';
import Reviews from './Reviews';
import ReviewForm from './ReviewForm';

class Application extends Component {
  render() {
    return (
      <div>
        Application
        <Header />
        <Reviews />
        <ReviewForm />
      </div>
    );
  }
}

export default Application;
