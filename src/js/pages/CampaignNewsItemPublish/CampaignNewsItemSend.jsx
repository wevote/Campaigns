import React, { Component, Suspense } from 'react';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import AppStore from '../../stores/AppStore';
import { AdviceBox, AdviceBoxText, AdviceBoxTitle, AdviceBoxWrapper } from '../../components/Style/AdviceBoxStyles';
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
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiersIfNeeded } from '../../utils/campaignUtils';
import CampaignNewsItemActions from '../../actions/CampaignNewsItemActions';
import CampaignNewsItemPublishSteps from '../../components/Navigation/CampaignNewsItemPublishSteps';
import { historyPush, isCordova } from '../../utils/cordovaUtils';
import initializejQuery from '../../utils/initializejQuery';
import politicianListToSentenceString from '../../utils/politicianListToSentenceString';
import { ContentInnerWrapperDefault, ContentOuterWrapperDefault, PageWrapperDefault } from '../../components/Style/PageWrapperStyles';
import { renderLog } from '../../utils/logging';
import { numberWithCommas } from '../../utils/textFormat';

const CampaignRetrieveController = React.lazy(() => import('../../components/Campaign/CampaignRetrieveController'));
const VoterFirstRetrieveController = loadable(() => import('../../components/Settings/VoterFirstRetrieveController'));


class CampaignNewsItemSend extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignPhotoLargeUrl: '',
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXWeVoteId: '',
      chosenWebsiteName: '',
      supportersCount: 0,
    };
  }

  componentDidMount () {
    // console.log('CampaignNewsItemSend componentDidMount');
    this.props.setShowHeaderFooter(false);
    this.onAppStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
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
      campaignXPoliticianList,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignPhotoLargeUrl,
      campaignXNewsItemWeVoteId,
      campaignXPoliticianList,
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
    // Take the "calculated" identifiers and retrieve if missing
    retrieveCampaignXFromIdentifiersIfNeeded(campaignSEOFriendlyPath, campaignXWeVoteId);
  }

  componentDidUpdate () {
    this.leaveIfNotAllowedToEdit();
  }

  componentWillUnmount () {
    this.props.setShowHeaderFooter(true);
    this.appStoreListener.remove();
    this.campaignStoreListener.remove();
  }

  onAppStoreChange () {
    const chosenWebsiteName = AppStore.getChosenWebsiteName();
    // For now, we assume that paid sites with chosenSiteLogoUrl will turn off "Chip in"
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
    const {
      campaignPhotoLargeUrl,
      campaignSEOFriendlyPath,
      campaignTitle,
      campaignXPoliticianList,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignPhotoLargeUrl,
      campaignTitle,
      campaignXNewsItemWeVoteId,
      campaignXPoliticianList,
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
      const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
      const {
        supporters_count: supportersCount,
      } = campaignX;
      this.setState({
        campaignXWeVoteId,
        supportersCount,
      });
    } else if (campaignXWeVoteIdFromParams) {
      const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
      const {
        supporters_count: supportersCount,
      } = campaignX;
      this.leaveIfNotAllowedToEdit(campaignXWeVoteIdFromParams);
      this.setState({
        campaignXWeVoteId: campaignXWeVoteIdFromParams,
        supportersCount,
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

  clickCancel = () => {
    const { campaignXNewsItemWeVoteId } = this.state;
    initializejQuery(() => {
      CampaignNewsItemActions.campaignNewsItemTextQueuedToSave(undefined);
    });
    if (campaignXNewsItemWeVoteId) {
      // TODO: historyPush(`${this.getCampaignBasePath()}/update/${campaignXNewsItemWeVoteId}`);
      historyPush(`${this.getCampaignBasePath()}/updates`);
    } else {
      historyPush(`${this.getCampaignBasePath()}/updates`);
    }
  }

  publishCampaignNewsItem = (sendNow = false) => {
    const { campaignXNewsItemWeVoteId, campaignXWeVoteId } = this.state;
    if (campaignXNewsItemWeVoteId) {
      // console.log('CampaignNewsItemSend, publishCampaignNewsItem:', campaignXNewsItemWeVoteId, ', sendNow:', sendNow);
      initializejQuery(() => {
        CampaignNewsItemActions.campaignNewsItemPublish(campaignXWeVoteId, campaignXNewsItemWeVoteId, sendNow);
      });
      historyPush(`${this.getCampaignBasePath()}/share/${campaignXNewsItemWeVoteId}`);
    }
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
    renderLog('CampaignNewsItemSend');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignNewsItemSend window.location.href: ${window.location.href}`);
    }
    const { classes } = this.props;
    const {
      campaignPhotoLargeUrl, campaignSEOFriendlyPath, campaignTitle,
      campaignXNewsItemWeVoteId, campaignXPoliticianList, campaignXWeVoteId,
      chosenWebsiteName, supportersCount,
    } = this.state;
    const htmlTitle = `Send update to supporters ${campaignTitle}? - ${chosenWebsiteName}`;
    let numberOfPoliticians = 0;
    if (campaignXPoliticianList && campaignXPoliticianList.length) {
      numberOfPoliticians = campaignXPoliticianList.length;
    }
    const politicianListSentenceString = politicianListToSentenceString(campaignXPoliticianList);
    return (
      <div>
        <Helmet title={htmlTitle} />
        <PageWrapperDefault cordova={isCordova()}>
          <ContentOuterWrapperDefault>
            <ContentInnerWrapperDefault>
              <CampaignNewsItemPublishSteps
                atStepNumber3
                campaignBasePath={this.getCampaignBasePath()}
                campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId}
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
                Send to
                {' '}
                {supportersCount > 0 && (
                  <>
                    {numberWithCommas(supportersCount)}
                    {' '}
                  </>
                )}
                supporters now, or publish without sending
              </CampaignProcessStepTitle>
              <CampaignProcessStepIntroductionText>
                Update created? Check. Update previewed? Check.
              </CampaignProcessStepIntroductionText>
              <CampaignSupportSectionWrapper>
                <CampaignSupportSection>
                  <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                    <CampaignSupportDesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        disabled
                        id="saveCampaignNewsItemSend"
                        onClick={() => this.publishCampaignNewsItem(true)}
                        variant="contained"
                      >
                        Send now (Coming Soon)
                      </Button>
                    </CampaignSupportDesktopButtonPanel>
                  </CampaignSupportDesktopButtonWrapper>
                  <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                    <CampaignSupportDesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="publishWithoutSendingDesktop"
                        onClick={() => this.publishCampaignNewsItem(false)}
                        variant="outlined"
                      >
                        Publish without sending
                      </Button>
                    </CampaignSupportDesktopButtonPanel>
                  </CampaignSupportDesktopButtonWrapper>
                  <CampaignSupportMobileButtonWrapper className="u-show-mobile">
                    <CampaignSupportMobileButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDefault }}
                        color="primary"
                        disabled
                        id="saveCampaignNewsItemSendMobile"
                        onClick={() => this.publishCampaignNewsItem(true)}
                        variant="contained"
                      >
                        Send now (Coming Soon)
                      </Button>
                    </CampaignSupportMobileButtonPanel>
                    <CampaignSupportMobileButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDefault }}
                        color="primary"
                        id="publishWithoutSendingMobile"
                        onClick={() => this.publishCampaignNewsItem(false)}
                        variant="outlined"
                      >
                        Publish without sending
                      </Button>
                    </CampaignSupportMobileButtonPanel>
                  </CampaignSupportMobileButtonWrapper>
                  <AdviceBoxWrapper>
                    <AdviceBox>
                      <AdviceBoxTitle>
                        You can only send an email update every three days
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        One email will be sent to each of your supporters within 30 minutes of clicking &apos;Send now&apos;. We don&apos;t want to overwhelm your supporters, so only one update can be sent every three days.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Publish as many updates as you would like
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        While you can only send an email once every three days, you may post as many updates
                        {numberOfPoliticians > 0 && (
                          <>
                            {' '}
                            about
                            {' '}
                            {politicianListSentenceString}
                            {' '}
                          </>
                        )}
                        as you would like on your campaign web page. All updates, whether emailed or not, appear in the updates section.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Share this update directly with friends
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Once you &apos;Send now&apos; or &apos;Publish without sending&apos;, you will be able to share this update far-and-wide.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Thank you!
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Caring about American Democracy has never been more important. Thank you for doing your part to encourage more Americans to vote.
                      </AdviceBoxText>
                    </AdviceBox>
                  </AdviceBoxWrapper>
                  <SkipForNowButtonWrapper>
                    <SkipForNowButtonPanel>
                      <Button
                        classes={{ root: classes.buttonSimpleLink }}
                        color="primary"
                        id="cancelCampaignNewsItemSend"
                        onClick={this.clickCancel}
                      >
                        Cancel
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
CampaignNewsItemSend.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  setShowHeaderFooter: PropTypes.func,
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

export default withStyles(styles)(CampaignNewsItemSend);