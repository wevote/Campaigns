import loadable from '@loadable/component';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import CampaignNewsItemActions from '../../actions/CampaignNewsItemActions';
import commonMuiStyles from '../../common/components/Style/commonMuiStyles';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import politicianListToSentenceString from '../../common/utils/politicianListToSentenceString';
import CampaignNewsItemPublishSteps from '../../components/Navigation/CampaignNewsItemPublishSteps';
import { AdviceBox, AdviceBoxText, AdviceBoxTitle, AdviceBoxWrapper } from '../../common/components/Style/adviceBoxStyles';
import { CampaignImage, CampaignProcessStepIntroductionText, CampaignProcessStepTitle } from '../../components/Style/CampaignProcessStyles';
import { CampaignSupportDesktopButtonPanel, CampaignSupportDesktopButtonWrapper, CampaignSupportImageWrapper, CampaignSupportImageWrapperText, CampaignSupportMobileButtonPanel, CampaignSupportMobileButtonWrapper, CampaignSupportSection, CampaignSupportSectionWrapper, SkipForNowButtonPanel, SkipForNowButtonWrapper } from '../../components/Style/CampaignSupportStyles';
import { ContentInnerWrapperDefault, ContentOuterWrapperDefault, PageWrapperDefault } from '../../components/Style/PageWrapperStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignStore from '../../stores/CampaignStore';
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiersIfNeeded } from '../../utils/campaignUtils';
import initializejQuery from '../../utils/initializejQuery';
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
      dateSentToEmail: '',
      supportersCount: 0,
    };
  }

  componentDidMount () {
    // console.log('CampaignNewsItemSend componentDidMount');
    this.props.setShowHeaderFooter(false);
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
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
      dateSentToEmail: CampaignStore.getCampaignXNewsItemDateSentToEmail(campaignXNewsItemWeVoteId),
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
    window.scrollTo(0, 0);
  }

  componentDidUpdate () {
    this.leaveIfNotAllowedToEdit();
  }

  componentWillUnmount () {
    this.props.setShowHeaderFooter(true);
    this.appStateSubscription.unsubscribe();
    this.campaignStoreListener.remove();
  }

  onAppObservableStoreChange () {
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
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
      dateSentToEmail: CampaignStore.getCampaignXNewsItemDateSentToEmail(campaignXNewsItemWeVoteId),
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
    initializejQuery(() => {
      CampaignNewsItemActions.campaignNewsItemTextQueuedToSave(undefined);
    });
    historyPush(`${this.getCampaignBasePath()}/updates`);
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

  onCampaignNewsItemEditClick = () => {
    const { campaignXNewsItemWeVoteId } = this.state;
    historyPush(`${this.getCampaignBasePath()}/add-update/${campaignXNewsItemWeVoteId}`);
    return null;
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
    const { classes } = this.props;
    const {
      campaignPhotoLargeUrl, campaignSEOFriendlyPath, campaignTitle,
      campaignXNewsItemWeVoteId, campaignXPoliticianList, campaignXWeVoteId,
      chosenWebsiteName, dateSentToEmail, supportersCount,
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
        <PageWrapperDefault>
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
              {dateSentToEmail ? (
                <CampaignProcessStepTitle>
                  Publish update for your
                  {' '}
                  {supportersCount > 0 && (
                    <>
                      {numberWithCommas(supportersCount)}
                      {' '}
                    </>
                  )}
                  supporters now (without sending email)
                </CampaignProcessStepTitle>
              ) : (
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
              )}
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
                        disabled={Boolean(dateSentToEmail)}
                        id="saveCampaignNewsItemSend"
                        onClick={() => this.publishCampaignNewsItem(true)}
                        variant="contained"
                      >
                        {dateSentToEmail ? `Emailed ${dateSentToEmail}` : 'Send now'}
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
                        {dateSentToEmail ? 'Publish update' : 'Publish without sending'}
                      </Button>
                    </CampaignSupportDesktopButtonPanel>
                  </CampaignSupportDesktopButtonWrapper>
                  <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                    <CampaignSupportDesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="editNewsItem"
                        onClick={this.onCampaignNewsItemEditClick}
                        variant="outlined"
                      >
                        Edit
                      </Button>
                    </CampaignSupportDesktopButtonPanel>
                  </CampaignSupportDesktopButtonWrapper>
                  <CampaignSupportMobileButtonWrapper className="u-show-mobile">
                    <CampaignSupportMobileButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDefault }}
                        color="primary"
                        disabled={Boolean(dateSentToEmail)}
                        id="saveCampaignNewsItemSendMobile"
                        onClick={() => this.publishCampaignNewsItem(true)}
                        variant="contained"
                      >
                        {dateSentToEmail ? `Emailed ${dateSentToEmail}` : 'Send now'}
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
                        {dateSentToEmail ? 'Publish update' : 'Publish without sending'}
                      </Button>
                    </CampaignSupportMobileButtonPanel>
                    <CampaignSupportMobileButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDefault }}
                        color="primary"
                        id="editNewsItemMobile"
                        onClick={this.onCampaignNewsItemEditClick}
                        variant="outlined"
                      >
                        Edit
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
                          </>
                        )}
                        {' '}
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
                    <SkipForNowButtonPanel show>
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


export default withStyles(commonMuiStyles)(CampaignNewsItemSend);
