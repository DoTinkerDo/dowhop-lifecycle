// @flow

import React, { Component } from 'react';

type State = {
  value: string,
  styles: Object
};

type Props = {
  name: string,
  onChange: Function,
  accept: string,
  disabled: boolean,
  className: string,
  placeholder: string
};

class FileInput extends Component<Props, State> {
  state = {
    value: '',
    styles: {
      parent: {
        position: 'relative'
      },
      file: {
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: 0,
        width: '100%',
        zIndex: 1
      },
      text: {
        position: 'relative',
        zIndex: -1
      }
    }
  };

  props: Props;

  handleChange(e: Object) {
    this.setState({
      value: e.target.value.split(/(\\|\/)/g).pop()
    });

    if (this.props.onChange) this.props.onChange(e);
  }

  render() {
    return (
      <div style={this.state.styles.parent}>
        <input
          type="file"
          name={this.props.name}
          className={this.props.className}
          onChange={this.handleChange.bind(this)}
          disabled={this.props.disabled}
          accept={this.props.accept}
          style={this.state.styles.file}
        />

        <input
          type="text"
          tabIndex="-1"
          name={`this.props.name + '_filename'`}
          value={this.state.value}
          className={this.props.className}
          onChange={() => {}}
          placeholder={this.props.placeholder}
          disabled={this.props.disabled}
          style={this.state.styles.text}
        />
      </div>
    );
  }
}

export default FileInput;
