import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AppActions from '../../actions/AppActions';
import { historyPush, isCordova } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';

class SupportButton extends Component {
  constructor (props) {
    super(props);
    this.state = {
      voterFirstName: '',
      voterLastName: '',
      voterSignedInWithEmail: false,
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    // console.log('CompleteYourProfile componentWillUnmount');
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const voterFirstName = VoterStore.getFirstName();
    const voterLastName = VoterStore.getLastName();
    const voterSignedInWithEmail = VoterStore.getVoterIsSignedInWithEmail();
    this.setState({
      voterFirstName,
      voterLastName,
      voterSignedInWithEmail,
    });
  }

  submitSupportButtonDesktop = () => {
    const { pathToUseWhenProfileComplete } = this.props;
    const { voterFirstName, voterLastName, voterSignedInWithEmail } = this.state;
    if (!voterFirstName || !voterLastName || !voterSignedInWithEmail) {
      // Open complete your profile modal
      AppActions.setShowCompleteYourProfileModal(true);
    } else {
      // TODO: Mark that voter supports this campaign
      historyPush(pathToUseWhenProfileComplete);
    }
  }

  render () {
    renderLog('SupportButton');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`SupportButton window.location.href: ${window.location.href}`);
    }
    const { classes } = this.props;
    const hideFooterBehindModal = false;
    const supportButtonClasses = classes.buttonDefault; // isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;
    return (
      <div>
        <Wrapper
          className={hideFooterBehindModal ? 'u-z-index-1000' : 'u-z-index-9000'}
        >
          <ButtonPanel>
            <Button
              classes={{ root: supportButtonClasses }}
              color="primary"
              id="supportButtonDesktop"
              onClick={this.submitSupportButtonDesktop}
              variant="contained"
            >
              Support this campaign
            </Button>
          </ButtonPanel>
        </Wrapper>
      </div>
    );
  }
}
SupportButton.propTypes = {
  classes: PropTypes.object,
  pathToUseWhenProfileComplete: PropTypes.string.isRequired,
};

const styles = (theme) => ({
  buttonDefault: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      fontSize: '16px',
      padding: '0',
    },
  },
  buttonDefaultCordova: {
    boxShadow: 'none !important',
    height: '35px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
});

const ButtonPanel = styled.div`
  background-color: #fff;
  padding: 10px 0;
`;

const Wrapper = styled.div`
  width: 100%;
  display: block;
`;

export default withStyles(styles)(SupportButton);
