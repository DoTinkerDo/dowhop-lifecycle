// @flow

import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, CardSubtitle, CardText, Modal, ModalBody, ModalFooter } from 'reactstrap';
import DoWhopButton from './DoWhopButton';

type Props = {};
type State = {
  modal: boolean
};

class SocialMediaEditModal extends Component<Props, State> {
  state = {
    modal: false
  };

  toggle = () => this.setState(prevState => ({ modal: !prevState.modal }));

  render() {
    return (
      <div>
        <CardSubtitle>
          Social Media
          <span className="fa fa-pencil pencil-social" onClick={this.toggle} aria-hidden="true" />
        </CardSubtitle>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className="">
          <ModalBody>
            <CardText toggle={this.toggle}>Enter the URLs to your social media profiles below</CardText>

            <Form>
              <FormGroup>
                <Label for="facebook">
                  Facebook URL
                  <Input type="text" name="social-facebook" id="facebook" />
                  <br />
                </Label>
                <Label for="twitter">
                  Twitter URL
                  <Input type="text" name="social-twitter" id="twitter" />
                  <br />
                </Label>
                <Label for="instagram">
                  Instagram URL
                  <Input type="text" name="social-instagram" id="instagram" />
                  <br />
                </Label>
                <Label for="exampleSelect">
                  Linked URL
                  <Input type="text" name="social-linkedin" id="linkedin" />
                  <br />
                </Label>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <DoWhopButton color="primary" onClick={this.toggle}>
              Save
            </DoWhopButton>
            <DoWhopButton color="secondary" onClick={this.toggle}>
              Cancel
            </DoWhopButton>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default SocialMediaEditModal;
