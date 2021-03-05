import CampaignActions from '../actions/CampaignActions';
import CampaignStore from '../stores/CampaignStore';
import initializejQuery from './initializejQuery';

export function getCampaignXValuesFromIdentifiers (campaignSEOFriendlyPath, campaignXWeVoteId) {
  // console.log('onCampaignStoreChange campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
  let campaignX = {};
  let campaignDescription = '';
  let campaignPhoto = '';
  let campaignTitle = '';
  let campaignSEOFriendlyPathFromObject = '';
  let campaignXWeVoteIdFromObject = '';
  if (campaignSEOFriendlyPath) {
    campaignX = CampaignStore.getCampaignXBySEOFriendlyPath(campaignSEOFriendlyPath);
  } else if (campaignXWeVoteId) {
    campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
    ({ seo_friendly_path: campaignSEOFriendlyPathFromObject } = campaignX);
  }
  if (campaignX.constructor === Object && campaignX.campaignx_we_vote_id) {
    ({
      campaign_description: campaignDescription,
      campaign_title: campaignTitle,
      campaignx_we_vote_id: campaignXWeVoteIdFromObject,
      we_vote_hosted_campaign_photo_large_url: campaignPhoto,
    } = campaignX);
  }
  return {
    campaignDescription,
    campaignPhoto,
    campaignSEOFriendlyPath: campaignSEOFriendlyPathFromObject,
    campaignTitle,
    campaignXWeVoteId: campaignXWeVoteIdFromObject,
  };
}

export function retrieveCampaignXFromIdentifiersIfNeeded (campaignSEOFriendlyPath, campaignXWeVoteId) {
  // console.log('retrieveCampaignXFromIdentifiersIfNeeded campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
  let campaignX = {};
  let mustRetrieveCampaign = false;
  if (campaignSEOFriendlyPath) {
    campaignX = CampaignStore.getCampaignXBySEOFriendlyPath(campaignSEOFriendlyPath);
    // console.log('retrieveCampaignXFromIdentifiersIfNeeded campaignX:', campaignX);
    if (campaignX.constructor === Object) {
      if (!campaignX.campaignx_we_vote_id) {
        mustRetrieveCampaign = true;
      }
    } else {
      mustRetrieveCampaign = true;
    }
    if (mustRetrieveCampaign) {
      initializejQuery(() => {
        CampaignActions.campaignRetrieveBySEOFriendlyPath(campaignSEOFriendlyPath);
      });
    }
  } else if (campaignXWeVoteId) {
    campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
    if (campaignX.constructor === Object) {
      if (!campaignX.campaignx_we_vote_id) {
        mustRetrieveCampaign = true;
      }
    } else {
      mustRetrieveCampaign = true;
    }
    if (mustRetrieveCampaign) {
      initializejQuery(() => {
        CampaignActions.campaignRetrieve(campaignXWeVoteId);
      });
    }
  }
}
