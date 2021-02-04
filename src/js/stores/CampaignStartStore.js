import { ReduceStore } from 'flux/utils';
import Dispatcher from '../components/Dispatcher/Dispatcher';

class CampaignStartStore extends ReduceStore {
  getInitialState () {
    return {
      campaignTitle: '',
      campaignTitleQueuedToSave: '',
    };
  }

  resetState () {
    return this.getInitialState();
  }

  getCampaignTitle () {
    return this.getState().campaignTitle || '';
  }

  getCampaignTitleQueuedToSave () {
    return this.getState().campaignTitleQueuedToSave;
  }

  reduce (state, action) {
    switch (action.type) {
      case 'campaignStartSave':
        // console.log('CampaignStartStore campaignStartSave');
        return {
          ...state,
          campaignTitle: action.res.campaign_title,
        };

      case 'campaignTitleQueuedToSave':
        return { ...state, campaignTitleQueuedToSave: action.payload };

      default:
        return state;
    }
  }
}

export default new CampaignStartStore(Dispatcher);
