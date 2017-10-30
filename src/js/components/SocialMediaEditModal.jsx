// @flow

import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, CardSubtitle, ModalHeader, Modal, ModalBody, ModalFooter } from 'reactstrap';
import DoWhopButton from './DoWhopButton';

type Props = {};
type State = {
  modal: boolean,
  valueFB: string,
  valueTW: string,
  valueIG: string,
  valueIN: string
};

class SocialMediaEditModal extends Component<Props, State> {
  state = {
    modal: false,
    valueFB: '',
    valueTW: '',
    valueIG: '',
    valueIN: ''
  };

  toggle = () => this.setState(prevState => ({ modal: !prevState.modal }));

  // TODO
  // fix Type for site
  handleChange = (e: SyntheticKeyboardEvent & { target: HTMLInputElement }, site: string) => {
    const URL = e.target.value;
    this.setState({
      [site]: URL
    });
  };

  render() {
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
                    value={this.state.valueFB}
                    name="social-facebook"
                    id="facebook"
                    placeholder="facebook.com/your-name"
                    onChange={e => this.handleChange(e, 'valueFB')}
                  />
                </Label>
                <br />
                <Label for="twitter">
                  Twitter URL
                  <Input
                    type="text"
                    size="sm"
                    value={this.state.valueTW}
                    name="social-twitter"
                    id="twitter"
                    placeholder="twitter.com/your-handle"
                    onChange={e => this.handleChange(e, 'valueTW')}
                  />
                </Label>
                <br />
                <Label for="instagram">
                  Instagram URL
                  <Input
                    type="text"
                    size="sm"
                    value={this.state.valueIG}
                    name="social-instagram"
                    id="instagram"
                    placeholder="instagram.com/your-handle"
                    onChange={e => this.handleChange(e, 'valueIG')}
                  />
                </Label>
                <br />
                <Label for="exampleSelect">
                  LinkedIN URL
                  <Input
                    type="text"
                    size="sm"
                    value={this.state.valueIN}
                    name="social-linkedin"
                    id="linkedin"
                    placeholder="linkedin.com/in/your-profile"
                    onChange={e => this.handleChange(e, 'valueIN')}
                  />
                </Label>
                <br />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <DoWhopButton onClick={this.toggle}>Save</DoWhopButton>
            <DoWhopButton onClick={this.toggle}>Cancel</DoWhopButton>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default SocialMediaEditModal;
