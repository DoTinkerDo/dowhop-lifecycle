// @flow

import { EDIT_PROFILE_IMAGE_URL } from '../actions/actions';

const DEFAULT_USER_PROFILE_IMAGE_STATE = {
  profileImageUrl: {
    url:
      'https://firebasestorage.googleapis.com/v0/b/dowhop-lifecycle.appspot.com/o/dowhop-icons%2Fdowhop-icon.png?alt=media&token=4ce2cb46-d5f0-4bbc-bb9d-b25ca886e634',
    name: 'DoWhopIcon'
  }
};

export default function profileUrlReducer(state: Object = DEFAULT_USER_PROFILE_IMAGE_STATE, action: Object) {
  switch (action.type) {
    case EDIT_PROFILE_IMAGE_URL:
      return Object.assign({}, state, {
        profileImageUrl: { url: action.payload.profileImageUrl.url, name: action.payload.profileImageUrl.name }
      });
    default:
      return state;
  }
}
