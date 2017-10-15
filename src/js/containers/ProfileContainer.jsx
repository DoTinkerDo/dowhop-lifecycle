// @flow

import { connect } from 'react-redux';
import Profile from '../components/Profile';
import { setAboutProfileValue, submitAboutProfile, clearInput } from '../actions/profile';

const mapStateToProps = ({ authentication, currentUser, value, about, appUsers }) => ({
  authentication,
  currentUser,
  value,
  about,
  appUsers
});

const mapDispatchToProps = (dispatch: Function) => ({
  handleChange(e) {
    dispatch(setAboutProfileValue(e.target.value));
  },
  handleSubmit(e, profileAbout, uid) {
    e.preventDefault();
    dispatch(submitAboutProfile({ profileAbout, uid }));
    dispatch(clearInput());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
