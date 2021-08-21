import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import TruncateMarkup from 'react-truncate-markup';
import { withStyles } from '@material-ui/core/styles';
import AppStore from '../../stores/AppStore';
import {
  BlockedIndicator, DraftModeIndicator, EditIndicator, ElectionInPast,
  IndicatorButtonWrapper, IndicatorDefaultButtonWrapper, IndicatorRow,
} from '../Style/CampaignIndicatorStyles';
import CampaignOwnersList from '../CampaignSupport/CampaignOwnersList';
import CampaignStore from '../../stores/CampaignStore';
import CampaignSupporterActions from '../../actions/CampaignSupporterActions';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import { renderLog } from '../../utils/logging';
import { historyPush, isCordova } from '../../utils/cordovaUtils';
import initializejQuery from '../../utils/initializejQuery';
import keepHelpingDestination from '../../utils/keepHelpingDestination';
import { numberWithCommas } from '../../utils/textFormat';

const SupportButtonBeforeCompletionScreen = React.lazy(() => import('../CampaignSupport/SupportButtonBeforeCompletionScreen'));

class CampaignCardForList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignX: {},
      inPrivateLabelMode: false,
      payToPromoteStepCompleted: false,
      payToPromoteStepTurnedOn: false,
      sharingStepCompleted: false,
      step2Completed: false,
    };
    this.functionToUseToKeepHelping = this.functionToUseToKeepHelping.bind(this);
    this.functionToUseWhenProfileComplete = this.functionToUseWhenProfileComplete.bind(this);
    this.getCampaignBasePath = this.getCampaignBasePath.bind(this);
    this.goToNextPage = this.goToNextPage.bind(this);
    this.onCampaignClick = this.onCampaignClick.bind(this);
    this.onCampaignEditClick = this.onCampaignEditClick.bind(this);
    this.onCampaignGetMinimumSupportersClick = this.onCampaignGetMinimumSupportersClick.bind(this);
    this.pullCampaignXSupporterVoterEntry = this.pullCampaignXSupporterVoterEntry.bind(this);
  }

  componentDidMount () {
    // console.log('CampaignCardForList componentDidMount');
    this.onAppStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.onCampaignSupporterStoreChange();
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('CampaignCardForList componentDidUpdate');
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignStoreChange();
        this.onCampaignSupporterStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
    this.campaignStoreListener.remove();
    this.campaignSupporterStoreListener.remove();
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  onAppStoreChange () {
    const inPrivateLabelMode = AppStore.inPrivateLabelMode();
    // const siteConfigurationHasBeenRetrieved = AppStore.siteConfigurationHasBeenRetrieved();
    // For now, we assume that paid sites with chosenSiteLogoUrl will turn off "Chip in"
    const payToPromoteStepTurnedOn = !inPrivateLabelMode;
    this.setState({
      inPrivateLabelMode,
      payToPromoteStepTurnedOn,
      // siteConfigurationHasBeenRetrieved,
    });
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
    const voterCanEditThisCampaign = CampaignStore.getVoterCanEditThisCampaign(campaignXWeVoteId);
    const {
      seo_friendly_path: campaignSEOFriendlyPath,
    } = campaignX;
    let pathToUseWhenProfileComplete;
    if (campaignSEOFriendlyPath) {
      pathToUseWhenProfileComplete = `/c/${campaignSEOFriendlyPath}/why-do-you-support`;
    } else if (campaignXWeVoteId) {
      pathToUseWhenProfileComplete = `/id/${campaignXWeVoteId}/why-do-you-support`;
    }
    this.setState({
      campaignX,
      pathToUseWhenProfileComplete,
      voterCanEditThisCampaign,
    });
  }

  onCampaignSupporterStoreChange () {
    const {
      campaignXWeVoteId,
    } = this.props;
    // console.log('CampaignCardForList onCampaignSupporterStoreChange campaignXWeVoteId:', campaignXWeVoteId, ', campaignSEOFriendlyPath:', campaignSEOFriendlyPath);
    if (campaignXWeVoteId) {
      this.pullCampaignXSupporterVoterEntry(campaignXWeVoteId);
    }
  }

  onCampaignClick () {
    const { campaignX } = this.state;
    // console.log('campaignX:', campaignX);
    if (!campaignX) {
      return null;
    }
    const {
      in_draft_mode: inDraftMode,
      seo_friendly_path: campaignSEOFriendlyPath,
      campaignx_we_vote_id: campaignXWeVoteId,
    } = campaignX;
    if (inDraftMode) {
      historyPush('/start-a-campaign-preview');
    } else if (campaignSEOFriendlyPath) {
      historyPush(`/c/${campaignSEOFriendlyPath}`);
    } else {
      historyPush(`/id/${campaignXWeVoteId}`);
    }
    return null;
  }

  onCampaignEditClick () {
    const { campaignX } = this.state;
    // console.log('campaignX:', campaignX);
    if (!campaignX) {
      return null;
    }
    const {
      in_draft_mode: inDraftMode,
      seo_friendly_path: campaignSEOFriendlyPath,
      campaignx_we_vote_id: campaignXWeVoteId,
    } = campaignX;
    if (inDraftMode) {
      historyPush('/start-a-campaign-preview');
    } else if (campaignSEOFriendlyPath) {
      historyPush(`/c/${campaignSEOFriendlyPath}/edit`);
    } else {
      historyPush(`/id/${campaignXWeVoteId}/edit`);
    }
    return null;
  }

  onCampaignGetMinimumSupportersClick () {
    const { campaignX } = this.state;
    // console.log('campaignX:', campaignX);
    if (!campaignX) {
      return null;
    }
    const {
      seo_friendly_path: campaignSEOFriendlyPath,
      campaignx_we_vote_id: campaignXWeVoteId,
    } = campaignX;
    if (campaignSEOFriendlyPath) {
      historyPush(`/c/${campaignSEOFriendlyPath}/share-campaign`);
    } else {
      historyPush(`/id/${campaignXWeVoteId}/share-campaign`);
    }
    return null;
  }

  getCampaignBasePath () {
    const { campaignX } = this.state;
    // console.log('campaignX:', campaignX);
    if (!campaignX) {
      return null;
    }
    const {
      seo_friendly_path: campaignSEOFriendlyPath,
      campaignx_we_vote_id: campaignXWeVoteId,
    } = campaignX;
    let campaignBasePath;
    if (campaignSEOFriendlyPath) {
      campaignBasePath = `/c/${campaignSEOFriendlyPath}`;
    } else {
      campaignBasePath = `/id/${campaignXWeVoteId}`;
    }

    return campaignBasePath;
  }

  pullCampaignXSupporterVoterEntry (campaignXWeVoteId) {
    // console.log('pullCampaignXSupporterVoterEntry campaignXWeVoteId:', campaignXWeVoteId);
    if (campaignXWeVoteId) {
      const campaignXSupporterVoterEntry = CampaignSupporterStore.getCampaignXSupporterVoterEntry(campaignXWeVoteId);
      // console.log('onCampaignSupporterStoreChange campaignXSupporterVoterEntry:', campaignXSupporterVoterEntry);
      const {
        campaign_supported: campaignSupported,
        campaignx_we_vote_id: campaignXWeVoteIdFromCampaignXSupporter,
      } = campaignXSupporterVoterEntry;
      // console.log('onCampaignSupporterStoreChange campaignSupported: ', campaignSupported);
      if (campaignXWeVoteIdFromCampaignXSupporter) {
        const step2Completed = CampaignSupporterStore.voterSupporterEndorsementExists(campaignXWeVoteId);
        const payToPromoteStepCompleted = CampaignSupporterStore.voterChipInExists(campaignXWeVoteId);
        const sharingStepCompleted = false;
        this.setState({
          campaignSupported,
          sharingStepCompleted,
          step2Completed,
          payToPromoteStepCompleted,
        });
      } else {
        this.setState({
          campaignSupported: false,
        });
      }
    } else {
      this.setState({
        campaignSupported: false,
      });
    }
  }

  goToNextPage () {
    const { pathToUseWhenProfileComplete } = this.state;
    this.timer = setTimeout(() => {
      historyPush(pathToUseWhenProfileComplete);
    }, 500);
  }

  functionToUseToKeepHelping () {
    const { payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, step2Completed } = this.state;
    console.log(payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, step2Completed);
    const keepHelpingDestinationString = keepHelpingDestination(step2Completed, payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted);
    console.log('functionToUseToKeepHelping keepHelpingDestinationString:', keepHelpingDestinationString);
    historyPush(`${this.getCampaignBasePath()}/${keepHelpingDestinationString}`);
  }

  functionToUseWhenProfileComplete () {
    const { campaignXWeVoteId } = this.props;
    const campaignSupported = true;
    const campaignSupportedChanged = true;
    // From this page we always send value for 'visibleToPublic'
    let visibleToPublic = CampaignSupporterStore.getVisibleToPublic();
    const visibleToPublicChanged = CampaignSupporterStore.getVisibleToPublicQueuedToSaveSet();
    if (visibleToPublicChanged) {
      // If it has changed, use new value
      visibleToPublic = CampaignSupporterStore.getVisibleToPublicQueuedToSave();
    }
    // console.log('functionToUseWhenProfileComplete, visibleToPublic:', visibleToPublic, ', visibleToPublicChanged:', visibleToPublicChanged);
    const saveVisibleToPublic = true;
    initializejQuery(() => {
      CampaignSupporterActions.supportCampaignSave(campaignXWeVoteId, campaignSupported, campaignSupportedChanged, visibleToPublic, saveVisibleToPublic);
    }, this.goToNextPage());
  }

  render () {
    renderLog('CampaignCardForList');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignCardForList window.location.href: ${window.location.href}`);
    }
    const { campaignSupported, campaignX, inPrivateLabelMode, voterCanEditThisCampaign } = this.state;
    if (!campaignX) {
      return null;
    }
    const {
      campaign_description: campaignDescription,
      campaign_title: campaignTitle,
      campaignx_we_vote_id: campaignXWeVoteId,
      final_election_date_in_past: finalElectionDateInPast,
      in_draft_mode: inDraftMode,
      is_blocked_by_we_vote: isBlockedByWeVote,
      is_in_team_review_mode: isInTeamReviewMode,
      is_supporters_count_minimum_exceeded: isSupportersCountMinimumExceeded,
      seo_friendly_path: campaignSEOFriendlyPath,
      supporters_count: supportersCount,
      supporters_count_next_goal: supportersCountNextGoal,
      visible_on_this_site: visibleOnThisSite,
      we_vote_hosted_campaign_photo_large_url: CampaignPhotoLargeUrl,
      we_vote_hosted_campaign_photo_medium_url: CampaignPhotoMediumUrl,
    } = campaignX;
    return (
      <Wrapper cordova={isCordova()}>
        <OneCampaignOuterWrapper>
          <OneCampaignInnerWrapper>
            <OneCampaignTextColumn>
              <ClickableDiv onClick={this.onCampaignClick}>
                <OneCampaignTitle>
                  {campaignTitle}
                </OneCampaignTitle>
                <OneCampaignPhotoWrapperMobile className="u-show-mobile">
                  {CampaignPhotoLargeUrl ? (
                    <CampaignImageMobile src={CampaignPhotoLargeUrl} alt="Campaign" />
                  ) : (
                    <CampaignImageMobilePlaceholder>
                      <CampaignImagePlaceholderText>
                        No image provided
                      </CampaignImagePlaceholderText>
                    </CampaignImageMobilePlaceholder>
                  )}
                </OneCampaignPhotoWrapperMobile>
                <SupportersWrapper>
                  <SupportersCount>
                    {numberWithCommas(supportersCount)}
                    {' '}
                    {supportersCount === 1 ? 'supporter.' : 'supporters.'}
                  </SupportersCount>
                  {' '}
                  {campaignSupported ? (
                    <SupportersActionLink>
                      Thank you for supporting!
                    </SupportersActionLink>
                  ) : (
                    <SupportersActionLink className="u-link-color u-link-underline">
                      Let&apos;s get to
                      {' '}
                      {numberWithCommas(supportersCountNextGoal)}
                      !
                    </SupportersActionLink>
                  )}
                </SupportersWrapper>
                <OneCampaignDescription>
                  <TruncateMarkup
                    lines={4}
                    ellipsis={(
                      <span>
                        <span className="u-text-fade-at-end">&nbsp;</span>
                        <span className="u-link-color u-link-underline">Read more</span>
                      </span>
                    )}
                  >
                    <div>
                      {campaignDescription}
                    </div>
                  </TruncateMarkup>
                </OneCampaignDescription>
                <CampaignOwnersWrapper>
                  <CampaignOwnersList campaignXWeVoteId={campaignXWeVoteId} compressedMode />
                </CampaignOwnersWrapper>
              </ClickableDiv>
              <IndicatorRow>
                {finalElectionDateInPast && (
                  <IndicatorButtonWrapper>
                    <ElectionInPast>
                      Election in Past
                    </ElectionInPast>
                  </IndicatorButtonWrapper>
                )}
                {isBlockedByWeVote && (
                  <IndicatorButtonWrapper>
                    <BlockedIndicator onClick={this.onCampaignEditClick}>
                      Blocked: Changes Needed
                    </BlockedIndicator>
                  </IndicatorButtonWrapper>
                )}
                {!!(!inDraftMode && !isSupportersCountMinimumExceeded && !inPrivateLabelMode) && (
                  <IndicatorButtonWrapper onClick={this.onCampaignGetMinimumSupportersClick}>
                    <DraftModeIndicator>
                      Needs Five Supporters
                    </DraftModeIndicator>
                  </IndicatorButtonWrapper>
                )}
              </IndicatorRow>
              <IndicatorRow>
                {inDraftMode && (
                  <IndicatorDefaultButtonWrapper onClick={this.onCampaignClick}>
                    <DraftModeIndicator>
                      Draft
                    </DraftModeIndicator>
                  </IndicatorDefaultButtonWrapper>
                )}
                {!visibleOnThisSite && (
                  <IndicatorButtonWrapper>
                    <DraftModeIndicator>
                      <span className="u-show-mobile">
                        Not Visible
                      </span>
                      <span className="u-show-desktop-tablet">
                        Not Visible On This Site
                      </span>
                    </DraftModeIndicator>
                  </IndicatorButtonWrapper>
                )}
                {isInTeamReviewMode && (
                  <IndicatorButtonWrapper>
                    <DraftModeIndicator onClick={this.onCampaignEditClick}>
                      <span className="u-show-mobile">
                        Team Reviewing
                      </span>
                      <span className="u-show-desktop-tablet">
                        Team Still Reviewing
                      </span>
                    </DraftModeIndicator>
                  </IndicatorButtonWrapper>
                )}
                {voterCanEditThisCampaign && (
                  <IndicatorButtonWrapper>
                    <EditIndicator onClick={this.onCampaignEditClick}>
                      <span className="u-show-mobile">
                        Edit
                      </span>
                      <span className="u-show-desktop-tablet">
                        Edit Campaign
                      </span>
                    </EditIndicator>
                  </IndicatorButtonWrapper>
                )}
                {!inDraftMode && (
                  <IndicatorSupportButtonWrapper>
                    <Suspense fallback={<span>&nbsp;</span>}>
                      <SupportButtonBeforeCompletionScreen
                        campaignSEOFriendlyPath={campaignSEOFriendlyPath}
                        campaignXWeVoteId={campaignXWeVoteId}
                        functionToUseToKeepHelping={this.functionToUseToKeepHelping}
                        functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
                        inCompressedMode
                      />
                    </Suspense>
                  </IndicatorSupportButtonWrapper>
                )}
              </IndicatorRow>
            </OneCampaignTextColumn>
            <OneCampaignPhotoDesktopColumn className="u-show-desktop-tablet" onClick={this.onCampaignClick}>
              {CampaignPhotoMediumUrl ? (
                <CampaignImageDesktop src={CampaignPhotoMediumUrl} alt="Campaign" width="224px" height="117px" />
              ) : (
                <CampaignImageDesktopPlaceholder>
                  <CampaignImagePlaceholderText>
                    No image provided
                  </CampaignImagePlaceholderText>
                </CampaignImageDesktopPlaceholder>
              )}
            </OneCampaignPhotoDesktopColumn>
          </OneCampaignInnerWrapper>
        </OneCampaignOuterWrapper>
      </Wrapper>
    );
  }
}
CampaignCardForList.propTypes = {
  campaignXWeVoteId: PropTypes.string,
};

const styles = (theme) => ({
  buttonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

// const BlockedIndicator = styled.span`
//   background-color: #efc2c2;
//   border-radius: 4px;
//   color: #2e3c5d;
//   cursor: pointer;
//   font-size: 14px;
//   margin-right: 10px;
//   margin-top: 10px;
//   padding: 5px 12px;
//   &:hover {
//     background-color: #eaaeae;
//   }
// `;

const CampaignImageDesktopSharedStyles = css`
  cursor: pointer;
  margin: 0;
  height: 117px;
  width: 224px;
`;

const CampaignImageDesktopPlaceholder = styled.div`
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  ${CampaignImageDesktopSharedStyles}
`;

const CampaignImageDesktop = styled.img`
  border-radius: 5px;
  ${CampaignImageDesktopSharedStyles}
`;

const CampaignImageMobileSharedStyles = css`
  cursor: pointer;
  margin: 0;
  width: 100%;
`;

const CampaignImageMobilePlaceholder = styled.div`
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
  ${CampaignImageMobileSharedStyles}
`;

const CampaignImagePlaceholderText = styled.div`
  color: #ccc;
`;

const CampaignImageMobile = styled.img`
  border-radius: 5px;
  ${CampaignImageMobileSharedStyles}
`;

const CampaignOwnersWrapper = styled.div`
`;

const ClickableDiv = styled.div`
  cursor: pointer;
  width: 100%;
`;

// const DraftModeIndicator = styled.span`
//   background-color: #ccc;
//   border-radius: 4px;
//   color: #2e3c5d;
//   cursor: pointer;
//   font-size: 14px;
//   padding: 5px 12px;
//   &:hover {
//     background-color: #bfbfbf;
//   }
// `;

// const EditIndicator = styled.span`
//   background-color: #fff;
//   border: 1px solid rgba(46, 60, 93, 0.5);
//   border-radius: 4px;
//   color: #2e3c5d;
//   cursor: pointer;
//   font-size: 14px;
//   font-family: "Roboto", "Helvetica", "Arial", sans-serif;
//   font-weight: 500;
//   line-height: 1.75;
//   user-select: none;
//   letter-spacing: 0.02857em;
//   padding: 4px 12px;
//   text-transform: none;
//   &:hover {
//     background-color: #f0f0f0;
//   }
// `;

// const ElectionInPast = styled.span`
//   background-color: #00cc66;
//   border-radius: 4px;
//   color: #2e3c5d;
//   // cursor: pointer;
//   font-size: 14px;
//   margin-right: 10px;
//   margin-top: 10px;
//   padding: 5px 12px;
//   // &:hover {
//   //   background-color: #00b359;
//   // }
// `;

// const IndicatorButtonWrapper = styled.div`
//   margin-bottom: 4px;
//   margin-right: 8px;
// `;

// const IndicatorDefaultButtonWrapper = styled.div`
//   cursor: pointer;
//   margin-bottom: 4px;
//   margin-right: 8px;
//   margin-top: 2px;
// `;

const IndicatorSupportButtonWrapper = styled.div`
  margin-bottom: 4px;
  margin-right: 8px;
  margin-top: -1px;
`;

// const IndicatorRow = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   justify-content: start;
//   margin-top: 12px;
// `;

const OneCampaignDescription = styled.div`
  font-size: 14px;
  margin: 4px 0;
`;

const OneCampaignInnerWrapper = styled.div`
  margin: 15px 0;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: flex;
    justify-content: space-between;
    margin: 15px;
  }
`;

const OneCampaignOuterWrapper = styled.div`
  border-top: 1px solid #ddd;
  margin-top: 15px;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    border: 1px solid #ddd;
    border-radius: 5px;
  }
`;

const OneCampaignPhotoDesktopColumn = styled.div`
  margin-bottom: 0;
  margin-left: 15px;
  margin-top: 0;
  height: 117px;
  width: 224px;
`;

const OneCampaignPhotoWrapperMobile = styled.div`
  cursor: pointer;
  margin-bottom: 8px;
  margin-top: 8px;
  min-height: 150px;
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    margin-top: 0;
    min-height: auto;
    width: 100%;
  }
`;

const OneCampaignTextColumn = styled.div`
  width: 100%;
`;

const OneCampaignTitle = styled.h1`
  font-size: 18px;
  margin: 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-bottom: 4px;
  }
`;

const SupportersActionLink = styled.span`
  font-size: 14px;
`;

const SupportersCount = styled.span`
  color: #808080;
  font-weight: 600 !important;
  font-size: 14px;
`;

const SupportersWrapper = styled.div`
  margin-bottom: 6px;
`;

const Wrapper = styled.div`
`;

export default withStyles(styles)(CampaignCardForList);
