// @flow

import React, { Component } from 'react';
import { CardText, CardSubtitle, Input } from 'reactstrap';
import DoWhopButton from './DoWhopButton';

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

  handleEdit = () => this.setState(prevState => ({ isEdit: !prevState.isEdit }));

  handleInputChange = (e: Object) => {
    this.props.handleChange(e);
    this.validateInput(e);
  };

  handleClick = (e: Object, value: string, uid: string) => {
    this.setState(prevState => ({ isEdit: !prevState.isEdit }));
    this.props.handleSubmit(e, value, uid);
  };

  validateInput = (e: Object) =>
    e && e.target.value.length > 500 ? this.setState({ isValid: false }) : this.setState({ isValid: true });

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
        <DoWhopButton onClick={e => this.handleClick(e, value, uid)}>Save</DoWhopButton>
        <CardText className="edit-about-text">{about && about.profileAbout}</CardText>
      </div>
    );
  }
}

export default ProfileAboutInput;
