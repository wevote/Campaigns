import Dispatcher from '../components/Dispatcher/Dispatcher';

export default {
  supportEndorsementQueuedToSave (supportEndorsement) {
    Dispatcher.dispatch({ type: 'supportEndorsementQueuedToSave', payload: supportEndorsement });
  },

  supportEndorsementSave (campaignWeVoteId, supportEndorsement) {
    // console.log('supportEndorsementSave: ', supportEndorsement);
    Dispatcher.loadEndpoint('campaignSupportSave',
      {
        support_endorsement: supportEndorsement,
        support_endorsement_changed: true,
        campaignx_we_vote_id: campaignWeVoteId,
      });
  },
};
