import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../utils/logging';
import { retrieveCampaignXFromIdentifiersIfNeeded } from '../../utils/campaignUtils';
import VoterStore from '../../stores/VoterStore';


class FirstCampaignController extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('FirstCampaignController componentDidMount');
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.campaignFirstRetrieve();
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppStoreChange () {
    this.campaignFirstRetrieve();
  }

  onVoterStoreChange () {
    this.campaignFirstRetrieve();
  }

  campaignFirstRetrieve = () => {
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.props;
    initializejQuery(() => {
      const campaignFirstRetrieveInitiated = AppStore.campaignFirstRetrieveInitiated();
      const voterFirstRetrieveCompleted = VoterStore.voterFirstRetrieveCompleted();
      // console.log('FirstCampaignController campaignFirstRetrieveInitiated: ', campaignFirstRetrieveInitiated, ', voterFirstRetrieveCompleted: ', voterFirstRetrieveCompleted);
      if (voterFirstRetrieveCompleted && !campaignFirstRetrieveInitiated) {
        AppActions.setCampaignFirstRetrieveInitiated(true);
        retrieveCampaignXFromIdentifiersIfNeeded(campaignSEOFriendlyPath, campaignXWeVoteId);
      }
    });
  }

  render () {
    renderLog('FirstCampaignController');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('FirstCampaignController render');
    return (
      <span />
    );
  }
}
FirstCampaignController.propTypes = {
  campaignSEOFriendlyPath: PropTypes.string,
  campaignXWeVoteId: PropTypes.string,
};

export default FirstCampaignController;
