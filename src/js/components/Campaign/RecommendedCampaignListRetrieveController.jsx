import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import CampaignActions from '../../actions/CampaignActions';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';


class RecommendedCampaignListRetrieveController extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('RecommendedCampaignListRetrieveController componentDidMount');
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.recommendedCampaignListFirstRetrieve();
  }

  componentDidUpdate (prevProps) {
    // console.log('RecommendedCampaignListRetrieveController componentDidUpdate');
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.recommendedCampaignListFirstRetrieve();
      }
    }
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppStoreChange () {
    this.recommendedCampaignListFirstRetrieve();
  }

  onVoterStoreChange () {
    this.recommendedCampaignListFirstRetrieve();
  }

  recommendedCampaignListFirstRetrieve = () => {
    const { campaignXWeVoteId } = this.props;
    if (campaignXWeVoteId) {
      initializejQuery(() => {
        const recommendedCampaignListFirstRetrieveInitiated = AppStore.recommendedCampaignListFirstRetrieveInitiated();
        const voterFirstRetrieveCompleted = VoterStore.voterFirstRetrieveCompleted();
        // console.log('RecommendedCampaignListRetrieveController recommendedCampaignListFirstRetrieveInitiated: ', recommendedCampaignListFirstRetrieveInitiated, ', voterFirstRetrieveCompleted: ', voterFirstRetrieveCompleted);
        if (voterFirstRetrieveCompleted && !recommendedCampaignListFirstRetrieveInitiated) {
          AppActions.setRecommendedCampaignListFirstRetrieveInitiated(true);
          CampaignActions.recommendedCampaignListRetrieve(campaignXWeVoteId);
        }
      });
    }
  }

  render () {
    renderLog('RecommendedCampaignListRetrieveController');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('RecommendedCampaignListRetrieveController render');
    return (
      <span />
    );
  }
}
RecommendedCampaignListRetrieveController.propTypes = {
  campaignXWeVoteId: PropTypes.string,
};

export default RecommendedCampaignListRetrieveController;
