import { ReduceStore } from 'flux/utils';
import Dispatcher from '../components/Dispatcher/Dispatcher';

class CampaignStore extends ReduceStore {
  getInitialState () {
    return {
      allCachedCampaignXDicts: {},  // key == campaignXWeVoteId, value = campaignX data dict
      allCachedCampaignXOwners: {},  // key == campaignXWeVoteId, value = list of owners of this campaign
      allCachedCampaignXPoliticians: {},  // key == campaignXWeVoteId, value = list of politicians supported in this Campaign
      allCachedCampaignXWeVoteIdsBySEOFriendlyPath: {},  // key == SEOFriendlyPath, value = campaignXWeVoteId
      promotedCampaignXWeVoteIds: [], // These are the campaignx_we_vote_id's of the campaigns this voter started
      voterStartedCampaignXWeVoteIds: [], // These are the campaignx_we_vote_id's of the campaigns this voter started
      voterSupportedCampaignXWeVoteIds: [], // These are the campaignx_we_vote_id's of the campaigns this voter supports
      voterWeVoteId: '',
    };
  }

  resetState () {
    return this.getInitialState();
  }

  getCampaignXBySEOFriendlyPath (SEOFriendlyPath) {
    const campaignXWeVoteId = this.getState().allCachedCampaignXWeVoteIdsBySEOFriendlyPath[SEOFriendlyPath] || '';
    const campaignX = this.getState().allCachedCampaignXDicts[campaignXWeVoteId];
    // console.log('CampaignStore getCampaignXBySEOFriendlyPath SEOFriendlyPath:', SEOFriendlyPath, ', campaignXWeVoteId:', campaignXWeVoteId, ', campaignX:', campaignX);
    if (campaignX === undefined) {
      return {};
    }
    return campaignX;
  }

  getCampaignXByWeVoteId (campaignXWeVoteId) {
    const campaignX = this.getState().allCachedCampaignXDicts[campaignXWeVoteId];
    if (campaignX === undefined) {
      return {};
    }
    return campaignX;
  }

  getCampaignXWeVoteIdFromCampaignSEOFriendlyPath (SEOFriendlyPath) {
    return this.getState().allCachedCampaignXWeVoteIdsBySEOFriendlyPath[SEOFriendlyPath] || '';
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
    const { allCachedCampaignXDicts, allCachedCampaignXWeVoteIdsBySEOFriendlyPath } = state;
    let { promotedCampaignXWeVoteIds, voterStartedCampaignXWeVoteIds } = state;
    let campaignX;
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
        campaignXList.forEach((oneCampaignX) => {
          allCachedCampaignXDicts[oneCampaignX.campaignx_we_vote_id] = oneCampaignX;
          if (!(oneCampaignX.seo_friendly_path in allCachedCampaignXWeVoteIdsBySEOFriendlyPath)) {
            allCachedCampaignXWeVoteIdsBySEOFriendlyPath[oneCampaignX.seo_friendly_path] = oneCampaignX.campaignx_we_vote_id;
          }
          if ('seo_friendly_path_list' in oneCampaignX) {
            //
            let onePath = '';
            for (let i = 0; i < oneCampaignX.seo_friendly_path_list.length; ++i) {
              onePath = oneCampaignX.seo_friendly_path_list[i];
              if (onePath && onePath !== '') {
                if (!(onePath in allCachedCampaignXWeVoteIdsBySEOFriendlyPath)) {
                  allCachedCampaignXWeVoteIdsBySEOFriendlyPath[onePath] = oneCampaignX.campaignx_we_vote_id;
                }
              }
            }
          }
        });
        // console.log('allCachedCampaignXWeVoteIdsBySEOFriendlyPath:', allCachedCampaignXWeVoteIdsBySEOFriendlyPath);
        revisedState = { ...revisedState, allCachedCampaignXDicts };
        revisedState = { ...revisedState, allCachedCampaignXWeVoteIdsBySEOFriendlyPath };
        return revisedState;

      case 'campaignRetrieve':
        if (!action.res || !action.res.success) return state;
        revisedState = state;
        // console.log('CampaignStore campaignRetrieve');
        campaignX = action.res;
        allCachedCampaignXDicts[campaignX.campaignx_we_vote_id] = campaignX;
        if (!(campaignX.seo_friendly_path in allCachedCampaignXWeVoteIdsBySEOFriendlyPath)) {
          allCachedCampaignXWeVoteIdsBySEOFriendlyPath[campaignX.seo_friendly_path] = campaignX.campaignx_we_vote_id;
        }
        if ('seo_friendly_path_list' in campaignX) {
          //
          let onePath = '';
          for (let i = 0; i < campaignX.seo_friendly_path_list.length; ++i) {
            onePath = campaignX.seo_friendly_path_list[i];
            if (onePath && onePath !== '') {
              if (!(onePath in allCachedCampaignXWeVoteIdsBySEOFriendlyPath)) {
                allCachedCampaignXWeVoteIdsBySEOFriendlyPath[onePath] = campaignX.campaignx_we_vote_id;
              }
            }
          }
        }
        revisedState = { ...revisedState, allCachedCampaignXDicts };
        revisedState = { ...revisedState, allCachedCampaignXWeVoteIdsBySEOFriendlyPath };
        return revisedState;

      case 'voterSignOut':
        // TODO: We will need to call resetVoterSpecificData in this store
        console.log('CampaignStore voterSignOut, state:', state);
        // return this.resetState();
        return state;

      default:
        return state;
    }
  }
}

export default new CampaignStore(Dispatcher);
