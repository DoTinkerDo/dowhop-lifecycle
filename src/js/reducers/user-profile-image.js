// @flow

import { SET_DEFAULT_PROFILE_IMAGE } from '../actions/actions';

const DEFAULT_USER_PROFILE_IMAGE_STATE = {
  profileImageUrl: {
    url:
      'https://firebasestorage.googleapis.com/v0/b/dowhop-lifecycle.appspot.com/o/dowhop-icons%2Fdowhop-icon.png?alt=media&token=4ce2cb46-d5f0-4bbc-bb9d-b25ca886e634',
    name: 'DoWhopIcon'
  }
};

export default function profileUrlReducer(state: Object = DEFAULT_USER_PROFILE_IMAGE_STATE, action: Object) {
  switch (action.type) {
    case SET_DEFAULT_PROFILE_IMAGE:
      return Object.assign({}, state, {
        profileImageUrl: { url: action.payload.url.url, name: action.payload.url.name }
      });
    default:
      return state;
  }
}
