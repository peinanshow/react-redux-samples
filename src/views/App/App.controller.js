import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as notificationActionCreators from '../../actions/NotificationActionCreators';
import createDataProviders from '../../utils/createDataProviders';
import Notifications from '../../components/common/Notifications';

class AppViewController extends Component {

  // Assign properties
  components = {

    [Notifications]: () => {
      const { notification, notificationActions } = this.props;
      return {
        message: notification.message,
        description: notification.description,
        isVisible: notification.visibility,
        onDismiss: notificationActions.hideNotification,
      };
    },
  };

  render() {
    return (
      <div className={this.props.className}>
        { createDataProviders(this.props.children, this.components) }
      </div>
    );
  }
}

AppViewController.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
  notification: PropTypes.object,
  notificationActions: PropTypes.object,
  ui: PropTypes.object,
};

const mapStateToProps = (state) => ({
  notification: state.notification,
  ui: state.ui,
  appActions: PropTypes.object
});

const mapDispatchToProps = (dispatch) => ({
  notificationActions: bindActionCreators(
    notificationActionCreators,
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppViewController);
