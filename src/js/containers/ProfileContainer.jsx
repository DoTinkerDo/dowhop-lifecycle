// @flow

import { connect } from 'react-redux';
import Profile from '../components/Profile';
import { uploadImageTask } from '../actions/user-profile-image';
import { submitProfileSocialMediaUrls, handleSocialUrlChange } from '../actions/profile-social-media-links';
import {
  setAboutProfileValue,
  submitAboutProfile,
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
  socialUrls,
  socialInputs
}) => ({
  authentication,
  currentUser,
  value,
  about,
  appUsers,
  headlineValue,
  headline,
  profileUrl,
  socialUrls,
  socialInputs
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
  },
  handleHeadlineSubmit(e, profileHeadline, uid) {
    e.preventDefault();
    submitHeadlineProfile({ profileHeadline, uid });
  },
  handleImageSubmit(e, uid, oldImageName) {
    const file = e.target.files[0];
    uploadImageTask(file, uid, oldImageName);
  },
  handleSocialMediaUrlSubmit(socialUrls, uid) {
    submitProfileSocialMediaUrls(socialUrls, uid);
  },
  handleSocialUrlChange(e, site) {
    const value = e.target.value;

    dispatch(setSocialUrlsInputValues(socialInputs));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
