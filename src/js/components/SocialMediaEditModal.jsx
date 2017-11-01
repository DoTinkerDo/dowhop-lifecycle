// @flow

import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, CardSubtitle, ModalHeader, Modal, ModalBody, ModalFooter } from 'reactstrap';
import DoWhopButton from './DoWhopButton';

type Props = {
  handleSocialMediaUrlSubmit: Function,
  uid: string,
  socialInputs: Object,
  handleSocialUrlChange: Function
};
type State = {
  modal: boolean,
  valueFBValid: boolean,
  valueTWValid: boolean,
  valueIGValid: boolean,
  valueINValid: boolean
};

class SocialMediaEditModal extends Component<Props, State> {
  state = {
    modal: false,
    valueFBValid: true,
    valueTWValid: true,
    valueIGValid: true,
    valueINValid: true
  };

  props: Props;

  toggle = () => this.setState(prevState => ({ modal: !prevState.modal }));

  handleChange = (e: Object, site: string) => {
    this.validateSocialUrl(e, site);
    this.props.handleSocialUrlChange(e, site);
  };

  handleSubmit = () => {
    const socialUrls = {
      facebookUrl: this.props.socialInputs.valueFB,
      twitterUrl: this.props.socialInputs.valueTW,
      instagramUrl: this.props.socialInputs.valueIG,
      linkedInUrl: this.props.socialInputs.valueIN
    };
    this.props.handleSocialMediaUrlSubmit(socialUrls, this.props.uid);
    this.toggle();
  };

  validateSocialUrl = (e: Object, site: string) => {
    const urlRegEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;
    const value = e.target.value;
    return !urlRegEx.test(value)
      ? this.setState({
          [`${site}Valid`]: false
        })
      : this.setState({
          [`${site}Valid`]: true
        });
  };

  render() {
    const { valueFB, valueTW, valueIG, valueIN } = this.props.socialInputs;
    const { valueFBValid, valueTWValid, valueIGValid, valueINValid, modal } = this.state;
    return (
      <div>
        <CardSubtitle>
          Social Media
          <span className="fa fa-pencil pencil-social" onClick={this.toggle} aria-hidden="true" />
        </CardSubtitle>
        <Modal isOpen={modal} toggle={this.toggle}>
          <ModalBody className="social-media-update-form">
            <ModalHeader toggle={this.toggle}>Enter the URLs for your social media profiles below</ModalHeader>
            <Form>
              <FormGroup>
                <Label for="facebook">
                  Facebook URL
                  <Input
                    type="text"
                    size="sm"
                    value={valueFB}
                    name="social-facebook"
                    id="facebook"
                    placeholder="https://facebook.com/your-name"
                    onChange={e => this.handleChange(e, 'valueFB')}
                    valid={valueFBValid}
                  />
                </Label>
                <br />
                <Label for="twitter">
                  Twitter URL
                  <Input
                    type="text"
                    size="sm"
                    value={valueTW}
                    name="social-twitter"
                    id="twitter"
                    placeholder="https://twitter.com/your-handle"
                    onChange={e => this.handleChange(e, 'valueTW')}
                    valid={valueTWValid}
                  />
                </Label>
                <br />
                <Label for="instagram">
                  Instagram URL
                  <Input
                    type="text"
                    size="sm"
                    value={valueIG}
                    name="social-instagram"
                    id="instagram"
                    placeholder="https://instagram.com/your-handle"
                    onChange={e => this.handleChange(e, 'valueIG')}
                    valid={valueIGValid}
                  />
                </Label>
                <br />
                <Label for="exampleSelect">
                  LinkedIN URL
                  <Input
                    type="text"
                    size="sm"
                    value={valueIN}
                    name="social-linkedin"
                    id="linkedin"
                    placeholder="https://linkedin.com/in/your-profile"
                    onChange={e => this.handleChange(e, 'valueIN')}
                    valid={valueINValid}
                  />
                </Label>
                <br />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <DoWhopButton onClick={this.handleSubmit}>Save</DoWhopButton>
            <DoWhopButton onClick={this.toggle}>Cancel</DoWhopButton>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default SocialMediaEditModal;
