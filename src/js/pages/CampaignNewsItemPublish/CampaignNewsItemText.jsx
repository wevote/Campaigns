import loadable from '@loadable/component';
import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import CampaignNewsItemActions from '../../actions/CampaignNewsItemActions';
import VoterActions from '../../actions/VoterActions';
import VoterPhotoUpload from '../../common/components/Settings/VoterPhotoUpload';
import { AdviceBox, AdviceBoxText, AdviceBoxTitle, AdviceBoxWrapper } from '../../common/components/Style/adviceBoxStyles';
import commonMuiStyles from '../../common/components/Style/commonMuiStyles';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import politicianListToSentenceString from '../../common/utils/politicianListToSentenceString';
import CampaignNewsItemTextInputField from '../../components/CampaignNewsItemPublish/CampaignNewsItemTextInputField';
import CampaignNewsItemPublishSteps from '../../components/Navigation/CampaignNewsItemPublishSteps';
import { CampaignImage, CampaignProcessStepIntroductionText, CampaignProcessStepTitle } from '../../components/Style/CampaignProcessStyles';
import { CampaignSupportDesktopButtonPanel, CampaignSupportDesktopButtonWrapper, CampaignSupportImageWrapper, CampaignSupportImageWrapperText, CampaignSupportMobileButtonPanel, CampaignSupportMobileButtonWrapper, CampaignSupportSection, CampaignSupportSectionWrapper, SkipForNowButtonPanel, SkipForNowButtonWrapper } from '../../components/Style/CampaignSupportStyles';
import { ContentInnerWrapperDefault, ContentOuterWrapperDefault, PageWrapperDefault } from '../../components/Style/PageWrapperStyles';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import CampaignNewsItemStore from '../../stores/CampaignNewsItemStore';
import CampaignStore from '../../common/stores/CampaignStore';
import VoterStore from '../../stores/VoterStore';
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiersIfNeeded } from '../../utils/campaignUtils';
import initializejQuery from '../../common/utils/initializejQuery';

const CampaignRetrieveController = React.lazy(() => import(/* webpackChunkName: 'CampaignRetrieveController' */ '../../components/Campaign/CampaignRetrieveController'));
const VoterFirstRetrieveController = loadable(() => import(/* webpackChunkName: 'VoterFirstRetrieveController' */ '../../components/Settings/VoterFirstRetrieveController'));


class CampaignNewsItemText extends Component {
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
    // console.log('CampaignNewsItemText componentDidMount');
    this.props.setShowHeaderFooter(false);
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.campaignNewsItemStoreListener = CampaignNewsItemStore.addListener(this.onCampaignNewsItemStoreChange.bind(this));
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
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
    window.scrollTo(0, 0);
  }

  componentDidUpdate () {
    this.leaveIfNotAllowedToEdit();
  }

  componentWillUnmount () {
    this.props.setShowHeaderFooter(true);
    this.appStateSubscription.unsubscribe();
    this.campaignNewsItemStoreListener.remove();
    this.campaignStoreListener.remove();
    this.voterStoreListener.remove();
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
  }

  onCampaignNewsItemStoreChange () {
    const { campaignXNewsItemWeVoteId } = this.state;
    const mostRecentlySavedCampaignXNewsItemWeVoteId = CampaignNewsItemStore.getMostRecentlySavedCampaignXNewsItemWeVoteId();
    if (mostRecentlySavedCampaignXNewsItemWeVoteId && mostRecentlySavedCampaignXNewsItemWeVoteId !== campaignXNewsItemWeVoteId) {
      historyPush(`${this.getCampaignBasePath()}/u-preview/${mostRecentlySavedCampaignXNewsItemWeVoteId}`);
    }
  }

  onVoterStoreChange () {
    const voterPhotoUrlLarge = VoterStore.getVoterPhotoUrlLarge();
    this.setState({
      voterPhotoUrlLarge,
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

  submitCampaignNewsItemText = () => {
    const { campaignXNewsItemWeVoteId, campaignXWeVoteId } = this.state;
    if (campaignXWeVoteId) {
      const campaignNewsItemSubjectQueuedToSave = CampaignNewsItemStore.getCampaignNewsItemSubjectQueuedToSave();
      const campaignNewsItemSubjectQueuedToSaveSet = CampaignNewsItemStore.getCampaignNewsItemSubjectQueuedToSaveSet();
      const campaignNewsItemTextQueuedToSave = CampaignNewsItemStore.getCampaignNewsItemTextQueuedToSave();
      const campaignNewsItemTextQueuedToSaveSet = CampaignNewsItemStore.getCampaignNewsItemTextQueuedToSaveSet();
      // console.log('CampaignNewsItemText, campaignNewsItemTextQueuedToSave:', campaignNewsItemTextQueuedToSave);
      initializejQuery(() => {
        CampaignNewsItemActions.campaignNewsItemTextSave(campaignXWeVoteId, campaignXNewsItemWeVoteId, campaignNewsItemSubjectQueuedToSave, campaignNewsItemSubjectQueuedToSaveSet, campaignNewsItemTextQueuedToSave, campaignNewsItemTextQueuedToSaveSet);
        CampaignNewsItemActions.campaignNewsItemTextQueuedToSave(undefined);
      });
      const voterPhotoQueuedToSave = VoterStore.getVoterPhotoQueuedToSave();
      const voterPhotoQueuedToSaveSet = VoterStore.getVoterPhotoQueuedToSaveSet();
      if (voterPhotoQueuedToSaveSet) {
        initializejQuery(() => {
          VoterActions.voterPhotoSave(voterPhotoQueuedToSave, voterPhotoQueuedToSaveSet);
          VoterActions.voterPhotoQueuedToSave(undefined);
        });
      }
      initializejQuery(() => {
        CampaignNewsItemActions.campaignNewsItemTextQueuedToSave(undefined);
      });
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
    renderLog('CampaignNewsItemText');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      campaignPhotoLargeUrl, campaignSEOFriendlyPath, campaignTitle,
      campaignXNewsItemWeVoteId, campaignXPoliticianList, campaignXWeVoteId, chosenWebsiteName,
      voterPhotoUrlLarge,
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
                atStepNumber1
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
                Send update to campaign supporters
              </CampaignProcessStepTitle>
              <CampaignProcessStepIntroductionText>
                Supporters
                {numberOfPoliticians > 0 && (
                  <>
                    {' '}
                    of
                    {' '}
                    {politicianListSentenceString}
                  </>
                )}
                {' '}
                would love to hear good news about
                {' '}
                {numberOfPoliticians > 1 ? (
                  <>these candidates&apos;</>
                ) : (
                  <>this candidate&apos;s</>
                )}
                {' '}
                progress towards winning.
              </CampaignProcessStepIntroductionText>
              <CampaignSupportSectionWrapper>
                <CampaignSupportSection>
                  <CampaignNewsItemTextInputField
                    campaignXWeVoteId={campaignXWeVoteId}
                    campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId}
                  />
                  { !voterPhotoUrlLarge && <VoterPhotoUpload /> }
                  <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                    <CampaignSupportDesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="saveCampaignNewsItemText"
                        onClick={this.submitCampaignNewsItemText}
                        variant="contained"
                      >
                        Save and preview
                      </Button>
                    </CampaignSupportDesktopButtonPanel>
                  </CampaignSupportDesktopButtonWrapper>
                  <CampaignSupportMobileButtonWrapper className="u-show-mobile">
                    <CampaignSupportMobileButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDefault }}
                        color="primary"
                        id="saveCampaignNewsItemTextMobile"
                        onClick={this.submitCampaignNewsItemText}
                        variant="contained"
                      >
                        Save and preview
                      </Button>
                    </CampaignSupportMobileButtonPanel>
                  </CampaignSupportMobileButtonWrapper>
                  <AdviceBoxWrapper>
                    <AdviceBox>
                      <AdviceBoxTitle>
                        Supporters have already agreed to vote for your candidate(s)
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Share good news to help people remember to vote, but don&apos;t overwhelm them with more reasons to support candidate(s) they already plan to vote for.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Don&apos;t ask for donations
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Many people are turned away from politics by what they consider to be excessive requests for donations. Support
                        {' '}
                        {politicianListSentenceString}
                        {' '}
                        here with votes, and use other venues for fundraising.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Make it personal
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Make it clear why you care.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Respect others
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Don’t bully, use hate speech, threaten violence or make things up.
                      </AdviceBoxText>
                    </AdviceBox>
                  </AdviceBoxWrapper>
                  <SkipForNowButtonWrapper>
                    <SkipForNowButtonPanel show>
                      <Button
                        classes={{ root: classes.buttonSimpleLink }}
                        color="primary"
                        id="cancelCampaignNewsItemText"
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
CampaignNewsItemText.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  setShowHeaderFooter: PropTypes.func,
};


export default withStyles(commonMuiStyles)(CampaignNewsItemText);
