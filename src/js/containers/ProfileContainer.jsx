// @flow

import { connect } from 'react-redux';
import Profile from '../components/Profile';
import { uploadImageTask } from '../actions/user-profile-image';
import { submitProfileSocialMediaUrls } from '../actions/profile-social-media-links';
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
  profileUrl,
  socialUrls
}) => ({
  authentication,
  currentUser,
  value,
  about,
  appUsers,
  headlineValue,
  headline,
  profileUrl,
  socialUrls
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
  handleImageSubmit(e, uid, oldImageName) {
    const file = e.target.files[0];
    uploadImageTask(file, uid, oldImageName);
  },
  handleSocialMediaUrlSubmit(socialUrls, uid) {
    submitProfileSocialMediaUrls(socialUrls, uid);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
