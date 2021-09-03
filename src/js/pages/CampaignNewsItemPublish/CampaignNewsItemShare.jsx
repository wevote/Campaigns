import React, { Component, Suspense } from 'react';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import AppStore from '../../stores/AppStore';
import {
  CampaignImage, CampaignProcessStepIntroductionText, CampaignProcessStepTitle,
} from '../../components/Style/CampaignProcessStyles';
import {
  CampaignSupportDesktopButtonPanel, CampaignSupportDesktopButtonWrapper,
  CampaignSupportImageWrapper, CampaignSupportImageWrapperText,
  CampaignSupportMobileButtonPanel, CampaignSupportMobileButtonWrapper,
  CampaignSupportSection, CampaignSupportSectionWrapper,
  SkipForNowButtonPanel, SkipForNowButtonWrapper,
} from '../../components/Style/CampaignSupportStyles';
import CampaignShareChunk from '../../components/Campaign/CampaignShareChunk';
import CampaignStore from '../../stores/CampaignStore';
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiers } from '../../utils/campaignUtils';
import CampaignSupporterActions from '../../actions/CampaignSupporterActions';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import CampaignNewsItemPublishSteps from '../../components/Navigation/CampaignNewsItemPublishSteps';
import { historyPush, isCordova } from '../../utils/cordovaUtils';
import { ContentInnerWrapperDefault, ContentOuterWrapperDefault, PageWrapperDefault } from '../../components/Style/PageWrapperStyles';
import { renderLog } from '../../utils/logging';
import SendFacebookDirectMessageButton from '../../components/Share/ShareByFacebookDirectMessageButton';
import ShareByCopyLink from '../../components/Share/ShareByCopyLink';
import ShareByEmailButton from '../../components/Share/ShareByEmailButton';
// import ShareOnFacebookButton from '../../components/Share/ShareOnFacebookButton';
// import ShareOnTwitterButton from '../../components/Share/ShareOnTwitterButton';

const CampaignRetrieveController = React.lazy(() => import('../../components/Campaign/CampaignRetrieveController'));
const RecommendedCampaignListRetrieveController = React.lazy(() => import('../../components/Campaign/RecommendedCampaignListRetrieveController'));
const VoterFirstRetrieveController = loadable(() => import('../../components/Settings/VoterFirstRetrieveController'));


class CampaignNewsItemShare extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignPhotoLargeUrl: '',
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXWeVoteId: '',
      chosenWebsiteName: '',
      shareButtonClicked: false,
    };
  }

  componentDidMount () {
    // console.log('CampaignNewsItemShare componentDidMount');
    this.props.setShowHeaderFooter(false);
    this.onAppStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.onCampaignSupporterStoreChange();
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    const { match: { params } } = this.props;
    const {
      campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams,
      campaignXNewsItemWeVoteId,
      campaignXWeVoteId: campaignXWeVoteIdFromParams,
    } = params;
    // console.log('componentDidMount campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    const {
      campaignPhotoLargeUrl,
      campaignSEOFriendlyPath,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignPhotoLargeUrl,
      campaignXNewsItemWeVoteId,
    });
    if (campaignSEOFriendlyPath) {
      this.setState({
        campaignSEOFriendlyPath,
      });
    } else if (campaignSEOFriendlyPathFromParams) {
      this.setState({
        campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams,
      });
    }
    if (campaignXWeVoteId) {
      this.leaveIfNotAllowedToEdit(campaignXWeVoteId);
      this.setState({
        campaignXWeVoteId,
      });
    } else if (campaignXWeVoteIdFromParams) {
      this.leaveIfNotAllowedToEdit(campaignXWeVoteIdFromParams);
      this.setState({
        campaignXWeVoteId: campaignXWeVoteIdFromParams,
      });
    }
    // Take the "calculated" identifiers and retrieve so we have the voter's comment
    retrieveCampaignXFromIdentifiers(campaignSEOFriendlyPath, campaignXWeVoteId);
  }

  componentDidUpdate (prevProps) {
    // console.log('CampaignNewsItemShare componentDidUpdate');
    this.leaveIfNotAllowedToEdit();
    const {
      showShareCampaignWithOneFriend: showShareCampaignWithOneFriendPrevious,
    } = prevProps;
    const {
      showShareCampaignWithOneFriend,
    } = this.props;
    if (showShareCampaignWithOneFriend !== showShareCampaignWithOneFriendPrevious) {
      // this.setState({});
    }
  }

  componentWillUnmount () {
    CampaignSupporterActions.shareButtonClicked(false);
    this.props.setShowHeaderFooter(true);
    this.appStoreListener.remove();
    this.campaignStoreListener.remove();
    this.campaignSupporterStoreListener.remove();
  }

  onAppStoreChange () {
    const chosenWebsiteName = AppStore.getChosenWebsiteName();
    this.setState({
      chosenWebsiteName,
    });
  }

  onCampaignStoreChange () {
    const { match: { params } } = this.props;
    const {
      campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams,
      campaignXNewsItemWeVoteId,
      campaignXWeVoteId: campaignXWeVoteIdFromParams,
    } = params;
    // console.log('onCampaignStoreChange campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    let recommendedCampaignXListCount = 0;
    let recommendedCampaignXListHasBeenRetrieved = false;
    const {
      campaignPhotoLargeUrl,
      campaignSEOFriendlyPath,
      campaignTitle,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignPhotoLargeUrl,
      campaignTitle,
      campaignXNewsItemWeVoteId,
    });
    if (campaignSEOFriendlyPath) {
      this.setState({
        campaignSEOFriendlyPath,
      });
    } else if (campaignSEOFriendlyPathFromParams) {
      this.setState({
        campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams,
      });
    }
    if (campaignXWeVoteId) {
      this.leaveIfNotAllowedToEdit(campaignXWeVoteId);
      recommendedCampaignXListCount = CampaignStore.getRecommendedCampaignXListCount(campaignXWeVoteId);
      recommendedCampaignXListHasBeenRetrieved = CampaignStore.getRecommendedCampaignXListHasBeenRetrieved(campaignXWeVoteId);
      this.setState({
        campaignXWeVoteId,
        recommendedCampaignXListCount,
        recommendedCampaignXListHasBeenRetrieved,
      });
    } else if (campaignXWeVoteIdFromParams) {
      this.leaveIfNotAllowedToEdit(campaignXWeVoteIdFromParams);
      recommendedCampaignXListCount = CampaignStore.getRecommendedCampaignXListCount(campaignXWeVoteIdFromParams);
      recommendedCampaignXListHasBeenRetrieved = CampaignStore.getRecommendedCampaignXListHasBeenRetrieved(campaignXWeVoteIdFromParams);
      this.setState({
        campaignXWeVoteId: campaignXWeVoteIdFromParams,
        recommendedCampaignXListCount,
        recommendedCampaignXListHasBeenRetrieved,
      });
    }
  }

  onCampaignSupporterStoreChange () {
    const shareButtonClicked = CampaignSupporterStore.getShareButtonClicked();
    this.setState({
      shareButtonClicked,
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

  goToNextStep = () => {
    const { noNavigation, showShareCampaignWithOneFriend } = this.props;
    const { campaignXNewsItemWeVoteId, shareButtonClicked } = this.state;
    if (shareButtonClicked || showShareCampaignWithOneFriend) {
      historyPush(`${this.getCampaignBasePath()}/updates`);
    } else {
      historyPush(`${this.getCampaignBasePath()}/share${noNavigation ? '-it' : ''}-with-one-friend/${campaignXNewsItemWeVoteId}`);
    }
  }

  submitSkipForNow = () => {
    this.goToNextStep();
  }

  leaveIfNotAllowedToEdit () {
    const { campaignXWeVoteId } = this.state;
    // const campaignIsLoaded = CampaignStore.campaignXIsLoaded(campaignXWeVoteId);
    // console.log('leaveIfNotAllowedToEdit, campaignXWeVoteId:', campaignXWeVoteId, ', campaignIsLoaded:', campaignIsLoaded);
    if (CampaignStore.campaignXIsLoaded(campaignXWeVoteId)) {
      const voterCanEditThisCampaign = CampaignStore.getVoterCanEditThisCampaign(campaignXWeVoteId);
      // console.log('voterCanEditThisCampaign:', voterCanEditThisCampaign);
      if (!voterCanEditThisCampaign) {
        historyPush(`${this.getCampaignBasePath()}/updates`);
      }
    }
  }

  render () {
    renderLog('CampaignNewsItemShare');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignNewsItemShare window.location.href: ${window.location.href}`);
    }
    const { classes, iWillShare, noNavigation, showShareCampaignWithOneFriend } = this.props;
    const {
      campaignPhotoLargeUrl, campaignSEOFriendlyPath, campaignTitle,
      campaignXNewsItemWeVoteId, campaignXWeVoteId, chosenWebsiteName,
      recommendedCampaignXListCount, recommendedCampaignXListHasBeenRetrieved,
      shareButtonClicked,
    } = this.state;
    let campaignProcessStepIntroductionText = '';
    let campaignProcessStepTitle = 'Update published! Now share with even more people.';
    const htmlTitle = `Sharing ${campaignTitle} - ${chosenWebsiteName}`;
    let skipForNowText = 'Skip for now';
    if (noNavigation) {
      campaignProcessStepTitle = 'Share this update with your community.';
    } else if (iWillShare) {
      campaignProcessStepTitle = 'Thank you for sharing! Sharing leads to way more votes.';
    } else if (showShareCampaignWithOneFriend) {
      campaignProcessStepIntroductionText = 'Direct messages are more likely to convince people to support this campaign.';
      campaignProcessStepTitle = 'Before you go, can you help by recruiting a friend?';
      // Since showing direct message choices is the final step, link should take voter back to the campaign updates page
      // NOTE: When we add the "recommended-campaigns" feature, change this
      if (recommendedCampaignXListHasBeenRetrieved && recommendedCampaignXListCount > 0) {
        skipForNowText = 'Continue';
      } else {
        skipForNowText = 'See latest news about this campaign';
      }
    }
    const campaignDescriptionLimited = 'This is test from CampaignNewsItemShare.';
    return (
      <div>
        <Helmet>
          <title>{htmlTitle}</title>
          <meta
            name="description"
            content={campaignDescriptionLimited}
          />
        </Helmet>
        <PageWrapperDefault cordova={isCordova()}>
          <ContentOuterWrapperDefault>
            <ContentInnerWrapperDefault>
              {!noNavigation && (
                <CampaignNewsItemPublishSteps
                  atStepNumber4
                  campaignBasePath={this.getCampaignBasePath()}
                  campaignXWeVoteId={campaignXWeVoteId}
                  campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId}
                />
              )}
              <CampaignSupportImageWrapper>
                {campaignPhotoLargeUrl ? (
                  <CampaignImage src={campaignPhotoLargeUrl} alt="Campaign" />
                ) : (
                  <CampaignSupportImageWrapperText>
                    {campaignTitle}
                  </CampaignSupportImageWrapperText>
                )}
              </CampaignSupportImageWrapper>
              <CampaignProcessStepTitle>
                {campaignProcessStepTitle}
              </CampaignProcessStepTitle>
              <CampaignProcessStepIntroductionText>
                {campaignProcessStepIntroductionText}
              </CampaignProcessStepIntroductionText>
              {/* Before you go... */}
              {showShareCampaignWithOneFriend ? (
                <CampaignSupportSectionWrapper>
                  <CampaignSupportSection>
                    <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                      <CampaignSupportDesktopButtonPanel>
                        <SendFacebookDirectMessageButton campaignXWeVoteId={campaignXWeVoteId} campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId} />
                      </CampaignSupportDesktopButtonPanel>
                    </CampaignSupportDesktopButtonWrapper>
                    <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                      <CampaignSupportDesktopButtonPanel>
                        <ShareByEmailButton campaignXWeVoteId={campaignXWeVoteId} campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId} />
                      </CampaignSupportDesktopButtonPanel>
                    </CampaignSupportDesktopButtonWrapper>
                    <CampaignSupportMobileButtonWrapper className="u-show-mobile">
                      <CampaignSupportMobileButtonPanel>
                        <ShareByEmailButton campaignXWeVoteId={campaignXWeVoteId} campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId} darkButton mobileMode />
                      </CampaignSupportMobileButtonPanel>
                    </CampaignSupportMobileButtonWrapper>
                    <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                      <CampaignSupportDesktopButtonPanel>
                        <ShareByCopyLink campaignXWeVoteId={campaignXWeVoteId} campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId} />
                      </CampaignSupportDesktopButtonPanel>
                    </CampaignSupportDesktopButtonWrapper>
                    <CampaignSupportMobileButtonWrapper className="u-show-mobile">
                      <CampaignSupportMobileButtonPanel>
                        <ShareByCopyLink campaignXWeVoteId={campaignXWeVoteId} campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId} mobileMode />
                      </CampaignSupportMobileButtonPanel>
                    </CampaignSupportMobileButtonWrapper>
                  </CampaignSupportSection>
                </CampaignSupportSectionWrapper>
              ) : (
                <>
                  <CampaignShareChunk campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId} campaignXWeVoteId={campaignXWeVoteId} />
                </>
              )}
              <CampaignSupportSectionWrapper>
                <CampaignSupportSection>
                  <SkipForNowButtonWrapper>
                    <SkipForNowButtonPanel show>
                      {shareButtonClicked ? (
                        <Button
                          classes={{ root: classes.buttonSimpleLink }}
                          color="primary"
                          id="Continue"
                          onClick={this.submitSkipForNow}
                        >
                          Continue
                        </Button>
                      ) : (
                        <Button
                          classes={{ root: classes.buttonSimpleLink }}
                          color="primary"
                          id="skipPayToPromote"
                          onClick={this.submitSkipForNow}
                        >
                          {skipForNowText}
                        </Button>
                      )}
                    </SkipForNowButtonPanel>
                  </SkipForNowButtonWrapper>
                </CampaignSupportSection>
              </CampaignSupportSectionWrapper>
            </ContentInnerWrapperDefault>
          </ContentOuterWrapperDefault>
        </PageWrapperDefault>
        <Suspense fallback={<span>&nbsp;</span>}>
          <CampaignRetrieveController campaignSEOFriendlyPath={campaignSEOFriendlyPath} campaignXWeVoteId={campaignXWeVoteId} />
        </Suspense>
        <Suspense fallback={<span>&nbsp;</span>}>
          <RecommendedCampaignListRetrieveController campaignXWeVoteId={campaignXWeVoteId} />
        </Suspense>
        <Suspense fallback={<span>&nbsp;</span>}>
          <VoterFirstRetrieveController />
        </Suspense>
      </div>
    );
  }
}
CampaignNewsItemShare.propTypes = {
  classes: PropTypes.object,
  iWillShare: PropTypes.bool,
  match: PropTypes.object,
  noNavigation: PropTypes.bool,
  setShowHeaderFooter: PropTypes.func,
  showShareCampaignWithOneFriend: PropTypes.bool,
};

const styles = () => ({
  buttonDefault: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
  buttonDefaultCordova: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '35px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
  buttonDesktop: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 12px',
    textTransform: 'none',
    minWidth: 300,
  },
  buttonRoot: {
    width: 250,
  },
  buttonSimpleLink: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 12px',
    textDecoration: 'underline',
    textTransform: 'none',
    minWidth: 250,
    '&:hover': {
      color: '#4371cc',
      textDecoration: 'underline',
    },
  },
});

// const PublicOrPrivateSectionHeader = styled.span`
//   font-weight: 600;
// `;
//
// const PublicOrPrivateSectionText = styled.span`
//   color: #999;
// `;

export default withStyles(styles)(CampaignNewsItemShare);
