// @flow

import React from 'react';
import injectSheet from 'react-jss';
import SocialIcon from './SocialIcon';

const styles = {
  social: {
    color: '#24292e'
  }
};

const SocialMediaIcons = ({ classes, socialUrls }: Object) => {
  const { facebookUrl, twitterUrl, instagramUrl, linkedInUrl } = socialUrls;
  return (
    <div className={classes.social}>
      {!facebookUrl && <SocialIcon siteName={'fa-facebook-square'} />}
      {facebookUrl && (
        <a href={facebookUrl}>
          <SocialIcon siteName={'fa-facebook-square'} />
        </a>
      )}
      {!twitterUrl && <SocialIcon siteName={'fa-twitter-square'} />}
      {twitterUrl && (
        <a href={twitterUrl}>
          <SocialIcon siteName={'fa-twitter-square'} />
        </a>
      )}
      {!instagramUrl && <SocialIcon siteName={'fa-instagram'} />}
      {instagramUrl && (
        <a href={instagramUrl}>
          <SocialIcon siteName={'fa-instagram'} />
        </a>
      )}
      {!linkedInUrl && <SocialIcon siteName={'fa-linkedin-square'} />}
      {linkedInUrl && (
        <a href={linkedInUrl}>
          <SocialIcon siteName={'fa-linkedin-square'} />
        </a>
      )}
    </div>
  );
};

export default injectSheet(styles)(SocialMediaIcons);
