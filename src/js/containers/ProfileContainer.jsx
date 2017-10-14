// @flow

import { connect } from 'react-redux';
import Profile from '../components/Profile';
import { inputValue, createBio, clearInput } from '../actions/profile';

const mapStateToProps = ({ authentication, currentUser, value, profile, appUsers }) => ({
  authentication,
  currentUser,
  value,
  profile,
  appUsers
});

const mapDispatchToProps = (dispatch: Function) => ({
  handleChange(e) {
    dispatch(inputValue(e.target.value));
  },
  handleSubmit(e, bio, uid) {
    e.preventDefault();
    dispatch(createBio({ bio, uid }));
    dispatch(clearInput());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
