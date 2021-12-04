import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Snackbar, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';
import { renderLog } from '../../common/utils/logging';
import { snackOffset } from '../../common/utils/cordovaUtils';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';


class BrowserPushMessage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      open: true,
    };
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  // UNSAFE_componentWillReceiveProps (nextProps) {
  //   // When a new candidate is passed in, update this component to show the new data
  //   if (nextProps.incomingProps && nextProps.incomingProps.location && nextProps.incomingProps.location.state) {
  //     this.setState({
  //       message: nextProps.incomingProps.location.state.message,
  //       name: nextProps.incomingProps.location.state.message_name,
  //       // type: nextProps.incomingProps.location.state.message_type,
  //     });
  //   }
  // }

  handleClose = () => this.setState({ open: false });

  render () {
    renderLog('BrowserPushMessage');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, externalUniqueId } = this.props;
    let { message } = this.state;
    const { name } = this.state;
    // console.log(`BrowserPushMessage message: ${message}  name: ${name}`);

    if (name === 'test') {
    // type = 'danger';
      message = 'Test message';
    }

    // if (!type) {
    //   type = 'info';
    // }
    const openSnackbar = !!(this.state.open && message);
    return (
      <Snackbar
        classes={{ anchorOriginBottomCenter: classes.anchorOriginBottomCenter }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={this.handleClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{message}</span>}
        action={[
          <IconButton
            id={externalUniqueId ? `pushCloseIconButton-${externalUniqueId}` : 'pushCloseIconButton'}
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={this.handleClose}
          >
            <Close />
          </IconButton>,
        ]}
      />
    );
  }
}
BrowserPushMessage.propTypes = {
  externalUniqueId: PropTypes.string,
  // incomingProps: PropTypes.object, // needs more specificity
  classes: PropTypes.object,
};

const styles = (theme) => (
  isWebApp() ? {
    anchorOriginBottomCenter: {
      bottom: 54,
      [theme.breakpoints.up('md')]: {
        bottom: 20,
      },
    },
  } : {
    anchorOriginBottomCenter: {
      bottom: snackOffset(),
    },
  }
);

export default withStyles(styles)(BrowserPushMessage);
