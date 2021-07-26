import React, { Component } from 'react';
import PropTypes from 'prop-types';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../utils/logging';
import { retrieveCampaignXFromIdentifiers } from '../../utils/campaignUtils';
import VoterStore from '../../stores/VoterStore';


class CampaignRetrieveController extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignRetrieveInitiated: false,
    };
  }

  componentDidMount () {
    // console.log('CampaignRetrieveController componentDidMount');
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.campaignFirstRetrieve();
  }

  componentDidUpdate (prevProps) {
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    // console.log('CampaignRetrieveController componentDidUpdate, campaignXWeVoteIdPrevious:', campaignXWeVoteIdPrevious, ', campaignXWeVoteId:', campaignXWeVoteId);
    if (campaignXWeVoteId && campaignXWeVoteIdPrevious) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.campaignFirstRetrieve();
      }
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.campaignFirstRetrieve();
  }

  campaignFirstRetrieve = () => {
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.props;
    // console.log('CampaignRetrieveController campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
    if (campaignSEOFriendlyPath || campaignXWeVoteId) {
      const { campaignRetrieveInitiated } = this.state;
      initializejQuery(() => {
        const voterFirstRetrieveCompleted = VoterStore.voterFirstRetrieveCompleted();
        // console.log('CampaignRetrieveController campaignRetrieveInitiated: ', campaignRetrieveInitiated, ', voterFirstRetrieveCompleted: ', voterFirstRetrieveCompleted);
        if (voterFirstRetrieveCompleted && !campaignRetrieveInitiated) {
          const updatedCampaignRetrieveInitiated = retrieveCampaignXFromIdentifiers(campaignSEOFriendlyPath, campaignXWeVoteId);
          // console.log('campaignRetrieveInitiated:', campaignRetrieveInitiated, 'updatedCampaignRetrieveInitiated:', updatedCampaignRetrieveInitiated);
          this.setState({
            campaignRetrieveInitiated: updatedCampaignRetrieveInitiated,
          });
        }
      });
    }
  }

  render () {
    renderLog('CampaignRetrieveController');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('CampaignRetrieveController render');
    return (
      <span />
    );
  }
}
CampaignRetrieveController.propTypes = {
  campaignSEOFriendlyPath: PropTypes.string,
  campaignXWeVoteId: PropTypes.string,
};

export default CampaignRetrieveController;
