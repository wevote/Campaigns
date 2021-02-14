import { ReduceStore } from 'flux/utils';
import Dispatcher from '../components/Dispatcher/Dispatcher';

class CampaignStartStore extends ReduceStore {
  getInitialState () {
    return {
      campaignPoliticianList: [],
      campaignPoliticianListQueuedToSave: [],
      campaignPoliticianListQueuedToSaveSet: false,
      campaignDescription: '',
      campaignPhoto: '',
      campaignTitle: '',
      campaignTitleQueuedToSave: '',
      campaignTitleQueuedToSaveSet: false,
      campaignXOwnerList: [],
      campaignXWeVoteId: '',
    };
  }

  resetState () {
    return this.getInitialState();
  }

  campaignPoliticianListExists () {
    if (this.getState().campaignPoliticianList) {
      return Boolean(this.getState().campaignPoliticianList.length > 0);
    } else {
      return false;
    }
  }

  campaignDescriptionExists () {
    if (this.getState().campaignDescription) {
      return Boolean(this.getState().campaignDescription.length > 10);
    } else {
      return false;
    }
  }

  campaignPhotoExists () {
    if (this.getState().campaignPhoto) {
      return Boolean(this.getState().campaignPhoto.length > 10);
    } else {
      return false;
    }
  }

  campaignTitleExists () {
    if (this.getState().campaignTitle) {
      return Boolean(this.getState().campaignTitle.length > 10);
    } else {
      return false;
    }
  }

  getCampaignPoliticianList () {
    return this.getState().campaignPoliticianList || [];
  }

  getCampaignPoliticianListQueuedToSave () {
    return this.getState().campaignPoliticianListQueuedToSave || [];
  }

  getCampaignPoliticianListQueuedToSaveSet () {
    return this.getState().campaignPoliticianListQueuedToSaveSet || false;
  }

  getCampaignTitle () {
    return this.getState().campaignTitle || '';
  }

  getCampaignTitleQueuedToSave () {
    return this.getState().campaignTitleQueuedToSave;
  }

  getCampaignTitleQueuedToSaveSet () {
    return this.getState().campaignTitleQueuedToSaveSet;
  }

  reduce (state, action) {
    switch (action.type) {
      case 'campaignPoliticianListQueuedToSave':
        // console.log('CampaignStartStore campaignPoliticianListQueuedToSave: ', action.payload);
        return {
          ...state,
          campaignPoliticianListQueuedToSave: action.payload,
          campaignPoliticianListQueuedToSaveSet: true,
        };

      case 'campaignRetrieveAsOwner':
        // console.log('CampaignStartStore campaignRetrieveAsOwner');
        return {
          ...state,
          campaignPoliticianList: action.res.campaignx_politician_list,
          campaignTitle: action.res.campaign_title,
          campaignXOwnerList: action.res.campaignx_owner_list,
          campaignXWeVoteId: action.res.campaignx_we_vote_id,
        };

      case 'campaignStartSave':
        // console.log('CampaignStartStore campaignStartSave');
        return {
          ...state,
          campaignPoliticianList: action.res.campaignx_politician_list,
          campaignTitle: action.res.campaign_title,
          campaignXOwnerList: action.res.campaignx_owner_list,
          campaignXWeVoteId: action.res.campaignx_we_vote_id,
        };

      case 'campaignTitleQueuedToSave':
        // console.log('CampaignStartStore campaignTitleQueuedToSave: ', action.payload);
        return {
          ...state,
          campaignTitleQueuedToSave: action.payload,
          campaignTitleQueuedToSaveSet: true,
        };

      default:
        return state;
    }
  }
}

export default new CampaignStartStore(Dispatcher);
