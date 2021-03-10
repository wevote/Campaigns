import Dispatcher from '../components/Dispatcher/Dispatcher';

export default {
  campaignSupporterRetrieve (campaignXWeVoteId) {
    Dispatcher.loadEndpoint('campaignSupporterRetrieve',
      {
        campaignx_we_vote_id: campaignXWeVoteId,
      });
  },

  supportCampaignSave (campaignXWeVoteId, campaignSupported, campaignSupportedChanged, visibleToPublic, visibleToPublicChanged) {
    // console.log('supportCampaignSave: ', supportCampaignSave);
    Dispatcher.loadEndpoint('campaignSupporterSave',
      {
        campaign_supported: campaignSupported,
        campaign_supported_changed: campaignSupportedChanged,
        campaignx_we_vote_id: campaignXWeVoteId,
        visible_to_public: visibleToPublic,
        visible_to_public_changed: visibleToPublicChanged,
      });
  },

  supporterEndorsementQueuedToSave (supporterEndorsement) {
    Dispatcher.dispatch({ type: 'supporterEndorsementQueuedToSave', payload: supporterEndorsement });
  },

  visibleToPublicQueuedToSave (visibleToPublic) {
    Dispatcher.dispatch({ type: 'visibleToPublicQueuedToSave', payload: visibleToPublic });
  },

  supporterEndorsementSave (campaignWeVoteId, supporterEndorsement) {
    // console.log('supporterEndorsementSave: ', supporterEndorsement);
    Dispatcher.loadEndpoint('campaignSupporterSave',
      {
        supporter_endorsement: supporterEndorsement,
        supporter_endorsement_changed: true,
        campaignx_we_vote_id: campaignWeVoteId,
      });
  },
};
