// @flow

import { connect } from 'react-redux';
import Profile from '../components/Profile';
import { uploadImage } from '../actions/user-profile-image';
import {
  setAboutProfileValue,
  submitAboutProfile,
  // clearAboutInput,
  // clearHeadlineInput,
  setHeadlineProfileValue,
  submitHeadlineProfile
} from '../actions/profile';

const mapStateToProps = ({
  authentication,
  currentUser,
  value,
  about,
  appUsers,
  headlineValue,
  headline,
  profileUrl
}) => ({
  authentication,
  currentUser,
  value,
  about,
  appUsers,
  headlineValue,
  headline,
  profileUrl
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
    // dispatch(clearAboutInput());
  },
  handleHeadlineSubmit(e, profileHeadline, uid) {
    e.preventDefault();
    submitHeadlineProfile({ profileHeadline, uid });
    // dispatch(clearHeadlineInput());
  },
  handleImageSubmit(e) {
    const file = e.target.files[0];
    uploadImage(file);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
