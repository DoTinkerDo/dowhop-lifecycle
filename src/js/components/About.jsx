// @flow

import React from 'react';
import { Link, Route } from 'react-router-dom';

const Page = ({ match }: Object) =>
  <div>
    <h3>
      {match.params.aboutId}
    </h3>
    <pre>
      <code>
        {JSON.stringify(match, null, 4)}
      </code>
    </pre>
  </div>;

const About = ({ match }: Object) =>
  <div>
    <h2>About Page</h2>
    <ul>
      <li>
        <Link to={`${match.url}/how-it-works`}>How it Works</Link>
      </li>
      <li>
        <Link to={`${match.url}/start-up-story`}>Start Up Story</Link>
      </li>
      <li>
        <Link to={`${match.url}/testimonials`}>Testimonials</Link>
      </li>
      <li>
        <Link to={`${match.url}/affiliates`}>Affiliates</Link>
      </li>
    </ul>

    <Route path={`${match.url}/:aboutId`} component={Page} />
    <Route exact path={match.url} render={() => <h3>Click link to select a page</h3>} />
  </div>;

export default About;
