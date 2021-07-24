import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import AppStore from '../stores/AppStore';
import {
  BlockedIndicator, DraftModeIndicator, EditIndicator, ElectionInPast,
  IndicatorButtonWrapper, IndicatorRow,
} from '../components/Style/CampaignIndicatorStyles';
import CampaignOwnersList from '../components/CampaignSupport/CampaignOwnersList';
import CampaignTopNavigation from '../components/Navigation/CampaignTopNavigation';
import CampaignStore from '../stores/CampaignStore';
import CampaignSupporterActions from '../actions/CampaignSupporterActions';
import CampaignSupporterStore from '../stores/CampaignSupporterStore';
import CompleteYourProfileModalController from '../components/Settings/CompleteYourProfileModalController';
import DelayedLoad from '../components/Widgets/DelayedLoad';
import { getCampaignXValuesFromIdentifiers } from '../utils/campaignUtils';
import { historyPush, isCordova } from '../utils/cordovaUtils';
import initializejQuery from '../utils/initializejQuery';
import OpenExternalWebSite from '../components/Widgets/OpenExternalWebSite';
import { renderLog } from '../utils/logging';
import returnFirstXWords from '../utils/returnFirstXWords';

const CampaignCommentsList = React.lazy(() => import('../components/Campaign/CampaignCommentsList'));
const CampaignDetailsActionSideBox = React.lazy(() => import('../components/CampaignSupport/CampaignDetailsActionSideBox'));
const CampaignRetrieveController = React.lazy(() => import('../components/Campaign/CampaignRetrieveController'));
const CampaignSupportThermometer = React.lazy(() => import('../components/CampaignSupport/CampaignSupportThermometer'));
const SupportButtonBeforeCompletionScreen = React.lazy(() => import('../components/CampaignSupport/SupportButtonBeforeCompletionScreen'));


class CampaignDetailsPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignPhotoLargeUrl: '',
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXWeVoteId: '',
      chosenWebsiteName: '',
      finalElectionDateInPast: false,
      pathToUseWhenProfileComplete: '',
      payToPromoteStepCompleted: false,
      payToPromoteStepTurnedOn: false,
      sharingStepCompleted: false,
      step2Completed: false,
      voterCanEditThisCampaign: false,
    };
  }

  componentDidMount () {
    // console.log('CampaignDetailsPage componentDidMount');
    this.onCampaignStoreChange();
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = params;
    // console.log('componentDidMount campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
    this.onAppStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    // retrieveCampaignXFromIdentifiersIfNeeded(campaignSEOFriendlyPath, campaignXWeVoteId);
    let pathToUseWhenProfileComplete;
    if (campaignSEOFriendlyPath) {
      this.setState({
        campaignSEOFriendlyPath,
      });
      pathToUseWhenProfileComplete = `/c/${campaignSEOFriendlyPath}/why-do-you-support`;
    } else {
      this.setState({
        campaignXWeVoteId,
      });
      pathToUseWhenProfileComplete = `/id/${campaignXWeVoteId}/why-do-you-support`;
    }
    this.setState({
      pathToUseWhenProfileComplete,
    });
  }

  componentWillUnmount () {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.appStoreListener.remove();
    this.campaignStoreListener.remove();
    this.campaignSupporterStoreListener.remove();
  }

  onAppStoreChange () {
    const chosenWebsiteName = AppStore.getChosenWebsiteName();
    const inPrivateLabelMode = AppStore.inPrivateLabelMode();
    // For now, we assume that paid sites with chosenSiteLogoUrl will turn off "Chip in"
    const payToPromoteStepTurnedOn = !inPrivateLabelMode;
    this.setState({
      chosenWebsiteName,
      payToPromoteStepTurnedOn,
    });
  }

  onCampaignStoreChange () {
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams, campaignXWeVoteId: campaignXWeVoteIdFromParams } = params;
    // console.log('onCampaignStoreChange campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    const {
      campaignDescription,
      campaignPhotoLargeUrl,
      campaignSEOFriendlyPath,
      campaignTitle,
      campaignXWeVoteId,
      finalElectionDateInPast,
      isBlockedByWeVote,
      isBlockedByWeVoteReason,
      isSupportersCountMinimumExceeded,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    let pathToUseWhenProfileComplete;
    if (campaignSEOFriendlyPath) {
      this.setState({
        campaignSEOFriendlyPath,
      });
      pathToUseWhenProfileComplete = `/c/${campaignSEOFriendlyPath}/why-do-you-support`;
    } else if (campaignXWeVoteId) {
      pathToUseWhenProfileComplete = `/id/${campaignXWeVoteId}/why-do-you-support`;
    }
    if (campaignXWeVoteId) {
      const voterCanEditThisCampaign = CampaignStore.getVoterCanEditThisCampaign(campaignXWeVoteId);
      this.setState({
        campaignXWeVoteId,
        voterCanEditThisCampaign,
      });
    }
    const campaignDescriptionLimited = returnFirstXWords(campaignDescription, 200);
    this.setState({
      campaignDescription,
      campaignDescriptionLimited,
      campaignPhotoLargeUrl,
      campaignTitle,
      finalElectionDateInPast,
      isBlockedByWeVote,
      isBlockedByWeVoteReason,
      isSupportersCountMinimumExceeded,
      pathToUseWhenProfileComplete,
    });
  }

  onCampaignSupporterStoreChange () {
    const { campaignXWeVoteId } = this.state;
    const step2Completed = CampaignSupporterStore.supporterEndorsementExists(campaignXWeVoteId);
    const payToPromoteStepCompleted = false;
    const sharingStepCompleted = false;
    // console.log('onCampaignSupporterStoreChange sharingStepCompleted: ', sharingStepCompleted, ', step2Completed: ', step2Completed, ', payToPromoteStepCompleted:', payToPromoteStepCompleted);
    this.setState({
      sharingStepCompleted,
      step2Completed,
      payToPromoteStepCompleted,
    });
  }

  getCampaignBasePath = () => {
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.state;
    let campaignBasePath;
    if (campaignSEOFriendlyPath) {
      campaignBasePath = `/c/${campaignSEOFriendlyPath}`;
    } else {
      campaignBasePath = `/id/${campaignXWeVoteId}`;
    }

    return campaignBasePath;
  }

  goToNextPage = () => {
    const { pathToUseWhenProfileComplete } = this.state;
    this.timer = setTimeout(() => {
      historyPush(pathToUseWhenProfileComplete);
    }, 500);
  }

  functionToUseToKeepHelping = () => {
    // console.log('functionToUseToKeepHelping');
    const { payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, step2Completed } = this.state;
    if (!sharingStepCompleted) {
      historyPush(`${this.getCampaignBasePath()}/share-campaign`);
    } else if (payToPromoteStepTurnedOn && !payToPromoteStepCompleted) {
      historyPush(`${this.getCampaignBasePath()}/pay-to-promote`);
    } else if (!step2Completed) {
      historyPush(`${this.getCampaignBasePath()}/why-do-you-support`);
    } else {
      historyPush(`${this.getCampaignBasePath()}/share-campaign`);
    }
  }

  functionToUseWhenProfileComplete = () => {
    const { campaignXWeVoteId } = this.state;
    const campaignSupported = true;
    const campaignSupportedChanged = true;
    // From this page we always send value for 'visibleToPublic'
    let visibleToPublic = CampaignSupporterStore.getVisibleToPublic();
    const visibleToPublicChanged = CampaignSupporterStore.getVisibleToPublicQueuedToSaveSet();
    if (visibleToPublicChanged) {
      // If it has changed, use new value
      visibleToPublic = CampaignSupporterStore.getVisibleToPublicQueuedToSave();
    }
    // console.log('functionToUseWhenProfileComplete, visibleToPublic:', visibleToPublic, ', visibleToPublicChanged:', visibleToPublicChanged, ', blockCampaignXRedirectOnSignIn:', AppStore.blockCampaignXRedirectOnSignIn());
    const saveVisibleToPublic = true;
    if (!AppStore.blockCampaignXRedirectOnSignIn()) {
      initializejQuery(() => {
        CampaignSupporterActions.supportCampaignSave(campaignXWeVoteId, campaignSupported, campaignSupportedChanged, visibleToPublic, saveVisibleToPublic);
      }, this.goToNextPage());
    }
  }

  onCampaignEditClick = () => {
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.state;
    // console.log('campaignX:', campaignX);
    if (campaignSEOFriendlyPath) {
      historyPush(`/c/${campaignSEOFriendlyPath}/edit`);
    } else {
      historyPush(`/id/${campaignXWeVoteId}/edit`);
    }
    return null;
  }

  onCampaignGetMinimumSupportersClick = () => {
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.state;
    if (campaignSEOFriendlyPath) {
      historyPush(`/c/${campaignSEOFriendlyPath}/share-campaign`);
    } else {
      historyPush(`/id/${campaignXWeVoteId}/share-campaign`);
    }
    return null;
  }

  render () {
    renderLog('CampaignDetailsPage');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignDetailsPage window.location.href: ${window.location.href}`);
    }
    // const { classes } = this.props;
    const {
      campaignDescription, campaignDescriptionLimited, campaignPhotoLargeUrl,
      campaignSEOFriendlyPath, campaignTitle, campaignXWeVoteId,
      chosenWebsiteName, isBlockedByWeVote, isBlockedByWeVoteReason,
      finalElectionDateInPast, isSupportersCountMinimumExceeded,
      voterCanEditThisCampaign,
    } = this.state;
    // console.log('render isSupportersCountMinimumExceeded: ', isSupportersCountMinimumExceeded);
    const htmlTitle = `${campaignTitle} - ${chosenWebsiteName}`;
    if (isBlockedByWeVote && !voterCanEditThisCampaign) {
      return (
        <PageWrapper cordova={isCordova()}>
          <Helmet>
            <title>{htmlTitle}</title>
            <meta
              name="description"
              content={campaignDescriptionLimited}
            />
          </Helmet>
          <CampaignTitleAndScoreBar className="u-show-mobile">
            <CampaignTitleMobile>{campaignTitle}</CampaignTitleMobile>
          </CampaignTitleAndScoreBar>
          <DetailsSectionDesktopTablet className="u-show-desktop-tablet">
            <CampaignTitleDesktop>{campaignTitle}</CampaignTitleDesktop>
          </DetailsSectionDesktopTablet>
          <BlockedReason>
            This campaign has been blocked by moderators from We Vote because it is currently violating our terms of service. If you have any questions,
            {' '}
            <OpenExternalWebSite
              linkIdAttribute="weVoteSupport"
              url="https://help.wevote.us/hc/en-us/requests/new"
              target="_blank"
              body={<span>please contact We Vote support.</span>}
            />
            {isBlockedByWeVoteReason && (
              <>
                <br />
                <hr />
                &quot;
                {isBlockedByWeVoteReason}
                &quot;
              </>
            )}
          </BlockedReason>
        </PageWrapper>
      );
    }

    return (
      <div>
        <Suspense fallback={<span>&nbsp;</span>}>
          <CampaignRetrieveController campaignSEOFriendlyPath={campaignSEOFriendlyPath} campaignXWeVoteId={campaignXWeVoteId} />
        </Suspense>
        <Helmet>
          <title>{htmlTitle}</title>
          <meta
            name="description"
            content={campaignDescriptionLimited}
          />
        </Helmet>
        <PageWrapper cordova={isCordova()}>
          {isBlockedByWeVote && (
            <BlockedReason>
              Your campaign has been blocked by moderators from We Vote. It is only visible campaign owners. Please make any requested modifications so you are in compliance with our terms of service and
              {' '}
              <OpenExternalWebSite
                linkIdAttribute="weVoteSupport"
                url="https://help.wevote.us/hc/en-us/requests/new"
                target="_blank"
                body={<span>contact We Vote support for help.</span>}
              />
              {isBlockedByWeVoteReason && (
                <>
                  <br />
                  <hr />
                  &quot;
                  {isBlockedByWeVoteReason}
                  &quot;
                </>
              )}
            </BlockedReason>
          )}
          <CampaignTopNavigation campaignSEOFriendlyPath={campaignSEOFriendlyPath} campaignXWeVoteId={campaignXWeVoteId} />
          <DetailsSectionMobile className="u-show-mobile">
            <CampaignImageMobileWrapper>
              {campaignPhotoLargeUrl ? (
                <CampaignImage src={campaignPhotoLargeUrl} alt="Campaign" />
              ) : (
                <DelayedLoad waitBeforeShow={1000}>
                  <CampaignImagePlaceholder>
                    <CampaignImagePlaceholderText>
                      No image provided
                    </CampaignImagePlaceholderText>
                  </CampaignImagePlaceholder>
                </DelayedLoad>
              )}
            </CampaignImageMobileWrapper>
            <CampaignTitleAndScoreBar>
              <CampaignTitleMobile>{campaignTitle}</CampaignTitleMobile>
              <Suspense fallback={<span>&nbsp;</span>}>
                <CampaignSupportThermometer campaignXWeVoteId={campaignXWeVoteId} />
              </Suspense>
              <CampaignOwnersWrapper>
                <CampaignOwnersList campaignXWeVoteId={campaignXWeVoteId} />
              </CampaignOwnersWrapper>
            </CampaignTitleAndScoreBar>
            <CampaignDescriptionWrapper>
              <CampaignDescription>
                {campaignDescription}
              </CampaignDescription>
              {finalElectionDateInPast && (
                <IndicatorButtonWrapper>
                  <ElectionInPast>
                    Election in Past
                  </ElectionInPast>
                </IndicatorButtonWrapper>
              )}
              {voterCanEditThisCampaign && (
                <IndicatorButtonWrapper>
                  {isBlockedByWeVote && (
                    <BlockedIndicator onClick={this.onCampaignEditClick}>
                      Blocked: Changes Needed
                    </BlockedIndicator>
                  )}
                  {(!isSupportersCountMinimumExceeded) && (
                    <DraftModeIndicator onClick={this.onCampaignGetMinimumSupportersClick}>
                      Needs Five Supporters
                    </DraftModeIndicator>
                  )}
                  <EditIndicator onClick={this.onCampaignEditClick}>
                    Edit This Campaign
                  </EditIndicator>
                </IndicatorButtonWrapper>
              )}
            </CampaignDescriptionWrapper>
            <CommentsListWrapper>
              <DelayedLoad waitBeforeShow={400}>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CampaignSubSectionTitle>
                    Reasons for supporting
                  </CampaignSubSectionTitle>
                  <CampaignCommentsList campaignXWeVoteId={campaignXWeVoteId} startingNumberOfCommentsToDisplay={2} />
                </Suspense>
              </DelayedLoad>
            </CommentsListWrapper>
          </DetailsSectionMobile>
          <DetailsSectionDesktopTablet className="u-show-desktop-tablet">
            <CampaignTitleDesktop>{campaignTitle}</CampaignTitleDesktop>
            <ColumnsWrapper>
              <ColumnTwoThirds>
                <CampaignImageDesktopWrapper>
                  {campaignPhotoLargeUrl ? (
                    <CampaignImageDesktop src={campaignPhotoLargeUrl} alt="Campaign" />
                  ) : (
                    <DelayedLoad waitBeforeShow={1000}>
                      <CampaignImagePlaceholder>
                        <CampaignImagePlaceholderText>
                          No image provided
                        </CampaignImagePlaceholderText>
                      </CampaignImagePlaceholder>
                    </DelayedLoad>
                  )}
                </CampaignImageDesktopWrapper>
                <CampaignOwnersDesktopWrapper>
                  <CampaignOwnersList campaignXWeVoteId={campaignXWeVoteId} />
                </CampaignOwnersDesktopWrapper>
                <CampaignDescriptionDesktopWrapper>
                  <CampaignDescriptionDesktop>
                    {campaignDescription}
                  </CampaignDescriptionDesktop>
                  <IndicatorRow>
                    {finalElectionDateInPast && (
                      <IndicatorButtonWrapper>
                        <ElectionInPast>
                          Election in Past
                        </ElectionInPast>
                      </IndicatorButtonWrapper>
                    )}
                    {voterCanEditThisCampaign && (
                      <IndicatorButtonWrapper>
                        {isBlockedByWeVote && (
                          <BlockedIndicator onClick={this.onCampaignEditClick}>
                            Blocked: Changes Needed
                          </BlockedIndicator>
                        )}
                        {(!isSupportersCountMinimumExceeded) && (
                          <DraftModeIndicator onClick={this.onCampaignGetMinimumSupportersClick}>
                            Needs Five Supporters
                          </DraftModeIndicator>
                        )}
                      </IndicatorButtonWrapper>
                    )}
                  </IndicatorRow>
                  <IndicatorRow>
                    {voterCanEditThisCampaign && (
                      <IndicatorButtonWrapper>
                        <EditIndicator onClick={this.onCampaignEditClick}>
                          Edit This Campaign
                        </EditIndicator>
                      </IndicatorButtonWrapper>
                    )}
                  </IndicatorRow>
                </CampaignDescriptionDesktopWrapper>
                <CommentsListWrapper>
                  <DelayedLoad waitBeforeShow={500}>
                    <Suspense fallback={<span>&nbsp;</span>}>
                      <CampaignSubSectionTitle>
                        Reasons for supporting
                      </CampaignSubSectionTitle>
                      <CampaignCommentsList campaignXWeVoteId={campaignXWeVoteId} startingNumberOfCommentsToDisplay={2} />
                    </Suspense>
                  </DelayedLoad>
                </CommentsListWrapper>
              </ColumnTwoThirds>
              <ColumnOneThird>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CampaignSupportThermometer campaignXWeVoteId={campaignXWeVoteId} finalElectionDateInPast={finalElectionDateInPast} />
                </Suspense>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CampaignDetailsActionSideBox
                    campaignSEOFriendlyPath={campaignSEOFriendlyPath}
                    campaignXWeVoteId={campaignXWeVoteId}
                    finalElectionDateInPast={finalElectionDateInPast}
                    functionToUseToKeepHelping={this.functionToUseToKeepHelping}
                    functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
                  />
                </Suspense>
              </ColumnOneThird>
            </ColumnsWrapper>
          </DetailsSectionDesktopTablet>
        </PageWrapper>
        <SupportButtonFooterWrapper className="u-show-mobile">
          {!finalElectionDateInPast && (
            <SupportButtonPanel>
              <Suspense fallback={<span>&nbsp;</span>}>
                <SupportButtonBeforeCompletionScreen
                  campaignSEOFriendlyPath={campaignSEOFriendlyPath}
                  campaignXWeVoteId={campaignXWeVoteId}
                  functionToUseToKeepHelping={this.functionToUseToKeepHelping}
                  functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
                />
              </Suspense>
            </SupportButtonPanel>
          )}
        </SupportButtonFooterWrapper>
        <CompleteYourProfileModalController
          campaignXWeVoteId={campaignXWeVoteId}
          functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
          supportCampaign
        />
      </div>
    );
  }
}
CampaignDetailsPage.propTypes = {
  // classes: PropTypes.object,
  match: PropTypes.object,
};

const styles = () => ({
  buttonRoot: {
    width: 250,
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

const BlockedReason = styled.div`
  background-color: #efc2c2;
  border-radius: 4px;
  color: #2e3c5d;
  font-size: 18px;
  margin-top: 10px;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin: 10px;
  }
  padding: 5px 12px;
`;

const CampaignDescription = styled.div`
  font-size: 18px;
  text-align: left;
  white-space: pre-wrap;
`;

const CampaignDescriptionDesktop = styled.div`
  font-size: 18px;
  margin-top: 32px;
  text-align: left;
  white-space: pre-wrap;
`;

const CampaignDescriptionWrapper = styled.div`
  margin: 10px;
`;

const CampaignDescriptionDesktopWrapper = styled.div`
  margin-bottom: 10px;
  margin-top: 2px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
  }
`;

const CampaignImagePlaceholder = styled.div`
  background-color: #eee;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 183px;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: 174px;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 239px;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    min-height: 319px;
  }
`;

const CampaignImagePlaceholderText = styled.div`
  color: #ccc;
`;

const CampaignImageDesktopWrapper = styled.div`
  margin-bottom: 10px;
  min-height: 180px;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: 174px;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 239px;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    min-height: 300px;
  }
`;

const CampaignImageMobileWrapper = styled.div`
  min-height: 174px;
  @media (min-width: ${({ theme }) => theme.breakpoints.xs}) {
    min-height: 117px;
  }
`;

const CampaignImage = styled.img`
  width: 100%;
`;

const CampaignImageDesktop = styled.img`
  border-radius: 5px;
  width: 100%;
`;

const CampaignOwnersDesktopWrapper = styled.div`
  margin-bottom: 8px;
`;

const CampaignOwnersWrapper = styled.div`
`;

const CampaignSubSectionTitle = styled.h2`
  font-size: 22px;
  margin: 0;
  margin-bottom: 10px;
  margin-top: 50px;
`;

const CampaignTitleAndScoreBar = styled.div`
  margin: 10px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
  }
`;

const CampaignTitleDesktop = styled.h1`
  font-size: 28px;
  text-align: center;
  margin: 30px 20px 40px 20px;
  min-height: 34px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 24px;
    min-height: 29px;
  }
`;

const CampaignTitleMobile = styled.h1`
  font-size: 22px;
  margin: 0;
  margin-bottom: 10px;
  min-height: 27px;
  text-align: left;
`;

const ColumnOneThird = styled.div`
  flex: 1;
  flex-direction: column;
  flex-basis: 40%;
  margin: 0 0 0 25px;
`;

const ColumnsWrapper = styled.div`
  display: flex;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

const ColumnTwoThirds = styled.div`
  flex: 2;
  flex-direction: column;
  flex-basis: 60%;
`;

const CommentsListWrapper = styled.div`
  margin-bottom: 25px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 0 10px 25px 10px;
  }
`;

const DetailsSectionDesktopTablet = styled.div`
  display: flex;
  flex-flow: column;
`;

const DetailsSectionMobile = styled.div`
  display: flex;
  flex-flow: column;
`;

// const DraftModeIndicator = styled.span`
//   background-color: #ccc;
//   border-radius: 4px;
//   color: #2e3c5d;
//   cursor: pointer;
//   font-size: 14px;
//   margin-right: 10px;
//   margin-top: 10px;
//   padding: 5px 12px;
//   &:hover {
//     background-color: #bfbfbf;
//   }
// `;

// const EditIndicator = styled.span`
//   background-color: #fff;
//   border: 1px solid #2e3c5d;
//   border-radius: 5px;
//   color: #2e3c5d;
//   cursor: pointer;
//   font-size: 14px;
//   margin-top: 10px;
//   padding: 3px 12px;
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
//   display: flex;
//   justify-content: flex-start;
//   flex-wrap: wrap;
// `;

const PageWrapper = styled.div`
  margin: 0 auto;
  max-width: 960px;
`;

const SupportButtonFooterWrapper = styled.div`
  position: fixed;
  width: 100%;
  bottom: 0;
  display: block;
`;

const SupportButtonPanel = styled.div`
  background-color: #fff;
  border-top: 1px solid #ddd;
  padding: 10px;
`;

export default withStyles(styles)(CampaignDetailsPage);
