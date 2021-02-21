import Dispatcher from '../components/Dispatcher/Dispatcher';

export default {
  campaignDescriptionQueuedToSave (campaignDescription) {
    Dispatcher.dispatch({ type: 'campaignDescriptionQueuedToSave', payload: campaignDescription });
  },

  campaignDescriptionSave (campaignWeVoteId, campaignDescription) {
    // console.log('campaignDescriptionSave: ', campaignDescription);
    Dispatcher.loadEndpoint('campaignStartSave',
      {
        campaign_description: campaignDescription,
        campaign_description_changed: true,
        campaignx_we_vote_id: campaignWeVoteId,
      });
  },

  campaignEditAllReset () {
    Dispatcher.dispatch({ type: 'campaignEditAllReset', payload: true });
  },

  campaignEditAllSave (
    campaignWeVoteId,
    campaignDescriptionQueuedToSave, campaignDescriptionQueuedToSaveSet,
    campaignPhotoQueuedToSave, campaignPhotoQueuedToSaveSet,
    campaignPoliticianListQueuedToSave, campaignPoliticianListQueuedToSaveSet,
    campaignTitleQueuedToSave, campaignTitleQueuedToSaveSet,
  ) {
    Dispatcher.loadEndpoint('campaignStartSave',
      {
        campaign_description: campaignDescriptionQueuedToSave,
        campaign_description_changed: campaignDescriptionQueuedToSaveSet,
        campaign_photo_from_file_reader: campaignPhotoQueuedToSave,
        campaign_photo_changed: campaignPhotoQueuedToSaveSet,
        campaign_title: campaignTitleQueuedToSave,
        campaign_title_changed: campaignTitleQueuedToSaveSet,
        politician_list: campaignPoliticianListQueuedToSave,
        politician_list_changed: campaignPoliticianListQueuedToSaveSet,
        campaignx_we_vote_id: campaignWeVoteId,
      });
  },

  campaignPhotoQueuedToSave (campaignPhotoFromFileReader) {
    Dispatcher.dispatch({ type: 'campaignPhotoQueuedToSave', payload: campaignPhotoFromFileReader });
  },

  campaignPhotoSave (campaignWeVoteId, campaignPhotoFromFileReader) {
    Dispatcher.loadEndpoint('campaignStartSave',
      {
        campaign_photo_from_file_reader: campaignPhotoFromFileReader,
        campaign_photo_changed: true,
        campaignx_we_vote_id: campaignWeVoteId,
      });
  },

  campaignPoliticianListQueuedToSave (campaignPoliticianList) {
    Dispatcher.dispatch({ type: 'campaignPoliticianListQueuedToSave', payload: campaignPoliticianList });
  },

  campaignPoliticianListSave (campaignWeVoteId, campaignPoliticianList) {
    // console.log('campaignPoliticianListSave: ', campaignPoliticianList);
    Dispatcher.loadEndpoint('campaignStartSave',
      {
        politician_list: campaignPoliticianList,
        politician_list_changed: true,
        campaignx_we_vote_id: campaignWeVoteId,
      });
  },

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
