// @flow

import React, { Component } from 'react';
import { CardText, Form, Input } from 'reactstrap';

type Props = {
  about: Object,
  value: string,
  handleSubmit: Function,
  handleChange: Function,
  uid: string
};

class ProfileAboutInput extends Component<Props, { isEdit: boolean }> {
  state = {
    isEdit: false
  };

  props: Props;

  handleEdit = () => {
    this.setState({
      isEdit: !this.state.isEdit
    });
  };
  handleSubmit = (e: Object, value: string, uid: string) => {
    this.setState({
      isEdit: !this.state.isEdit
    });
    this.props.handleSubmit(e, value, uid);
  };

  render() {
    const { about, value, handleChange, uid } = this.props;
    return !this.state.isEdit ? (
      <div>
        <CardText>{about && about.profileAbout}</CardText>
        <div className="fa fa-pencil pencil-about" onClick={this.handleEdit} aria-hidden="true" />
      </div>
    ) : (
      <div>
        <Form onSubmit={e => this.handleSubmit(e, value, uid)}>
          <CardText>{about && about.profileAbout}</CardText>
          <Input
            type="text"
            value={value}
            placeholder="Write your about story..."
            onChange={handleChange}
            className="profile-about-input"
          />
          <Input type="submit" hidden />
        </Form>
      </div>
    );
  }
}

export default ProfileAboutInput;
