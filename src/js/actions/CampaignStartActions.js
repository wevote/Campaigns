import Dispatcher from '../components/Dispatcher/Dispatcher';

export default {
  campaignRetrieve (campaignWeVoteId) {
    Dispatcher.loadEndpoint('campaignRetrieve',
      {
        campaign_we_vote_id: campaignWeVoteId,
      });
  },

  campaignTitleQueuedToSave (campaignTitle) {
    Dispatcher.dispatch({ type: 'campaignTitleQueuedToSave', payload: campaignTitle });
  },

  campaignTitleSave (campaignTitle) {
    // console.log('campaignTitleSave: ', campaignTitle);
    Dispatcher.loadEndpoint('campaignSave',
      {
        campaign_title: campaignTitle,
        campaign_title_changed: true,
      });
  },
};
