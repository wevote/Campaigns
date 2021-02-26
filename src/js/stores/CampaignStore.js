import { ReduceStore } from 'flux/utils';
import Dispatcher from '../components/Dispatcher/Dispatcher';

class CampaignStore extends ReduceStore {
  getInitialState () {
    return {
      allCachedCampaignXDicts: {},  // key == campaignXWeVoteId, value = campaignX data dict
      allCachedCampaignXOwners: {},  // key == campaignXWeVoteId, value = list of owners of this campaign
      allCachedCampaignXPoliticians: {},  // key == campaignXWeVoteId, value = list of politicians supported in this Campaign
      promotedCampaignXWeVoteIds: [], // These are the campaignx_we_vote_id's of the campaigns this voter started
      voterStartedCampaignXWeVoteIds: [], // These are the campaignx_we_vote_id's of the campaigns this voter started
      voterSupportedCampaignXWeVoteIds: [], // These are the campaignx_we_vote_id's of the campaigns this voter supports
      voterWeVoteId: '',
    };
  }

  resetState () {
    return this.getInitialState();
  }

  getCampaignXByWeVoteId (campaignXWeVoteId) {
    const campaignx = this.getState().allCachedCampaignXDicts[campaignXWeVoteId];
    if (campaignx === undefined) {
      return {};
    }
    return campaignx;
  }

  getCampaignXFromListOfWeVoteIds (listOfCampaignXWeVoteIds) {
    const { allCachedCampaignXDicts } = this.getState();
    // console.log('getCampaignXFromListOfWeVoteIds listOfCampaignXWeVoteIds: ', listOfCampaignXWeVoteIds);
    // make sure that listOfCampaignXWeVoteIds has unique values
    const uniqListOfCampaignXWeVoteIds = listOfCampaignXWeVoteIds.filter((value, index, self) => self.indexOf(value) === index);

    const campaignXList = [];
    let campaignX;
    uniqListOfCampaignXWeVoteIds.forEach((campaignXWeVoteId) => {
      if (allCachedCampaignXDicts[campaignXWeVoteId]) {
        campaignX = allCachedCampaignXDicts[campaignXWeVoteId];
        campaignXList.push(campaignX);
      }
    });
    // console.log('getCampaignXFromListOfWeVoteIds campaignXList: ', campaignXList);

    return campaignXList;
  }

  getPromotedCampaignXDicts () {
    return this.getCampaignXFromListOfWeVoteIds(this.getState().promotedCampaignXWeVoteIds);
  }

  getVoterStartedCampaignXDicts () {
    return this.getCampaignXFromListOfWeVoteIds(this.getState().voterStartedCampaignXWeVoteIds);
  }

  reduce (state, action) {
    const { allCachedCampaignXDicts } = state;
    let { promotedCampaignXWeVoteIds, voterStartedCampaignXWeVoteIds } = state;
    let campaignXList;
    let revisedState;
    switch (action.type) {
      case 'campaignListRetrieve':
        if (!action.res || !action.res.success) return state;
        revisedState = state;

        campaignXList = action.res.campaignx_list || [];

        if (action.res.promoted_campaignx_we_vote_ids) {
          promotedCampaignXWeVoteIds = action.res.promoted_campaignx_we_vote_ids;
          revisedState = { ...revisedState, promotedCampaignXWeVoteIds };
        }
        if (action.res.voter_started_campaignx_we_vote_ids) {
          voterStartedCampaignXWeVoteIds = action.res.voter_started_campaignx_we_vote_ids;
          revisedState = { ...revisedState, voterStartedCampaignXWeVoteIds };
        }

        // console.log('action.res.voter_issues_only:', action.res.voter_issues_only);
        campaignXList.forEach((campaignx) => {
          allCachedCampaignXDicts[campaignx.campaignx_we_vote_id] = campaignx;
        });
        revisedState = { ...revisedState, allCachedCampaignXDicts };
        return revisedState;

      case 'campaignRetrieve':
        // console.log('CampaignStore campaignRetrieve');
        return {
          ...state,
          campaignDescription: action.res.campaign_description,
          campaignPhotoLargeUrl: action.res.we_vote_hosted_campaign_photo_large_url,
          campaignPoliticianList: action.res.campaignx_politician_list,
          campaignTitle: action.res.campaign_title,
          campaignXOwnerList: action.res.campaignx_owner_list,
          campaignXWeVoteId: action.res.campaignx_we_vote_id,
        };

      default:
        return state;
    }
  }
}

export default new CampaignStore(Dispatcher);
