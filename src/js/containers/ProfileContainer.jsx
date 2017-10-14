// @flow

import { connect } from 'react-redux';
import Profile from '../components/Profile';
import { storyValue, createStory, clearInput } from '../actions/profile';

const mapStateToProps = ({ authentication, currentUser, value, profile, appUsers }) => ({
  authentication,
  currentUser,
  value,
  profile,
  appUsers
});

const mapDispatchToProps = (dispatch: Function) => ({
  handleChange(e) {
    dispatch(storyValue(e.target.value));
  },
  handleSubmit(e, story, uid) {
    e.preventDefault();
    dispatch(createStory({ story, uid }));
    dispatch(clearInput());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
