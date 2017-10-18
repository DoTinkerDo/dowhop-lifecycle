// @flow

import React, { Component } from 'react';
import { Button, CardText, CardSubtitle, Input } from 'reactstrap';

type Props = {
  about: Object,
  value: string,
  handleSubmit: Function,
  handleChange: Function,
  uid: string
};

class ProfileAboutInput extends Component<Props, { isEdit: boolean, isValid: boolean }> {
  state = {
    isEdit: false,
    isValid: true
  };

  props: Props;

  handleInputChange = (e: Object) => {
    this.props.handleChange(e);
    this.validateInput(e);
  };

  handleEdit = () => {
    this.setState({
      isEdit: !this.state.isEdit
    });
  };
  handleClick = (e: Object, value: string, uid: string) => {
    this.setState({
      isEdit: !this.state.isEdit
    });
    this.props.handleSubmit(e, value, uid);
  };

  validateInput = (e: Object) => {
    if (e && e.target.value.length > 500) {
      this.setState({ isValid: false });
    } else {
      this.setState({ isValid: true });
    }
  };

  render() {
    const { about, value, uid } = this.props;
    const { isValid, isEdit } = this.state;

    return !isEdit ? (
      <div className="profile-pencil">
        <CardSubtitle>
          About
          <span className="fa fa-pencil pencil-about" onClick={this.handleEdit} aria-hidden="true" />
        </CardSubtitle>
        <CardText>{about && about.profileAbout}</CardText>
      </div>
    ) : (
      <div>
        <Input
          type="textarea"
          value={value}
          placeholder="Write a quick story about you and hit click to save..."
          size="sm"
          onChange={this.handleInputChange}
          className="profile-about-input"
          maxLength="500"
          rows="6"
          valid={isValid}
        />
        <Button className="profile-about-button" type="submit" onClick={e => this.handleClick(e, value, uid)}>
          Save
        </Button>
        <CardText className="edit-about-text">{about && about.profileAbout}</CardText>
      </div>
    );
  }
}

export default ProfileAboutInput;
