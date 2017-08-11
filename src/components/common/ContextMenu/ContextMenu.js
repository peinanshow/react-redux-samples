import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

class ContextMenu extends Component {

  state = {
    rect: {},
    innerWidth: 0,
    innerHeight: 0,
  };

  // COMPONENT LIFECYCLE

  componentDidMount() {
    document.addEventListener('mousedown', this.handleOnMouseDown);
    document.addEventListener('click', this.handleOnClick);
    const { innerWidth, innerHeight } = window;
    const node = ReactDOM.findDOMNode(this);
    const rect = node.getBoundingClientRect();
    this.setState({ rect, innerWidth, innerHeight }); // eslint-disable-line react/no-did-mount-set-state
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOnMouseDown);
    document.removeEventListener('click', this.handleOnClick);
  }

  // UTILS

  getMenuPosition = (event) => {
    const { rect, innerWidth, innerHeight } = this.state;
    const position = {
      top: event.clientY,
      left: event.clientX,
      maxHeight: innerHeight - 20,
    };

    if (rect.top + rect.height > innerHeight) position.top -= rect.height;
    if (rect.left + rect.width > innerWidth) position.left -= rect.width;
    return position;
  };

  // ACTION HANDLERS

  handleDismiss = () => this.props.onDismiss();

  // EVENT HANDLERS

  handleOnClick = () => this.handleDismiss();

  handleOnMouseDown = (event) => {
    // right click
    if (event.which === 3) {
      this.handleDismiss();
    }
  };

  // RENDER COMPONENT

  render() {
    const { className, children, style, event } = this.props;
    return (
      <ul className={cx(style.contextMenu, className)} style={this.getMenuPosition(event)}>
        { children }
      </ul>
    );
  }
}

ContextMenu.propTypes = {
  // Data
  children: PropTypes.array,
  className: PropTypes.string,
  contextID: PropTypes.string,
  event: PropTypes.object,
  style: PropTypes.object,
  // Actions
  onDismiss: PropTypes.func,
};

ContextMenu.defaultProps = {
  style: {},
};

export default ContextMenu;
