// @flow

import { ADD_SOCIAL_MEDIA_URLS, SET_SOCIAL_URL_INPUT_VALUES, SET_SOCIAL_URL_INPUT_VALUE } from '../actions/actions';

const DEFAULT_INPUT_STATE = {
  socialInputs: {
    valueFB: '',
    valueTW: '',
    valueIG: '',
    valueIN: ''
  }
};

const DEFAULT_SOCIAL_MEDIA_URL_STATE = {
  socialUrls: {
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    linkedInUrl: ''
  }
};

export function setSocialUrlInputReducer(state: Object = DEFAULT_INPUT_STATE, action: Object) {
  switch (action.type) {
    case SET_SOCIAL_URL_INPUT_VALUES:
      return action.socialInputs;
    case SET_SOCIAL_URL_INPUT_VALUE:
      return {
        ...state,
        [action.site]: action.value
      };
    default:
      return state;
  }
}

export function socialMediaUrlsReducer(state: Object = DEFAULT_SOCIAL_MEDIA_URL_STATE, action: Object) {
  switch (action.type) {
    case ADD_SOCIAL_MEDIA_URLS:
      return action.socialUrls;
    default:
      return state;
  }
}
