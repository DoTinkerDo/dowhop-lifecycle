// @flow

import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  parent: {
    position: 'relative'
  },
  text: {
    position: 'relative',
    zIndex: -1
  },
  hideComponent: {
    display: 'none'
  }
};

type Props = {
  name: string,
  handleImageSubmit: Function,
  accept: string,
  placeholder: string,
  classes: Object,
  uid: string,
  imageName: string
};

class FileInput extends Component<Props, { value: string }> {
  state = {
    value: ''
  };

  props: Props;

  handleChange = (e: Object) => {
    this.setState({
      value: e.target.value.split(/(\\|\/)/g).pop()
    });

    if (this.props.handleImageSubmit) this.props.handleImageSubmit(e, this.props.uid, this.props.imageName);
  };

  render() {
    const { value } = this.state;
    const { name, accept, placeholder, classes } = this.props;
    return (
      <div className={classes.parent}>
        <label htmlFor="edit-profile-image">
          <span className="fa fa-pencil pencil-profile-image" aria-hidden="true" />
          <input
            id="edit-profile-image"
            type="file"
            name={name}
            className={classes.hideComponent}
            onChange={this.handleChange}
            accept={accept}
          />
          <input
            type="text"
            tabIndex="-1"
            name={`name + '_filename'`}
            value={value}
            className={classes.text}
            onChange={() => {}}
            placeholder={placeholder}
          />
        </label>
      </div>
    );
  }
}

export default injectSheet(styles)(FileInput);
