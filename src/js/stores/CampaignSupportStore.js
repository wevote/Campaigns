import { ReduceStore } from 'flux/utils';
import Dispatcher from '../components/Dispatcher/Dispatcher';

class CampaignSupportStore extends ReduceStore {
  getInitialState () {
    return {
      campaignXWeVoteId: '',
      supporterEndorsement: '',
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

  supporterEndorsementExists () {
    if (this.getState().supporterEndorsement) {
      return Boolean(this.getState().supporterEndorsement.length > 10);
    } else {
      return false;
    }
  }

  getSupporterEndorsement () {
    return this.getState().supporterEndorsement || '';
  }

  getSupporterEndorsementQueuedToSave () {
    return this.getState().supporterEndorsementQueuedToSave;
  }

  getSupporterEndorsementQueuedToSaveSet () {
    return this.getState().supporterEndorsementQueuedToSaveSet;
  }

  getVisibleToPublic () {
    return Boolean(this.getState().visibleToPublic);
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
    switch (action.type) {
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

      case 'campaignSupporterSave':
        // console.log('CampaignSupportStore campaignSupporterSave');
        return {
          ...state,
          supporterEndorsement: action.res.support_endorsement,
          campaignXWeVoteId: action.res.campaignx_we_vote_id,
          visibleToPublic: Boolean(action.res.visible_to_public),
          voterSignedInWithEmail: Boolean(action.res.voter_signed_in_with_email),
        };

      default:
        return state;
    }
  }
}

export default new CampaignSupportStore(Dispatcher);
