import Dispatcher from '../components/Dispatcher/Dispatcher';

export default {
  campaignRetrieve (campaignWeVoteId) {
    Dispatcher.loadEndpoint('campaignRetrieve',
      {
        campaignx_we_vote_id: campaignWeVoteId,
      });
  },

  campaignRetrieveAsOwner (campaignWeVoteId) {
    Dispatcher.loadEndpoint('campaignRetrieveAsOwner',
      {
        campaignx_we_vote_id: campaignWeVoteId,
      });
  },

  campaignTitleQueuedToSave (campaignTitle) {
    Dispatcher.dispatch({ type: 'campaignTitleQueuedToSave', payload: campaignTitle });
  },

  campaignTitleSave (campaignWeVoteId, campaignTitle) {
    // console.log('campaignTitleSave: ', campaignTitle);
    Dispatcher.loadEndpoint('campaignStartSave',
      {
        campaign_title: campaignTitle,
        campaign_title_changed: true,
        campaignx_we_vote_id: campaignWeVoteId,
      });
  },
};
