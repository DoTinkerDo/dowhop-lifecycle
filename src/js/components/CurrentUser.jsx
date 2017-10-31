// @flow

import React from 'react';
import { Col, Card, CardSubtitle, CardText, CardBody, CardImg, Row } from 'reactstrap';
import FileInput from './FileInput';
import LoadingDots from './LoadingDots';
import ProfileHeadlineInput from './ProfileHeadlineInput';
import ProfileAboutInput from './ProfileAboutInput';
import SocialMediaIcons from './SocialMediaIcons';
import SocialMediaEditModal from './SocialMediaEditModal';

const CurrentUser = (props: {
  uid: string,
  email: string,
  about: Object,
  headline: Object,
  value: string,
  headlineValue: string,
  displayName: string,
  profileUrl: string,
  handleChange: Function,
  handleHeadlineChange: Function,
  handleHeadlineSubmit: Function,
  handleSubmit: Function,
  headline: Object,
  handleImageSubmit: Function,
  imageName: string,
  socialUrls: Object,
  handleSocialMediaUrlSubmit: Function,
  socialInputs: Object,
  handleSocialUrlChange: Function
}) => {
  const {
    uid,
    email,
    about,
    value,
    handleChange,
    handleSubmit,
    displayName,
    profileUrl,
    headlineValue,
    handleHeadlineChange,
    handleHeadlineSubmit,
    headline,
    handleImageSubmit,
    imageName,
    socialUrls,
    handleSocialMediaUrlSubmit,
    socialInputs,
    handleSocialUrlChange
  } = props;
  return (
    <div>
      <Row>
        <Col xs="12" sm="6">
          <Card>
            <CardBody>
              <ProfileHeadlineInput
                headline={headline}
                headlineValue={headlineValue}
                handleHeadlineChange={handleHeadlineChange}
                handleHeadlineSubmit={handleHeadlineSubmit}
                uid={uid}
              />
            </CardBody>
            <FileInput
              imageName={imageName}
              placeholder="Click to upload image..."
              name="profileImage"
              accept=".png,.gif,.jpg"
              handleImageSubmit={handleImageSubmit}
              uid={uid}
            />
            {!profileUrl && <LoadingDots />}
            {profileUrl && (
              <CardImg
                src={profileUrl}
                alt={`headshot for ${displayName}`}
                className="profile-image"
                data-img-name={imageName}
              />
            )}
            <CardBody>
              <CardSubtitle>Name</CardSubtitle>
              <CardText>{displayName}</CardText>
              <ProfileAboutInput
                about={about}
                value={value}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                uid={uid}
              />
              <CardSubtitle>Contact</CardSubtitle>
              <CardText>{email}</CardText>
              <SocialMediaEditModal
                uid={uid}
                handleSocialMediaUrlSubmit={handleSocialMediaUrlSubmit}
                socialInputs={socialInputs}
                handleSocialUrlChange={handleSocialUrlChange}
              />
              <SocialMediaIcons socialUrls={socialUrls} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CurrentUser;
