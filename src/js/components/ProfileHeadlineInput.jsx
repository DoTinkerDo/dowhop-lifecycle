// @flow

import React, { Component } from 'react';
import { CardTitle, Form, Input } from 'reactstrap';

type Props = {
  headline: Object,
  headlineValue: string,
  handleHeadlineSubmit: Function,
  handleHeadlineChange: Function,
  uid: string
};

class ProfileHeadlineInput extends Component<Props, { isEdit: boolean }> {
  state = {
    isEdit: false
  };

  props: Props;

  handleEdit = () => {
    this.setState({
      isEdit: !this.state.isEdit
    });
  };
  handleSubmit = (e: Object, headlineValue: string, uid: string) => {
    this.setState({
      isEdit: !this.state.isEdit
    });
    this.props.handleHeadlineSubmit(e, headlineValue, uid);
  };

  render() {
    const { headline, headlineValue, handleHeadlineChange, uid } = this.props;
    return !this.state.isEdit ? (
      <div className="profile-header">
        <CardTitle className="center-text">{headline && headline.profileHeadline}</CardTitle>
        <span className="fa fa-pencil" onClick={this.handleEdit} aria-hidden="true" />
      </div>
    ) : (
      <div>
        <Form onSubmit={e => this.handleSubmit(e, headlineValue, uid)}>
          <CardTitle className="center-text">{headline && headline.profileHeadline}</CardTitle>
          <Input
            type="text"
            value={headlineValue}
            placeholder="Start typing to create your headline..."
            onChange={handleHeadlineChange}
            className="profile-header-input"
          />
          <Input type="submit" hidden />
        </Form>
      </div>
    );
  }
}

export default ProfileHeadlineInput;
