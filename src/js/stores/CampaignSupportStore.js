import { ReduceStore } from 'flux/utils';
import Dispatcher from '../components/Dispatcher/Dispatcher';

class CampaignSupportStore extends ReduceStore {
  getInitialState () {
    return {
      supportEndorsement: '',
      supportEndorsementQueuedToSave: '',
      supportEndorsementQueuedToSaveSet: false,
      campaignXWeVoteId: '',
      voterSignedInWithEmail: false,
    };
  }

  resetState () {
    return this.getInitialState();
  }

  supportEndorsementExists () {
    if (this.getState().supportEndorsement) {
      return Boolean(this.getState().supportEndorsement.length > 10);
    } else {
      return false;
    }
  }

  getSupportEndorsement () {
    return this.getState().supportEndorsement || '';
  }

  getSupportEndorsementQueuedToSave () {
    return this.getState().supportEndorsementQueuedToSave;
  }

  getSupportEndorsementQueuedToSaveSet () {
    return this.getState().supportEndorsementQueuedToSaveSet;
  }

  getVoterSignedInWithEmail () {
    return this.getState().voterSignedInWithEmail || false;
  }

  reduce (state, action) {
    switch (action.type) {
      case 'supportEndorsementQueuedToSave':
        // console.log('CampaignSupportStore supportEndorsementQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            supportEndorsementQueuedToSave: '',
            supportEndorsementQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            supportEndorsementQueuedToSave: action.payload,
            supportEndorsementQueuedToSaveSet: true,
          };
        }

      case 'campaignSupportSave':
        // console.log('CampaignSupportStore campaignSupportSave');
        return {
          ...state,
          supportEndorsement: action.res.support_endorsement,
          campaignXWeVoteId: action.res.campaignx_we_vote_id,
          voterSignedInWithEmail: action.res.voter_signed_in_with_email,
        };

      default:
        return state;
    }
  }
}

export default new CampaignSupportStore(Dispatcher);
