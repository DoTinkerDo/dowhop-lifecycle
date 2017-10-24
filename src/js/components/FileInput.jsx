// @flow

import React, { Component } from 'react';

type Props = {
  name: string,
  handleImageSubmit: Function,
  accept: string,
  className: string,
  placeholder: string
};

type State = {
  value: string,
  styles: Object
};

class FileInput extends Component<Props, State> {
  state = {
    value: '',
    styles: {
      parent: {
        position: 'relative'
      },
      // file: {
      //   position: 'absolute',
      //   top: 0,
      //   left: 0,
      //   opacity: 0,
      //   width: '100%',
      //   zIndex: 1
      // },
      text: {
        position: 'relative',
        zIndex: -1
      }
    }
  };

  props: Props;

  handleChange = (e: Object) => {
    this.setState({
      value: e.target.value.split(/(\\|\/)/g).pop()
    });

    if (this.props.handleImageSubmit) this.props.handleImageSubmit(e);
  };

  render() {
    const { styles, value } = this.state;
    const { name, className, accept, placeholder } = this.props;
    return (
      <div style={styles.parent}>
        <label htmlFor="edit-profile-image">
          <span className="fa fa-pencil pencil-profile-image" aria-hidden="true" />
          <input
            id="edit-profile-image"
            type="file"
            name={name}
            className={className}
            onChange={this.handleChange}
            accept={accept}
            // style={styles.file}
          />
          <input
            type="text"
            tabIndex="-1"
            name={`name + '_filename'`}
            value={value}
            className={className}
            onChange={() => {}}
            placeholder={placeholder}
            style={styles.text}
          />
        </label>
      </div>
    );
  }
}

export default FileInput;
