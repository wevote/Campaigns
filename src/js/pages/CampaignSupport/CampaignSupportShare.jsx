import React, { Component, Suspense } from 'react';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import {
  CampaignImage, CampaignProcessStepIntroductionText, CampaignProcessStepTitle,
} from '../../components/Style/CampaignProcessStyles';
import {
  CampaignSupportDesktopButtonPanel, CampaignSupportDesktopButtonWrapper,
  CampaignSupportMobileButtonPanel, CampaignSupportMobileButtonWrapper,
  CampaignSupportSection, CampaignSupportSectionWrapper,
  SkipForNowButtonPanel, SkipForNowButtonWrapper,
} from '../../components/Style/CampaignSupportStyles';
import CampaignStore from '../../stores/CampaignStore';
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiersIfNeeded } from '../../utils/campaignUtils';
import CampaignSupportSteps from '../../components/Navigation/CampaignSupportSteps';
import { historyPush, isCordova } from '../../utils/cordovaUtils';
import { ContentInnerWrapperDefault, ContentOuterWrapperDefault, PageWrapperDefault } from '../../components/Style/PageWrapperStyles';
import { renderLog } from '../../utils/logging';

const CampaignRetrieveController = React.lazy(() => import('../../components/Campaign/CampaignRetrieveController'));
const VoterFirstRetrieveController = loadable(() => import('../../components/Settings/VoterFirstRetrieveController'));


class CampaignSupportShare extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('CampaignSupportShare componentDidMount');
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams, campaignXWeVoteId: campaignXWeVoteIdFromParams } = params;
    // console.log('componentDidMount campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    const {
      campaignPhoto,
      campaignSEOFriendlyPath,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignPhoto,
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
    // Take the "calculated" identifiers and retrieve if missing
    retrieveCampaignXFromIdentifiersIfNeeded(campaignSEOFriendlyPath, campaignXWeVoteId);
    this.props.setShowHeaderFooter(false);
  }

  componentDidUpdate (prevProps) {
    // console.log('CampaignDetailsActionSideBox componentDidUpdate');
    const {
      showDirectMessageChoices: showDirectMessageChoicesPrevious,
    } = prevProps;
    const {
      showDirectMessageChoices,
    } = this.props;
    if (showDirectMessageChoices !== showDirectMessageChoicesPrevious) {
      // this.setState({});
    }
  }

  componentWillUnmount () {
    this.props.setShowHeaderFooter(true);
    this.campaignStoreListener.remove();
  }

  onCampaignStoreChange () {
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams, campaignXWeVoteId: campaignXWeVoteIdFromParams } = params;
    // console.log('onCampaignStoreChange campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    const {
      campaignPhoto,
      campaignSEOFriendlyPath,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignPhoto,
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
    const { showDirectMessageChoices } = this.props;
    if (showDirectMessageChoices) {
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

  shareOnFacebook = () => {
    // const { campaignXWeVoteId } = this.state;
  }

  shareOnTwitter = () => {
    // const { campaignXWeVoteId } = this.state;
  }

  render () {
    renderLog('CampaignSupportShare');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignSupportShare window.location.href: ${window.location.href}`);
    }
    const { classes, iWillShare, showDirectMessageChoices } = this.props;
    const { campaignPhoto, campaignSEOFriendlyPath, campaignXWeVoteId } = this.state;
    let campaignProcessStepIntroductionText = '200 new supporters joined this campaign thanks to the people who shared it. Join them and help this campaign grow!';
    let campaignProcessStepTitle = 'Sharing leads to way more support.';
    let skipForNowText = 'Skip for now';
    if (iWillShare) {
      campaignProcessStepTitle = 'Thank you for sharing! Sharing leads to way more support.';
    } else if (showDirectMessageChoices) {
      campaignProcessStepIntroductionText = 'Direct messages are 9 times more likely to convince people to support this campaign.';
      campaignProcessStepTitle = 'Before you go, can you help by recruiting a friend?';
      // Since showing direct message choices is the final step, link should take voter back to the campaign updates page
      // NOTE: When we add the "recommended-campaigns" feature, change this
      skipForNowText = 'See news for this campaign';
    }
    return (
      <div>
        <Suspense fallback={<span>&nbsp;</span>}>
          <CampaignRetrieveController campaignSEOFriendlyPath={campaignSEOFriendlyPath} campaignXWeVoteId={campaignXWeVoteId} />
        </Suspense>
        <Helmet title="Why Do You Support? - We Vote Campaigns" />
        <PageWrapperDefault cordova={isCordova()}>
          <ContentOuterWrapperDefault>
            <ContentInnerWrapperDefault>
              <CampaignSupportSteps
                atSharingStep
                campaignBasePath={this.getCampaignBasePath()}
                campaignXWeVoteId={campaignXWeVoteId}
              />
              {campaignPhoto && (
                <CampaignImage src={campaignPhoto} alt="Campaign" />
              )}
              <CampaignProcessStepTitle>
                {campaignProcessStepTitle}
              </CampaignProcessStepTitle>
              <CampaignProcessStepIntroductionText>
                {campaignProcessStepIntroductionText}
              </CampaignProcessStepIntroductionText>
              {showDirectMessageChoices ? (
                <CampaignSupportSectionWrapper>
                  <CampaignSupportSection>
                    <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                      <CampaignSupportDesktopButtonPanel>
                        <Button
                          classes={{ root: classes.buttonDesktop }}
                          color="primary"
                          id="copyLinkDesktop"
                          onClick={this.copyLink}
                          variant="contained"
                        >
                          Copy link
                        </Button>
                      </CampaignSupportDesktopButtonPanel>
                    </CampaignSupportDesktopButtonWrapper>
                    <CampaignSupportMobileButtonWrapper className="u-show-mobile">
                      <CampaignSupportMobileButtonPanel>
                        <Button
                          classes={{ root: classes.buttonDefault }}
                          color="primary"
                          id="copyLinkMobile"
                          onClick={this.copyLink}
                          variant="contained"
                        >
                          Copy link
                        </Button>
                      </CampaignSupportMobileButtonPanel>
                    </CampaignSupportMobileButtonWrapper>
                    <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                      <CampaignSupportDesktopButtonPanel>
                        <Button
                          classes={{ root: classes.buttonDesktop }}
                          color="primary"
                          id="shareOnTwitterDesktop"
                          onClick={this.shareOnTwitter}
                          variant="outlined"
                        >
                          Tweet to your followers
                        </Button>
                      </CampaignSupportDesktopButtonPanel>
                    </CampaignSupportDesktopButtonWrapper>
                    <CampaignSupportMobileButtonWrapper className="u-show-mobile">
                      <CampaignSupportMobileButtonPanel>
                        <Button
                          classes={{ root: classes.buttonDefault }}
                          color="primary"
                          id="shareOnTwitterMobile"
                          onClick={this.shareOnTwitter}
                          variant="outlined"
                        >
                          Tweet to your followers
                        </Button>
                      </CampaignSupportMobileButtonPanel>
                    </CampaignSupportMobileButtonWrapper>
                  </CampaignSupportSection>
                </CampaignSupportSectionWrapper>
              ) : (
                <CampaignSupportSectionWrapper>
                  <CampaignSupportSection>
                    <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                      <CampaignSupportDesktopButtonPanel>
                        <Button
                          classes={{ root: classes.buttonDesktop }}
                          color="primary"
                          id="shareOnFacebookDesktop"
                          onClick={this.shareOnFacebook}
                          variant="contained"
                        >
                          Share on Facebook
                        </Button>
                      </CampaignSupportDesktopButtonPanel>
                    </CampaignSupportDesktopButtonWrapper>
                    <CampaignSupportMobileButtonWrapper className="u-show-mobile">
                      <CampaignSupportMobileButtonPanel>
                        <Button
                          classes={{ root: classes.buttonDefault }}
                          color="primary"
                          id="shareOnFacebookMobile"
                          onClick={this.shareOnFacebook}
                          variant="contained"
                        >
                          Share on Facebook
                        </Button>
                      </CampaignSupportMobileButtonPanel>
                    </CampaignSupportMobileButtonWrapper>
                    <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                      <CampaignSupportDesktopButtonPanel>
                        <Button
                          classes={{ root: classes.buttonDesktop }}
                          color="primary"
                          id="shareOnTwitterDesktop"
                          onClick={this.shareOnTwitter}
                          variant="outlined"
                        >
                          Tweet to your followers
                        </Button>
                      </CampaignSupportDesktopButtonPanel>
                    </CampaignSupportDesktopButtonWrapper>
                    <CampaignSupportMobileButtonWrapper className="u-show-mobile">
                      <CampaignSupportMobileButtonPanel>
                        <Button
                          classes={{ root: classes.buttonDefault }}
                          color="primary"
                          id="shareOnTwitterMobile"
                          onClick={this.shareOnTwitter}
                          variant="outlined"
                        >
                          Tweet to your followers
                        </Button>
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
  showDirectMessageChoices: PropTypes.bool,
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

export default withStyles(styles)(CampaignSupportShare);
