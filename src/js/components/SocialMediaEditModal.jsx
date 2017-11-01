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
  modal: boolean
};

class SocialMediaEditModal extends Component<Props, State> {
  state = {
    modal: false
  };

  props: Props;

  toggle = () => this.setState(prevState => ({ modal: !prevState.modal }));

  // TODO
  // fix Type for site
  // handleSocialUrlChange = (e: SyntheticKeyboardEvent & { target: HTMLInputElement }, site: string) => {
  //   const URL = e.target.value;
  //   this.setState({
  //     [site]: URL
  //   });
  // };

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

  render() {
    const { valueFB, valueTW, valueIG, valueIN } = this.props.socialInputs;
    return (
      <div>
        <CardSubtitle>
          Social Media
          <span className="fa fa-pencil pencil-social" onClick={this.toggle} aria-hidden="true" />
        </CardSubtitle>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
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
                    placeholder="facebook.com/your-name"
                    onChange={e => this.props.handleSocialUrlChange(e, 'valueFB')}
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
                    placeholder="twitter.com/your-handle"
                    onChange={e => this.props.handleSocialUrlChange(e, 'valueTW')}
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
                    placeholder="instagram.com/your-handle"
                    onChange={e => this.props.handleSocialUrlChange(e, 'valueIG')}
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
                    placeholder="linkedin.com/in/your-profile"
                    onChange={e => this.props.handleSocialUrlChange(e, 'valueIN')}
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
