import { ReduceStore } from 'flux/utils';
import Dispatcher from '../components/Dispatcher/Dispatcher';

class CampaignStartStore extends ReduceStore {
  getInitialState () {
    return {
      campaignCandidateList: [],
      campaignCandidateListQueuedToSave: [],
      campaignDescription: '',
      campaignPhoto: '',
      campaignTitle: '',
      campaignTitleQueuedToSave: '',
      campaignXOwnerList: [],
      campaignXWeVoteId: '',
    };
  }

  resetState () {
    return this.getInitialState();
  }

  campaignCandidateListExists () {
    if (this.getState().campaignCandidateList) {
      return Boolean(this.getState().campaignCandidateList.length > 0);
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

  getCampaignCandidateList () {
    return this.getState().campaignCandidateList || [];
  }

  getCampaignCandidateListQueuedToSave () {
    return this.getState().campaignCandidateListQueuedToSave || [];
  }

  getCampaignTitle () {
    return this.getState().campaignTitle || '';
  }

  getCampaignTitleQueuedToSave () {
    return this.getState().campaignTitleQueuedToSave;
  }

  reduce (state, action) {
    switch (action.type) {
      case 'campaignCandidateListQueuedToSave':
        // console.log('CampaignStartStore campaignCandidateListQueuedToSave: ', action.payload);
        return { ...state, campaignCandidateListQueuedToSave: action.payload };

      case 'campaignRetrieveAsOwner':
        // console.log('CampaignStartStore campaignRetrieveAsOwner');
        return {
          ...state,
          campaignCandidateList: action.res.campaign_candidate_list,
          campaignTitle: action.res.campaign_title,
          campaignXOwnerList: action.res.campaignx_owner_list,
          campaignXWeVoteId: action.res.campaignx_we_vote_id,
        };

      case 'campaignStartSave':
        // console.log('CampaignStartStore campaignStartSave');
        return {
          ...state,
          campaignCandidateList: action.res.campaign_candidate_list,
          campaignTitle: action.res.campaign_title,
          campaignXOwnerList: action.res.campaignx_owner_list,
          campaignXWeVoteId: action.res.campaignx_we_vote_id,
        };

      case 'campaignTitleQueuedToSave':
        // console.log('CampaignStartStore campaignTitleQueuedToSave: ', action.payload);
        return { ...state, campaignTitleQueuedToSave: action.payload };

      default:
        return state;
    }
  }
}

export default new CampaignStartStore(Dispatcher);
