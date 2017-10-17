// @flow

import { connect } from 'react-redux';
import Profile from '../components/Profile';
import {
  setAboutProfileValue,
  submitAboutProfile,
  clearAboutInput,
  clearHeadlineInput,
  setHeadlineProfileValue,
  submitHeadlineProfile
} from '../actions/profile';

const mapStateToProps = ({ authentication, currentUser, value, about, appUsers, headlineValue, headline }) => ({
  authentication,
  currentUser,
  value,
  about,
  appUsers,
  headlineValue,
  headline
});

const mapDispatchToProps = (dispatch: Function) => ({
  handleChange(e) {
    dispatch(setAboutProfileValue(e.target.value));
  },
  handleHeadlineChange(e) {
    dispatch(setHeadlineProfileValue(e.target.value));
  },
  handleSubmit(e, profileAbout, uid) {
    e.preventDefault();
    submitAboutProfile({ profileAbout, uid });
    dispatch(clearAboutInput());
  },
  handleHeadlineSubmit(e, profileHeadline, uid) {
    e.preventDefault();
    submitHeadlineProfile({ profileHeadline, uid });
    dispatch(clearHeadlineInput());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
