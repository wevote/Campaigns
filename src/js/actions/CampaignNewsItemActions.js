import Dispatcher from '../dispatcher/Dispatcher';

export default {
  campaignNewsItemSubjectQueuedToSave (campaignNewsItemSubject) {
    Dispatcher.dispatch({ type: 'campaignNewsItemSubjectQueuedToSave', payload: campaignNewsItemSubject });
  },

  campaignNewsItemTextQueuedToSave (campaignNewsItemText) {
    Dispatcher.dispatch({ type: 'campaignNewsItemTextQueuedToSave', payload: campaignNewsItemText });
  },

  campaignNewsItemTextSave (
    campaignWeVoteId,
    campaignNewsItemWeVoteId,
    campaignNewsSubject,
    campaignNewsSubjectSet,
    campaignNewsText,
    campaignNewsTextSet,
  ) {
    // console.log('campaignNewsTextSave: ', campaignNewsText);
    Dispatcher.loadEndpoint('campaignNewsItemSave',
      {
        campaignx_we_vote_id: campaignWeVoteId,
        campaignx_news_item_we_vote_id: campaignNewsItemWeVoteId,
        campaign_news_subject: campaignNewsSubject,
        campaign_news_subject_changed: campaignNewsSubjectSet,
        campaign_news_text: campaignNewsText,
        campaign_news_text_changed: campaignNewsTextSet,
      });
  },
};
