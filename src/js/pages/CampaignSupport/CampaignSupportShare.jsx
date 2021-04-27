import React, { Component, Suspense } from 'react';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
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
import CampaignStore from '../../stores/CampaignStore';
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiers } from '../../utils/campaignUtils';
import CampaignSupportSteps from '../../components/Navigation/CampaignSupportSteps';
import { historyPush, isCordova } from '../../utils/cordovaUtils';
import { ContentInnerWrapperDefault, ContentOuterWrapperDefault, PageWrapperDefault } from '../../components/Style/PageWrapperStyles';
import { renderLog } from '../../utils/logging';
import SendFacebookDirectMessageButton from '../../components/Share/SendFacebookDirectMessageButton';
import ShareOnFacebookButton from '../../components/Share/ShareOnFacebookButton';
import ShareOnTwitterButton from '../../components/Share/ShareOnTwitterButton';

const CampaignRetrieveController = React.lazy(() => import('../../components/Campaign/CampaignRetrieveController'));
const VoterFirstRetrieveController = loadable(() => import('../../components/Settings/VoterFirstRetrieveController'));


class CampaignSupportShare extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignPhotoLargeUrl: '',
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXWeVoteId: '',
      chosenWebsiteName: '',
    };
  }

  componentDidMount () {
    // console.log('CampaignSupportShare componentDidMount');
    this.props.setShowHeaderFooter(false);
    this.onAppStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams, campaignXWeVoteId: campaignXWeVoteIdFromParams } = params;
    // console.log('componentDidMount campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    const {
      campaignPhotoLargeUrl,
      campaignSEOFriendlyPath,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignPhotoLargeUrl,
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
      this.setState({
        campaignXWeVoteId,
      });
    } else if (campaignXWeVoteIdFromParams) {
      this.setState({
        campaignXWeVoteId: campaignXWeVoteIdFromParams,
      });
    }
    // Take the "calculated" identifiers and retrieve so we have the voter's comment
    retrieveCampaignXFromIdentifiers(campaignSEOFriendlyPath, campaignXWeVoteId);
  }

  componentDidUpdate (prevProps) {
    // console.log('CampaignDetailsActionSideBox componentDidUpdate');
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
    this.props.setShowHeaderFooter(true);
    this.appStoreListener.remove();
    this.campaignStoreListener.remove();
  }

  onAppStoreChange () {
    const chosenWebsiteName = AppStore.getChosenWebsiteName();
    this.setState({
      chosenWebsiteName,
    });
  }

  onCampaignStoreChange () {
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams, campaignXWeVoteId: campaignXWeVoteIdFromParams } = params;
    // console.log('onCampaignStoreChange campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    const {
      campaignPhotoLargeUrl,
      campaignSEOFriendlyPath,
      campaignTitle,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignPhotoLargeUrl,
      campaignTitle,
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
      this.setState({
        campaignXWeVoteId,
      });
    } else if (campaignXWeVoteIdFromParams) {
      this.setState({
        campaignXWeVoteId: campaignXWeVoteIdFromParams,
      });
    }
  }

  getCampaignBasePath = () => {
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.state;
    let campaignBasePath = '';
    if (campaignSEOFriendlyPath) {
      campaignBasePath = `/c/${campaignSEOFriendlyPath}`;
    } else {
      campaignBasePath = `/id/${campaignXWeVoteId}`;
    }

    return campaignBasePath;
  }

  copyLink = () => {
    // const { campaignXWeVoteId } = this.state;
  }

  goToNextStep = () => {
    const { showShareCampaignWithOneFriend } = this.props;
    if (showShareCampaignWithOneFriend) {
      // Since showing direct message choices is the final step, link should take voter back to the campaign updates page
      // NOTE: When we add the "recommended-campaigns" feature, change this
      historyPush(`${this.getCampaignBasePath()}/updates`);
    } else {
      historyPush(`${this.getCampaignBasePath()}/share-campaign-with-one-friend`);
    }
  }

  submitSkipForNow = () => {
    this.goToNextStep();
  }

  render () {
    renderLog('CampaignSupportShare');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignSupportShare window.location.href: ${window.location.href}`);
    }
    const { classes, iWillShare, showShareCampaignWithOneFriend } = this.props;
    const { campaignPhotoLargeUrl, campaignSEOFriendlyPath, campaignTitle, campaignXWeVoteId, chosenWebsiteName } = this.state;
    let campaignProcessStepIntroductionText = 'Voters joined this campaign thanks to the people who shared it. Join them and help this campaign grow!';
    let campaignProcessStepTitle = 'Sharing leads to way more votes.';
    const htmlTitle = `${campaignTitle} - ${chosenWebsiteName}`;
    let skipForNowText = 'Skip for now';
    if (iWillShare) {
      campaignProcessStepTitle = 'Thank you for sharing! Sharing leads to way more votes.';
    } else if (showShareCampaignWithOneFriend) {
      campaignProcessStepIntroductionText = 'Direct messages are more likely to convince people to support this campaign.';
      campaignProcessStepTitle = 'Before you go, can you help by recruiting a friend?';
      // Since showing direct message choices is the final step, link should take voter back to the campaign updates page
      // NOTE: When we add the "recommended-campaigns" feature, change this
      skipForNowText = 'See news for this campaign';
    }
    const campaignDescriptionLimited = 'This is test from CampaignSupportShare.';
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
              <CampaignSupportSteps
                atSharingStep
                campaignBasePath={this.getCampaignBasePath()}
                campaignXWeVoteId={campaignXWeVoteId}
              />
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
                        <SendFacebookDirectMessageButton campaignXWeVoteId={campaignXWeVoteId} />
                      </CampaignSupportDesktopButtonPanel>
                    </CampaignSupportDesktopButtonWrapper>
                    <CampaignSupportMobileButtonWrapper className="u-show-mobile">
                      <CampaignSupportMobileButtonPanel>
                        <SendFacebookDirectMessageButton campaignXWeVoteId={campaignXWeVoteId} mobileMode />
                      </CampaignSupportMobileButtonPanel>
                    </CampaignSupportMobileButtonWrapper>
                    {/* <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet"> */}
                    {/*  <CampaignSupportDesktopButtonPanel> */}
                    {/*    <Button */}
                    {/*      classes={{ root: classes.buttonDesktop }} */}
                    {/*      color="primary" */}
                    {/*      id="copyLinkDesktop" */}
                    {/*      onClick={this.copyLink} */}
                    {/*      variant="outlined" */}
                    {/*    > */}
                    {/*      Copy link */}
                    {/*    </Button> */}
                    {/*  </CampaignSupportDesktopButtonPanel> */}
                    {/* </CampaignSupportDesktopButtonWrapper> */}
                    {/* <CampaignSupportMobileButtonWrapper className="u-show-mobile"> */}
                    {/*  <CampaignSupportMobileButtonPanel> */}
                    {/*    <Button */}
                    {/*      classes={{ root: classes.buttonDefault }} */}
                    {/*      color="primary" */}
                    {/*      id="copyLinkMobile" */}
                    {/*      onClick={this.copyLink} */}
                    {/*      variant="outlined" */}
                    {/*    > */}
                    {/*      Copy link */}
                    {/*    </Button> */}
                    {/*  </CampaignSupportMobileButtonPanel> */}
                    {/* </CampaignSupportMobileButtonWrapper> */}
                  </CampaignSupportSection>
                </CampaignSupportSectionWrapper>
              ) : (
                <CampaignSupportSectionWrapper>
                  <CampaignSupportSection>
                    <CampaignSupportDesktopButtonWrapper>
                      <CampaignSupportDesktopButtonPanel>
                        <PublicOrPrivateSectionHeader>Share publicly. </PublicOrPrivateSectionHeader>
                        <PublicOrPrivateSectionText>
                          Share with everyone and make your voice heard.
                        </PublicOrPrivateSectionText>
                      </CampaignSupportDesktopButtonPanel>
                    </CampaignSupportDesktopButtonWrapper>
                    <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                      <CampaignSupportDesktopButtonPanel>
                        <ShareOnFacebookButton campaignXWeVoteId={campaignXWeVoteId} />
                      </CampaignSupportDesktopButtonPanel>
                    </CampaignSupportDesktopButtonWrapper>
                    <CampaignSupportMobileButtonWrapper className="u-show-mobile">
                      <CampaignSupportMobileButtonPanel>
                        <ShareOnFacebookButton campaignXWeVoteId={campaignXWeVoteId} mobileMode />
                      </CampaignSupportMobileButtonPanel>
                    </CampaignSupportMobileButtonWrapper>
                    <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                      <CampaignSupportDesktopButtonPanel>
                        <ShareOnTwitterButton campaignXWeVoteId={campaignXWeVoteId} />
                      </CampaignSupportDesktopButtonPanel>
                    </CampaignSupportDesktopButtonWrapper>
                    <CampaignSupportMobileButtonWrapper className="u-show-mobile">
                      <CampaignSupportMobileButtonPanel>
                        <ShareOnTwitterButton campaignXWeVoteId={campaignXWeVoteId} mobileMode />
                      </CampaignSupportMobileButtonPanel>
                    </CampaignSupportMobileButtonWrapper>
                  </CampaignSupportSection>
                </CampaignSupportSectionWrapper>
              )}
              <CampaignSupportSectionWrapper>
                <CampaignSupportSection>
                  <SkipForNowButtonWrapper>
                    <SkipForNowButtonPanel>
                      <Button
                        classes={{ root: classes.buttonSimpleLink }}
                        color="primary"
                        id="skipPayToPromote"
                        onClick={this.submitSkipForNow}
                      >
                        {skipForNowText}
                      </Button>
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
          <VoterFirstRetrieveController />
        </Suspense>
      </div>
    );
  }
}
CampaignSupportShare.propTypes = {
  classes: PropTypes.object,
  iWillShare: PropTypes.bool,
  match: PropTypes.object,
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

const PublicOrPrivateSectionHeader = styled.span`
  font-weight: 600;
`;

const PublicOrPrivateSectionText = styled.span`
  color: #999;
`;

export default withStyles(styles)(CampaignSupportShare);
