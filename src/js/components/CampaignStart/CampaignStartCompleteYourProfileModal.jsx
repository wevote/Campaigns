import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { withStyles, withTheme } from '@material-ui/core/styles';
import styled from 'styled-components';
import CompleteYourProfile from './CompleteYourProfile';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../utils/logging';


class CampaignStartCompleteYourProfileModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('CampaignStartCompleteYourProfileModal caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    // console.log('CampaignStartCompleteYourProfileModal componentWillUnmount');
    this.voterStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    console.error('Error caught in CampaignStartCompleteYourProfileModal: ', error);
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    this.setState({
      voter,
    });
  }

  closeModalFunction = () => {
    // console.log('CampaignStartCompleteYourProfileModal closeModalFunction');
    if (this.props.closeFunction) {
      this.props.closeFunction();
    }
  };

  onKeyDown = (event) => {
    event.preventDefault();
  };

  render () {
    renderLog('CampaignStartCompleteYourProfileModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;

    const { voter } = this.state;
    if (!voter) {
      // console.log('CampaignStartCompleteYourProfileModal render voter NOT found');
      return <div className="undefined-props" />;
    }
    // console.log('CampaignStartCompleteYourProfileModal render voter found');
    return (
      <Dialog
        id="campaignStartCompleteYourProfileModalDialog"
        classes={{
          paper: classes.dialogPaper,
          root: classes.dialogRoot,
        }}
        open={this.props.show}
        onClose={() => { this.closeModalFunction(); }}
      >
        <DialogTitle classes={{ root: classes.dialogTitle }}>
          <DialogTitleText>
            Complete your profile
          </DialogTitleText>
          <IconButton
            aria-label="Close"
            classes={{ root: classes.closeButton }}
            onClick={() => { this.closeModalFunction(); }}
            id="campaignStartCompleteYourProfileModalClose"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <section>
            <CompleteYourProfile />
          </section>
        </DialogContent>
      </Dialog>
    );
  }
}
CampaignStartCompleteYourProfileModal.propTypes = {
  classes: PropTypes.object,
  show: PropTypes.bool,
  closeFunction: PropTypes.func.isRequired,
};

const styles = () => ({
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  dialogRoot: {
    height: '100%',
    top: '-15%',
    left: '0% !important',
    right: 'unset !important',
    bottom: 'unset !important',
    padding: '0',
    width: '100%',
    zIndex: '9010 !important',
  },
  dialogPaper: {
    width: 480,
    maxHeight: '90%',
    height: 'unset',
    margin: '0 auto',
  },
  dialogContent: {
    padding: 0,
  },
  dialogTitle: {
    padding: '8px 15px 0 15px',
  },
});

const DialogTitleText = styled.span`
  display: block;
`;

export default withTheme(withStyles(styles)(CampaignStartCompleteYourProfileModal));
