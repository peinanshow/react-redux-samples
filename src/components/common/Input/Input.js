import React, {PropTypes, Component} from "react";
import cx from "classnames";
import ReactDOM from "react-dom";
class Input extends Component {

  constructor(props) {
    super(props);
    this.isPlaceholder = 'placeholder' in document.createElement('input');
  }

  // ACTION/EVENT HANDLERS

  handleKeyDown = (event) => {
    const value = this.refs.input.value;
    if (event.keyCode === 13) {
      this.props.onChange(value); // enter
      this.refs.input.value = '';
    } else if (event.keyCode === 27) {
      this.refs.input.value = ''; // escape
    }
  };
  handleFocus = ()=> {
    if (!this.isPlaceholder && this.refs.input.value === this.props.placeholder) {
      this.refs.input.value = '';
    }
  };
  handleBlur = ()=> {
    if (!this.isPlaceholder && this.refs.input.value === '') {
      this.refs.input.value = this.props.placeholder;
    }
  };

  componentDidUpdate() {
    if (!this.isPlaceholder && !this.props.value && this.props.placeholder !== "" && ReactDOM.findDOMNode(this.refs.input)) ReactDOM.findDOMNode(this.refs.input).value = this.props.placeholder;
  }

  // RENDER COMPONENT

  render() {

    const {className, style, hidden, ...otherProps} = this.props;

    return !hidden && (
        <input
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          ref="input"
          className={cx(className, style.input)}
          onKeyDown={this.handleKeyDown}
          style={style}
          {...otherProps}
        />
      );
  }
}

Input.propTypes = {
  // Data
  className: PropTypes.string,
  hidden: PropTypes.bool,
  style: PropTypes.object,
  value: PropTypes.string,
  // Actions
  onChange: PropTypes.func,
};

Input.defaultProps = {
  hidden: false,
  style: {
    input: 'input',
    input_disabled: 'input_disabled',
  },
};

export default Input;
