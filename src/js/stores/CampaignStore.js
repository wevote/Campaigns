import { ReduceStore } from 'flux/utils';
import Dispatcher from '../components/Dispatcher/Dispatcher';
import anonymous from '../../img/global/icons/avatar-generic.png';

class CampaignStore extends ReduceStore {
  getInitialState () {
    return {
      allCachedCampaignXDicts: {},  // key == campaignXWeVoteId, value = campaignX data dict
      allCachedCampaignXOwners: {},  // key == campaignXWeVoteId, value = list of owners of this campaign
      allCachedCampaignXProfilePhotos: {},  // key == campaignXWeVoteId, value = Tiny Profile Photo to show
      allCachedCampaignXPoliticianLists: {},  // key == campaignXWeVoteId, value = list of politicians supported in this Campaign
      allCachedCampaignXWeVoteIdsBySEOFriendlyPath: {},  // key == SEOFriendlyPath, value = campaignXWeVoteId
      allCachedPoliticians: {},  // key == politicianWeVoteId, value = the Politician
      promotedCampaignXWeVoteIds: [], // These are the campaignx_we_vote_id's of the campaigns this voter started
      voterStartedCampaignXWeVoteIds: [], // These are the campaignx_we_vote_id's of the campaigns this voter started
      voterSupportedCampaignXWeVoteIds: [], // These are the campaignx_we_vote_id's of the campaigns this voter supports
      voterWeVoteId: '',
    };
  }

  resetState () {
    return this.getInitialState();
  }

  extractCampaignXOwnerList (campaignX, allCachedCampaignXOwnersIncoming, allCachedCampaignXProfilePhotosIncoming) {
    const allCachedCampaignXOwners = allCachedCampaignXOwnersIncoming;
    const allCachedCampaignXProfilePhotos = allCachedCampaignXProfilePhotosIncoming;
    const campaignXOwnersFiltered = [];
    let featuredProfileImageFound = false;
    let firstProfileImageFound = false;
    let useThisProfileImage = false;
    for (let i = 0; i < campaignX.campaignx_owner_list.length; ++i) {
      // console.log('CampaignStore owner_list i: ', i, ', one_owner: ', campaignX.campaignx_owner_list[i]);
      if (campaignX.campaignx_owner_list[i].visible_to_public) {
        if (campaignX.campaignx_owner_list[i].organization_name) {
          campaignXOwnersFiltered.push(campaignX.campaignx_owner_list[i]);
        }
        if (campaignX.campaignx_owner_list[i].we_vote_hosted_profile_image_url_tiny) {
          if (campaignX.campaignx_owner_list[i].feature_this_profile_image) {
            if (!featuredProfileImageFound) {
              // Always use the first profile image found which is featured
              useThisProfileImage = true;
            }
            featuredProfileImageFound = true;
            firstProfileImageFound = true;
          }
          if (!featuredProfileImageFound && !firstProfileImageFound) {
            // Use this image if it is the first image found and a featured image hasn't already been found
            useThisProfileImage = true;
          }
          if (useThisProfileImage) {
            allCachedCampaignXProfilePhotos[campaignX.campaignx_we_vote_id] = campaignX.campaignx_owner_list[i].we_vote_hosted_profile_image_url_tiny;
          }
        }
      }
    }
    allCachedCampaignXOwners[campaignX.campaignx_we_vote_id] = campaignXOwnersFiltered;

    return {
      allCachedCampaignXOwners,
      allCachedCampaignXProfilePhotos,
    };
  }

  extractCampaignXPoliticianList (campaignX, allCachedCampaignXPoliticianListsIncoming) {
    const allCachedCampaignXPoliticianLists = allCachedCampaignXPoliticianListsIncoming;
    const campaignXPoliticianListFiltered = [];
    for (let i = 0; i < campaignX.campaignx_politician_list.length; ++i) {
      // console.log('CampaignStore owner_list i: ', i, ', one_owner: ', campaignX.campaignx_politician_list[i]);
      if (campaignX.campaignx_politician_list[i].politician_name) {
        campaignXPoliticianListFiltered.push(campaignX.campaignx_politician_list[i]);
      }
    }
    allCachedCampaignXPoliticianLists[campaignX.campaignx_we_vote_id] = campaignXPoliticianListFiltered;

    return {
      allCachedCampaignXPoliticianLists,
    };
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

  getCampaignXOwnerList (campaignXWeVoteId) {
    return this.getState().allCachedCampaignXOwners[campaignXWeVoteId] || [];
  }

  getCampaignXLeadOwnerProfilePhoto (campaignXWeVoteId) {
    return this.getState().allCachedCampaignXProfilePhotos[campaignXWeVoteId] || anonymous;
  }

  getCampaignXPoliticianList (campaignXWeVoteId) {
    return this.getState().allCachedCampaignXPoliticianLists[campaignXWeVoteId] || [];
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
    let {
      allCachedCampaignXOwners, allCachedCampaignXPoliticianLists, allCachedCampaignXProfilePhotos,
      promotedCampaignXWeVoteIds, voterStartedCampaignXWeVoteIds,
    } = state;
    let campaignX;
    let campaignXList;
    let revisedState;
    switch (action.type) {
      case 'campaignListRetrieve':
        // See CampaignSupporterStore for the following campaignX values:
        // - latest_campaignx_supporter_endorsement_list
        // - latest_campaignx_supporter_list
        // - voter_campaignx_supporter

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
          if ('campaignx_owner_list' in campaignX) {
            ({ allCachedCampaignXOwners, allCachedCampaignXProfilePhotos } = this.extractCampaignXOwnerList(campaignX, allCachedCampaignXOwners, allCachedCampaignXProfilePhotos));
          }
          if ('campaignx_politician_list' in campaignX) {
            ({ allCachedCampaignXPoliticianLists } = this.extractCampaignXPoliticianList(campaignX, allCachedCampaignXPoliticianLists));
          }
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
        revisedState = { ...revisedState, allCachedCampaignXOwners };
        revisedState = { ...revisedState, allCachedCampaignXPoliticianLists };
        revisedState = { ...revisedState, allCachedCampaignXProfilePhotos };
        revisedState = { ...revisedState, allCachedCampaignXWeVoteIdsBySEOFriendlyPath };
        return revisedState;

      case 'campaignRetrieve':
        // See CampaignSupporterStore for the following campaignX values:
        // - latest_campaignx_supporter_endorsement_list
        // - latest_campaignx_supporter_list
        // - voter_campaignx_supporter

        if (!action.res || !action.res.success) return state;
        revisedState = state;
        campaignX = action.res;
        // console.log('CampaignStore campaignRetrieve, campaignX:', campaignX);
        allCachedCampaignXDicts[campaignX.campaignx_we_vote_id] = campaignX;
        if ('campaignx_owner_list' in campaignX) {
          ({ allCachedCampaignXOwners, allCachedCampaignXProfilePhotos } = this.extractCampaignXOwnerList(campaignX, allCachedCampaignXOwners, allCachedCampaignXProfilePhotos));
        }
        if ('campaignx_politician_list' in campaignX) {
          ({ allCachedCampaignXPoliticianLists } = this.extractCampaignXPoliticianList(campaignX, allCachedCampaignXPoliticianLists));
        }
        if (!(campaignX.seo_friendly_path in allCachedCampaignXWeVoteIdsBySEOFriendlyPath)) {
          allCachedCampaignXWeVoteIdsBySEOFriendlyPath[campaignX.seo_friendly_path] = campaignX.campaignx_we_vote_id;
        }
        // console.log('CampaignStore allCachedCampaignXOwners:', allCachedCampaignXOwners);
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
        revisedState = { ...revisedState, allCachedCampaignXOwners };
        revisedState = { ...revisedState, allCachedCampaignXPoliticianLists };
        revisedState = { ...revisedState, allCachedCampaignXProfilePhotos };
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
