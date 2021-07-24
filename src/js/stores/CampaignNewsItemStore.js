import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';

class CampaignNewsItemStore extends ReduceStore {
  getInitialState () {
    return {
      campaignNewsItemSubjectQueuedToSave: '',
      campaignNewsItemSubjectQueuedToSaveSet: false,
      campaignNewsItemTextQueuedToSave: '',
      campaignNewsItemTextQueuedToSaveSet: false,
    };
  }

  resetState () {
    return this.getInitialState();
  }

  getCampaignNewsItemSubjectQueuedToSave () {
    return this.getState().campaignNewsItemSubjectQueuedToSave;
  }

  getCampaignNewsItemSubjectQueuedToSaveSet () {
    return this.getState().campaignNewsItemSubjectQueuedToSaveSet;
  }

  getCampaignNewsItemTextQueuedToSave () {
    return this.getState().campaignNewsItemTextQueuedToSave;
  }

  getCampaignNewsItemTextQueuedToSaveSet () {
    return this.getState().campaignNewsItemTextQueuedToSaveSet;
  }

  reduce (state, action) {
    switch (action.type) {
      case 'campaignNewsItemSubjectQueuedToSave':
        // console.log('CampaignNewsItemStore campaignNewsItemSubjectQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            campaignNewsItemSubjectQueuedToSave: '',
            campaignNewsItemSubjectQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            campaignNewsItemSubjectQueuedToSave: action.payload,
            campaignNewsItemSubjectQueuedToSaveSet: true,
          };
        }

      case 'campaignNewsItemTextQueuedToSave':
        // console.log('CampaignNewsItemStore campaignNewsItemTextQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            campaignNewsItemTextQueuedToSave: '',
            campaignNewsItemTextQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            campaignNewsItemTextQueuedToSave: action.payload,
            campaignNewsItemTextQueuedToSaveSet: true,
          };
        }

      case 'voterSignOut':
        // console.log("resetting Campaign");
        // console.log('CampaignNewsItemStore voterSignOut, state:', state);
        return this.resetState();

      default:
        return state;
    }
  }
}

export default new CampaignNewsItemStore(Dispatcher);
