import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import styled from 'styled-components';
import CampaignStore from '../../stores/CampaignStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import { historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';


class CampaignDetailsActionButtonFooter extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignSupported: false,
      voterFirstName: '',
      voterIsSignedInWithEmail: false,
      voterLastName: '',
      voterProfileIsComplete: false,
      voterWeVoteId: '',
    };
  }

  componentDidMount () {
    // console.log('CampaignDetailsActionButtonFooter componentDidMount');
    this.onCampaignSupporterStoreChange();
    this.onVoterStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('CampaignDetailsActionButtonFooter componentDidUpdate');
    const {
      campaignSEOFriendlyPath: campaignSEOFriendlyPathPrevious,
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignSEOFriendlyPath,
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.pullCampaignXSupporterVoterEntry(campaignXWeVoteId);
      }
    } else if (campaignSEOFriendlyPath) {
      if (campaignSEOFriendlyPath !== campaignSEOFriendlyPathPrevious) {
        const campaignXWeVoteIdCalculated = CampaignStore.getCampaignXWeVoteIdFromCampaignSEOFriendlyPath(campaignSEOFriendlyPath);
        // console.log('campaignXWeVoteIdCalculated:', campaignXWeVoteIdCalculated);
        this.pullCampaignXSupporterVoterEntry(campaignXWeVoteIdCalculated);
      }
    }
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('CampaignDetailsActionButtonFooter caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    // console.log('CampaignDetailsActionButtonFooter componentWillUnmount');
    this.campaignStoreListener.remove();
    this.campaignSupporterStoreListener.remove();
    this.voterStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    console.error('Error caught in CampaignDetailsActionButtonFooter: ', error);
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onCampaignStoreChange () {
    this.onCampaignSupporterStoreChange();
  }

  onCampaignSupporterStoreChange () {
    const {
      campaignSEOFriendlyPath,
      campaignXWeVoteId,
    } = this.props;
    // console.log('CampaignDetailsActionButtonFooter onCampaignSupporterStoreChange campaignXWeVoteId:', campaignXWeVoteId, ', campaignSEOFriendlyPath:', campaignSEOFriendlyPath);
    if (campaignXWeVoteId) {
      this.pullCampaignXSupporterVoterEntry(campaignXWeVoteId);
    } else if (campaignSEOFriendlyPath) {
      const campaignXWeVoteIdCalculated = CampaignStore.getCampaignXWeVoteIdFromCampaignSEOFriendlyPath(campaignSEOFriendlyPath);
      this.pullCampaignXSupporterVoterEntry(campaignXWeVoteIdCalculated);
    }
  }

  onVoterStoreChange () {
    // const { voterProfileIsComplete: voterProfileIsCompletePrevious, voterWeVoteId: voterWeVoteIdPrevious } = this.state;
    const voterFirstName = VoterStore.getFirstName();
    const voterLastName = VoterStore.getLastName();
    const voterIsSignedInWithEmail = VoterStore.getVoterIsSignedInWithEmail();
    const voterWeVoteId = VoterStore.getVoterWeVoteId();
    this.setState({
      voterFirstName,
      voterLastName,
      voterIsSignedInWithEmail,
    });
    const voterProfileIsComplete = (voterFirstName && voterLastName && voterIsSignedInWithEmail) || false;
    // console.log('CampaignDetailsActionButtonFooter onVoterStoreChange voterProfileIsComplete:', voterProfileIsComplete, ', voterWeVoteId:', voterWeVoteId);
    // if (voterProfileIsComplete !== voterProfileIsCompletePrevious || voterWeVoteId !== voterWeVoteIdPrevious) {
    this.setState({
      voterProfileIsComplete,
      voterWeVoteId,
    });
    // }
  }

  pullCampaignXSupporterVoterEntry = (campaignXWeVoteId) => {
    // console.log('pullCampaignXSupporterVoterEntry campaignXWeVoteId:', campaignXWeVoteId);
    if (campaignXWeVoteId) {
      const campaignXSupporterVoterEntry = CampaignSupporterStore.getCampaignXSupporterVoterEntry(campaignXWeVoteId);
      // console.log('onCampaignSupporterStoreChange campaignXSupporterVoterEntry:', campaignXSupporterVoterEntry);
      const {
        campaign_supported: campaignSupported,
        campaignx_we_vote_id: campaignXWeVoteIdFromCampaignXSupporter,
      } = campaignXSupporterVoterEntry;
      // console.log('onCampaignSupporterStoreChange campaignSupported: ', campaignSupported);
      if (campaignXWeVoteIdFromCampaignXSupporter) {
        this.setState({
          campaignSupported,
        });
      } else {
        this.setState({
          campaignSupported: false,
        });
      }
    } else {
      this.setState({
        campaignSupported: false,
      });
    }
  }

  submitSupportButtonMobile = () => {
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.props;
    // console.log('CampaignDetailsActionButtonFooter submitSupportButtonMobile');
    const { voterFirstName, voterLastName, voterIsSignedInWithEmail } = this.state;
    if (!voterFirstName || !voterLastName || !voterIsSignedInWithEmail) {
      // Navigate to the mobile complete your profile page
      if (campaignSEOFriendlyPath) {
        historyPush(`/c/${campaignSEOFriendlyPath}/complete-your-support-for-this-campaign`);
      } else {
        historyPush(`/id/${campaignXWeVoteId}/complete-your-support-for-this-campaign`);
      }
    } else {
      // Mark that voter supports this campaign
      this.props.functionToUseWhenProfileComplete();
    }
  }

  onKeyDown = (event) => {
    event.preventDefault();
  };

  render () {
    renderLog('CampaignDetailsActionButtonFooter');  // Set LOG_RENDER_EVENTS to log all renders
    const { campaignSEOFriendlyPath, campaignXWeVoteId, classes } = this.props;
    const hideFooterBehindModal = false;
    const supportButtonClasses = classes.buttonDefault; // isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;
    // console.log('CampaignDetailsActionButtonFooter render campaignXWeVoteId:', campaignXWeVoteId, ', campaignSEOFriendlyPath:', campaignSEOFriendlyPath);
    if (!campaignSEOFriendlyPath && !campaignXWeVoteId) {
      // console.log('CampaignDetailsActionButtonFooter render voter NOT found');
      return <div className="undefined-campaign-state" />;
    }

    const {
      campaignSupported, voterWeVoteId,
    } = this.state;
    if (!voterWeVoteId) {
      // console.log('CampaignDetailsActionButtonFooter render voter NOT found');
      return <div className="undefined-props" />;
    }
    // console.log('CampaignDetailsActionButtonFooter render voter found');
    return (
      <Wrapper
        className={hideFooterBehindModal ? 'u-z-index-1000' : 'u-z-index-9000'}
      >
        <ButtonPanel>
          {campaignSupported ? (
            <Button
              classes={{ root: supportButtonClasses }}
              color="primary"
              id="keepHelpingButtonFooter"
              onClick={() => this.props.functionToUseToKeepHelping()}
              variant="contained"
            >
              I&apos;d like to keep helping!
            </Button>
          ) : (
            <Button
              classes={{ root: supportButtonClasses }}
              color="primary"
              id="supportButtonFooter"
              onClick={this.submitSupportButtonMobile}
              variant="contained"
            >
              Support this campaign
            </Button>
          )}
        </ButtonPanel>
      </Wrapper>
    );
  }
}
CampaignDetailsActionButtonFooter.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  campaignSEOFriendlyPath: PropTypes.string,
  classes: PropTypes.object,
  functionToUseToKeepHelping: PropTypes.func.isRequired,
  functionToUseWhenProfileComplete: PropTypes.func.isRequired,
};

const styles = () => ({
  buttonDefault: {
    boxShadow: 'none !important',
    fontSize: 20,
    height: '45px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
  buttonDefaultCordova: {
    boxShadow: 'none !important',
    fontSize: 20,
    height: '35px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
});

const ButtonPanel = styled.div`
  background-color: #fff;
  border-top: 1px solid #ddd;
  padding: 10px;
`;

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  bottom: 0;
  display: block;
`;

export default withTheme(withStyles(styles)(CampaignDetailsActionButtonFooter));
