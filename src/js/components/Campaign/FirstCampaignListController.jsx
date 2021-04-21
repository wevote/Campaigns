import React, { Component } from 'react';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import CampaignActions from '../../actions/CampaignActions';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';


class FirstCampaignListController extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('FirstCampaignListController componentDidMount');
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.campaignListFirstRetrieve();
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppStoreChange () {
    this.campaignListFirstRetrieve();
  }

  onVoterStoreChange () {
    this.campaignListFirstRetrieve();
  }

  campaignListFirstRetrieve = () => {
    initializejQuery(() => {
      const campaignListFirstRetrieveInitiated = AppStore.campaignListFirstRetrieveInitiated();
      const voterFirstRetrieveCompleted = VoterStore.voterFirstRetrieveCompleted();
      // console.log('FirstCampaignListController campaignListFirstRetrieveInitiated: ', campaignListFirstRetrieveInitiated, ', voterFirstRetrieveCompleted: ', voterFirstRetrieveCompleted);
      if (voterFirstRetrieveCompleted && !campaignListFirstRetrieveInitiated) {
        AppActions.setCampaignListFirstRetrieveInitiated(true);
        CampaignActions.campaignListRetrieve();
      }
    });
  }

  render () {
    renderLog('FirstCampaignListController');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('FirstCampaignListController render');
    return (
      <span />
    );
  }
}

export default FirstCampaignListController;
