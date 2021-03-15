import { ReduceStore } from 'flux/utils';
import Dispatcher from '../components/Dispatcher/Dispatcher';

class CampaignSupportStore extends ReduceStore {
  getInitialState () {
    return {
      allCachedCampaignXSupporterVoterEntries: {}, // Dictionary with campaignx_we_vote_id as key and the CampaignXSupporter for this voter as value
      supporterEndorsementQueuedToSave: '',
      supporterEndorsementQueuedToSaveSet: false,
      visibleToPublic: true, // Default setting
      visibleToPublicQueuedToSave: true, // Default setting
      visibleToPublicQueuedToSaveSet: false,
      voterSignedInWithEmail: false,
    };
  }

  resetState () {
    return this.getInitialState();
  }

  supporterEndorsementExists (campaignXWeVoteId) {
    if (campaignXWeVoteId) {
      const campaignXSupporterVoterEntry = this.getCampaignXSupporterVoterEntry(campaignXWeVoteId);
      // console.log('supporterEndorsementExists, campaignXSupporterVoterEntry:', campaignXSupporterVoterEntry);
      if ('supporter_endorsement' in campaignXSupporterVoterEntry && campaignXSupporterVoterEntry.supporter_endorsement) {
        return Boolean(campaignXSupporterVoterEntry.supporter_endorsement.length > 0);
      }
    }
    return false;
  }

  getCampaignXSupporterVoterEntry (campaignXWeVoteId) {
    return this.getState().allCachedCampaignXSupporterVoterEntries[campaignXWeVoteId] || {};
  }

  getSupporterEndorsementQueuedToSave () {
    return this.getState().supporterEndorsementQueuedToSave;
  }

  getSupporterEndorsementQueuedToSaveSet () {
    return this.getState().supporterEndorsementQueuedToSaveSet;
  }

  getVisibleToPublic (campaignXWeVoteId) {
    if (campaignXWeVoteId) {
      const campaignXSupporterVoterEntry = this.getCampaignXSupporterVoterEntry(campaignXWeVoteId);
      // console.log('supporterEndorsementExists, campaignXSupporterVoterEntry:', campaignXSupporterVoterEntry);
      if ('visible_to_public' in campaignXSupporterVoterEntry) {
        return Boolean(campaignXSupporterVoterEntry.visible_to_public);
      }
    }
    return true;
  }

  getVisibleToPublicQueuedToSave () {
    return Boolean(this.getState().visibleToPublicQueuedToSave);
  }

  getVisibleToPublicQueuedToSaveSet () {
    return this.getState().visibleToPublicQueuedToSaveSet;
  }

  getVoterSignedInWithEmail () {
    return this.getState().voterSignedInWithEmail || false;
  }

  reduce (state, action) {
    const { allCachedCampaignXSupporterVoterEntries } = state;
    let campaignXList;
    let revisedState;
    switch (action.type) {
      case 'campaignListRetrieve':
        // console.log('CampaignSupportStore campaignListRetrieve');
        if (!action.res || !action.res.success) return state;
        revisedState = state;
        campaignXList = action.res.campaignx_list || [];
        campaignXList.forEach((oneCampaignX) => {
          // if (!(oneCampaignX.seo_friendly_path in allCachedCampaignXWeVoteIdsBySEOFriendlyPath)) {
          //   allCachedCampaignXWeVoteIdsBySEOFriendlyPath[oneCampaignX.seo_friendly_path] = oneCampaignX.campaignx_we_vote_id;
          // }
          if ('voter_campaignx_supporter' in oneCampaignX) {
            if ('campaignx_we_vote_id' in oneCampaignX.voter_campaignx_supporter) {
              allCachedCampaignXSupporterVoterEntries[oneCampaignX.campaignx_we_vote_id] = oneCampaignX.voter_campaignx_supporter;
            }
          }
        });
        // console.log('allCachedCampaignXWeVoteIdsBySEOFriendlyPath:', allCachedCampaignXWeVoteIdsBySEOFriendlyPath);
        // console.log('allCachedCampaignXSupporterVoterEntries:', allCachedCampaignXSupporterVoterEntries);
        revisedState = { ...revisedState, allCachedCampaignXSupporterVoterEntries };
        return revisedState;

      case 'campaignRetrieve':
        // console.log('CampaignSupportStore campaignRetrieve action.res:', action.res);
        if (!action.res || !action.res.success) return state;
        revisedState = state;
        if (action.res.campaignx_we_vote_id) {
          if ('voter_campaignx_supporter' in action.res) {
            if ('campaignx_we_vote_id' in action.res.voter_campaignx_supporter) {
              allCachedCampaignXSupporterVoterEntries[action.res.campaignx_we_vote_id] = action.res.voter_campaignx_supporter;
            }
          }
        }
        // console.log('allCachedCampaignXSupporterVoterEntries:', allCachedCampaignXSupporterVoterEntries);
        revisedState = { ...revisedState, allCachedCampaignXSupporterVoterEntries };
        return revisedState;

      case 'campaignSupporterSave':
        // console.log('CampaignSupportStore campaignSupporterSave');
        if (action.res.campaignx_we_vote_id && action.res.success) {
          allCachedCampaignXSupporterVoterEntries[action.res.campaignx_we_vote_id] = action.res;
        }
        // console.log('allCachedCampaignXSupporterVoterEntries:', allCachedCampaignXSupporterVoterEntries);
        return {
          ...state,
          allCachedCampaignXSupporterVoterEntries,
          voterSignedInWithEmail: Boolean(action.res.voter_signed_in_with_email),
        };

      case 'supporterEndorsementQueuedToSave':
        // console.log('CampaignSupportStore supporterEndorsementQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            supporterEndorsementQueuedToSave: '',
            supporterEndorsementQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            supporterEndorsementQueuedToSave: action.payload,
            supporterEndorsementQueuedToSaveSet: true,
          };
        }

      case 'visibleToPublicQueuedToSave':
        // console.log('CampaignSupportStore visibleToPublicQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            visibleToPublicQueuedToSave: true,
            visibleToPublicQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            visibleToPublicQueuedToSave: Boolean(action.payload),
            visibleToPublicQueuedToSaveSet: true,
          };
        }

      case 'voterSignOut':
        // console.log("resetting Campaign");
        return this.resetState();

      default:
        return state;
    }
  }
}

export default new CampaignSupportStore(Dispatcher);
