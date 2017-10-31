// @flow

import { ADD_SOCIAL_MEDIA_URLS } from '../actions/actions';

const DEFAULT_SOCIAL_MEDIA_URL_STATE = {
  socialUrls: {
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    linkedInUrl: ''
  }
};

export default function socialMediaUrlsReducer(state: Object = DEFAULT_SOCIAL_MEDIA_URL_STATE, action: Object) {
  switch (action.type) {
    case ADD_SOCIAL_MEDIA_URLS:
      return Object.assign({}, state, action.socialUrls);
    default:
      return state;
  }
}
