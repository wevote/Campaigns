import React, { Component, Suspense } from 'react';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { Done } from '@material-ui/icons';
// import {
//   AdviceBox, AdviceBoxText, AdviceBoxTitle,
//   AdviceBoxWrapper,
// } from '../../components/Style/AdviceBoxStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import arrayContains from '../../common/utils/arrayContains';
import {
  CampaignImage, CampaignProcessStepIntroductionText, CampaignProcessStepTitle,
} from '../../components/Style/CampaignProcessStyles';
import {
  CampaignSupportDesktopButtonPanel, CampaignSupportDesktopButtonWrapper,
  CampaignSupportImageWrapper, CampaignSupportImageWrapperText,
  CampaignSupportSection, CampaignSupportSectionWrapper,
  SkipForNowButtonPanel, SkipForNowButtonWrapper,
} from '../../components/Style/CampaignSupportStyles';
import CampaignStore from '../../stores/CampaignStore';
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiersIfNeeded } from '../../utils/campaignUtils';
import SuperSharingSteps from '../../components/Navigation/SuperSharingSteps';
import historyPush from '../../utils/historyPush';
import initializejQuery from '../../utils/initializejQuery';
import LoadMoreItemsManually from '../../components/Widgets/LoadMoreItemsManually';
import { ContentInnerWrapperDefault, ContentOuterWrapperDefault, PageWrapperDefault } from '../../components/Style/PageWrapperStyles';
import { renderLog } from '../../utils/logging';
import { shortenText } from '../../utils/textFormat';
import removeValueFromArray from '../../common/utils/removeValueFromArray';
import ShareActions from '../../common/actions/ShareActions';
import ShareStore from '../../common/stores/ShareStore';
import VoterActions from '../../actions/VoterActions';
import VoterStore from '../../stores/VoterStore';

const NUMBER_OF_RECIPIENTS_TO_ADD_WHEN_MORE_CLICKED = 25;
const STARTING_NUMBER_OF_RECIPIENTS_TO_DISPLAY = 15;

const CampaignRetrieveController = React.lazy(() => import('../../components/Campaign/CampaignRetrieveController'));
const VoterFirstRetrieveController = loadable(() => import('../../components/Settings/VoterFirstRetrieveController'));


class SuperSharingChooseRecipients extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignPhotoLargeUrl: '',
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXNewsItemWeVoteId: '',
      campaignXWeVoteId: '',
      chosenWebsiteName: '',
      numberOfRecipientsToDisplay: STARTING_NUMBER_OF_RECIPIENTS_TO_DISPLAY,
      recipientEmailsChosen: [], // List of recipient email addresses lower case
    };
  }

  componentDidMount () {
    // console.log('SuperSharingChooseRecipients componentDidMount');
    this.props.setShowHeaderFooter(false);
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.onShareStoreChange();
    this.shareStoreListener = ShareStore.addListener(this.onShareStoreChange.bind(this));
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
      // campaignXPoliticianList,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignPhotoLargeUrl,
      campaignXNewsItemWeVoteId,
      // campaignXPoliticianList,
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
    initializejQuery(() => {
      VoterActions.voterContactListRetrieve();
    });
    window.scrollTo(0, 0);
  }

  componentDidUpdate (prevProps, prevState) {
    const {
      campaignXWeVoteId,
    } = this.state;
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevState;
    // console.log('CampaignNewsItemDetailsPage componentDidUpdate, campaignXWeVoteId:', campaignXWeVoteId, ', campaignXWeVoteIdPrevious:', campaignXWeVoteIdPrevious);
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        const superShareItemId = ShareStore.getSuperSharedItemDraftIdByWeVoteId(campaignXWeVoteId);
        if (!superShareItemId || superShareItemId === 0) {
          initializejQuery(() => {
            ShareActions.superShareItemRetrieve(campaignXWeVoteId);
          });
        } else {
          this.onShareStoreChange();
        }
      }
    }
  }

  componentWillUnmount () {
    this.props.setShowHeaderFooter(true);
    this.appStateSubscription.unsubscribe();
    this.campaignStoreListener.remove();
    this.shareStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
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
      // campaignXPoliticianList,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignPhotoLargeUrl,
      campaignTitle,
      // campaignXPoliticianList,
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

  onShareStoreChange () {
    // console.log('SuperSharingChooseRecipients onShareStoreChange');
    const { campaignXWeVoteId } = this.state;
    const superShareItemId = ShareStore.getSuperSharedItemDraftIdByWeVoteId(campaignXWeVoteId);
    if (superShareItemId) {
      const emailRecipientList = ShareStore.getEmailRecipientList(superShareItemId);
      // console.log('SuperSharingChooseRecipients onShareStoreChange emailRecipientList:', emailRecipientList);
      const emailRecipientListQueuedToSave = ShareStore.getEmailRecipientListQueuedToSave(superShareItemId);
      const emailRecipientListQueuedToSaveSet = ShareStore.getEmailRecipientListQueuedToSaveSet(superShareItemId);
      let emailRecipientListAdjusted = emailRecipientList;
      if (emailRecipientListQueuedToSaveSet) {
        emailRecipientListAdjusted = emailRecipientListQueuedToSave;
      }
      this.setState({
        recipientEmailsChosen: emailRecipientListAdjusted,
      });
    }
  }

  onVoterStoreChange () {
    const { numberOfRecipientsToDisplay } = this.state;
    const voterContactEmailList = VoterStore.getVoterContactEmailList();
    const voterContactEmailListCount = voterContactEmailList.length;
    const voterContactEmailListFiltered = voterContactEmailList.slice(0, numberOfRecipientsToDisplay);
    this.setState({
      voterContactEmailListCount,
      voterContactEmailListFiltered,
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
    const { campaignXNewsItemWeVoteId } = this.state;
    if (campaignXNewsItemWeVoteId) {
      historyPush(`${this.getCampaignBasePath()}/super-sharing-compose-email/${campaignXNewsItemWeVoteId}`);
    } else {
      historyPush(`${this.getCampaignBasePath()}/super-sharing-compose-email`);
    }
  }

  increaseNumberOfRecipientsToDisplay = () => {
    let { numberOfRecipientsToDisplay } = this.state;
    numberOfRecipientsToDisplay += NUMBER_OF_RECIPIENTS_TO_ADD_WHEN_MORE_CLICKED;
    this.setState({
      numberOfRecipientsToDisplay,
    }, () => this.onVoterStoreChange());
  }

  onClickAddContacts = () => {
    const { campaignXNewsItemWeVoteId } = this.state;
    if (campaignXNewsItemWeVoteId) {
      historyPush(`${this.getCampaignBasePath()}/super-sharing-add-email-contacts/${campaignXNewsItemWeVoteId}`);
    } else {
      historyPush(`${this.getCampaignBasePath()}/super-sharing-add-email-contacts`);
    }
  }

  onClickSelectContact = (recipientEmail) => {
    if (!recipientEmail) return false;
    const recipientEmailLowerCase = recipientEmail.toLowerCase();
    const { campaignXWeVoteId } = this.state;
    let { recipientEmailsChosen } = this.state;
    const superShareItemId = ShareStore.getSuperSharedItemDraftIdByWeVoteId(campaignXWeVoteId);
    if (arrayContains(recipientEmailLowerCase, recipientEmailsChosen)) {
      // Remove
      recipientEmailsChosen = removeValueFromArray(recipientEmailLowerCase, recipientEmailsChosen);
      ShareActions.emailRecipientListQueuedToSave(superShareItemId, '', recipientEmailLowerCase, false);
    } else {
      // Add
      recipientEmailsChosen.push(recipientEmailLowerCase);
      ShareActions.emailRecipientListQueuedToSave(superShareItemId, recipientEmailLowerCase, '', false);
    }
    this.setState({
      recipientEmailsChosen,
    });
    return true;
  }

  recipientEmailHasBeenChosen = (recipientEmail) => {
    if (!recipientEmail) return false;
    const { recipientEmailsChosen } = this.state;
    const recipientEmailLowerCase = recipientEmail.toLowerCase();
    return arrayContains(recipientEmailLowerCase, recipientEmailsChosen);
  }

  returnToOtherSharingOptions = () => {
    historyPush(`${this.getCampaignBasePath()}/share-campaign`);
  }

  submitSkipForNow = () => {
    this.goToNextStep();
  }

  submitChooseRecipients = () => {
    const { campaignXWeVoteId } = this.state;
    const superShareItemId = ShareStore.getSuperSharedItemDraftIdByWeVoteId(campaignXWeVoteId);
    if (superShareItemId) {
      const emailRecipientListQueuedToSave = ShareStore.getEmailRecipientListQueuedToSave(superShareItemId);
      const emailRecipientListQueuedToSaveSet = ShareStore.getEmailRecipientListQueuedToSaveSet(superShareItemId);
      // console.log('SuperSharingChooseRecipients, emailRecipientListQueuedToSave:', emailRecipientListQueuedToSave);
      initializejQuery(() => {
        const emailRecipientListQueuedToSaveSerialized = JSON.stringify(emailRecipientListQueuedToSave);
        ShareActions.superShareItemEmailRecipientListSave(campaignXWeVoteId, '', emailRecipientListQueuedToSaveSerialized, emailRecipientListQueuedToSaveSet);
        ShareActions.emailRecipientListQueuedToSave(superShareItemId, '', '', true);
      });
    }
    if (campaignXWeVoteId) {
      this.goToNextStep();
    }
  }

  render () {
    renderLog('SuperSharingChooseRecipients');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      campaignPhotoLargeUrl, campaignSEOFriendlyPath, campaignTitle,
      campaignXNewsItemWeVoteId,
      campaignXWeVoteId, chosenWebsiteName,
      numberOfRecipientsToDisplay, recipientEmailsChosen,
      voterContactEmailListFiltered, voterContactEmailListCount,
    } = this.state;
    const htmlTitle = `Choose Recipients for ${campaignTitle}? - ${chosenWebsiteName}`;
    // let numberOfPoliticians = 0;
    // if (campaignXPoliticianList && campaignXPoliticianList.length) {
    //   numberOfPoliticians = campaignXPoliticianList.length;
    // }
    // const politicianListSentenceString = politicianListToSentenceString(campaignXPoliticianList);
    return (
      <div>
        <Helmet title={htmlTitle} />
        <PageWrapperDefault>
          <ContentOuterWrapperDefault>
            <ContentInnerWrapperDefault>
              <SuperSharingSteps
                atStepNumber2
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
                Choose recipients
              </CampaignProcessStepTitle>
              {(voterContactEmailListCount > 0) ? (
                <CampaignProcessStepIntroductionText>
                  Who do you want to invite to this campaign right now?
                </CampaignProcessStepIntroductionText>
              ) : (
                <CampaignProcessStepIntroductionText>
                  When you import your contacts, you will be able to choose recipients like in this sample list.
                </CampaignProcessStepIntroductionText>
              )}
              {(voterContactEmailListCount > 0) && (
                <CampaignSupportSectionWrapper>
                  <CampaignSupportSection marginBottomOff>
                    {voterContactEmailListFiltered.map((voterContactEmail) => (
                      <ContactOuterWrapper
                        key={`contact${voterContactEmail.email_address_text}`}
                        onClick={() => this.onClickSelectContact(voterContactEmail.email_address_text)}
                      >
                        <ContactNameWrapper>
                          <ContactDisplayName>
                            <span className="u-show-mobile">
                              {shortenText(voterContactEmail.google_display_name, 22)}
                            </span>
                            <span className="u-show-desktop-tablet">
                              {shortenText(voterContactEmail.google_display_name, 40)}
                            </span>
                          </ContactDisplayName>
                          <ContactDisplayEmail>
                            <span className="u-show-mobile">
                              {shortenText(voterContactEmail.email_address_text, 25)}
                            </span>
                            <span className="u-show-desktop-tablet">
                              {shortenText(voterContactEmail.email_address_text, 50)}
                            </span>
                          </ContactDisplayEmail>
                        </ContactNameWrapper>
                        <ContactSelectWrapper>
                          <ContactFilterWrapper>
                            {/* Virginia */}
                          </ContactFilterWrapper>
                          <ContactSelectCheckWrapper>
                            <StepWrapper>
                              <StepCircle
                                className="u-cursor--pointer"
                                inverseColor={this.recipientEmailHasBeenChosen(voterContactEmail.email_address_text)}
                              >
                                {this.recipientEmailHasBeenChosen(voterContactEmail.email_address_text) ? (
                                  <CheckmarkWrapper inverseColor>
                                    <Done classes={{ root: classes.doneIcon }} />
                                  </CheckmarkWrapper>
                                ) : (
                                  <CheckmarkWrapper>
                                    <Done classes={{ root: classes.doneIcon }} />
                                  </CheckmarkWrapper>
                                )}
                              </StepCircle>
                            </StepWrapper>
                          </ContactSelectCheckWrapper>
                        </ContactSelectWrapper>
                      </ContactOuterWrapper>
                    ))}
                  </CampaignSupportSection>
                </CampaignSupportSectionWrapper>
              )}
              <LoadMoreItemsManuallyWrapper>
                {!!(voterContactEmailListCount > 0 &&
                    numberOfRecipientsToDisplay < voterContactEmailListCount) &&
                (
                  <LoadMoreItemsManually
                    loadMoreFunction={this.increaseNumberOfRecipientsToDisplay}
                    loadMoreText="Show more contacts"
                    uniqueExternalId="SuperSharingChooseRecipientsMore"
                  />
                )}
              </LoadMoreItemsManuallyWrapper>
              <CampaignSupportSectionWrapper>
                <CampaignSupportSection>
                  <DesktopActionSpacer className="u-show-desktop-tablet" />
                  {(voterContactEmailListCount > 0) ? (
                    <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                      <CampaignSupportDesktopButtonPanel>
                        <Button
                          classes={{ root: classes.buttonDesktop }}
                          color="primary"
                          id="submitChooseRecipientsDesktop"
                          onClick={this.submitChooseRecipients}
                          variant="contained"
                        >
                          Continue to personalize message
                        </Button>
                      </CampaignSupportDesktopButtonPanel>
                    </CampaignSupportDesktopButtonWrapper>
                  ) : (
                    <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                      <CampaignSupportDesktopButtonPanel>
                        <Button
                          classes={{ root: classes.buttonDesktop }}
                          color="primary"
                          id="onClickAddContacts"
                          onClick={this.onClickAddContacts}
                          variant="outlined"
                        >
                          Go back and add contacts
                        </Button>
                      </CampaignSupportDesktopButtonPanel>
                    </CampaignSupportDesktopButtonWrapper>
                  )}
                  {/* <AdviceBoxWrapper> */}
                  {/*  <AdviceBox> */}
                  {/*    <AdviceBoxTitle> */}
                  {/*      Ignore contacts you won&apos;t discuss politics with */}
                  {/*    </AdviceBoxTitle> */}
                  {/*    <AdviceBoxText> */}
                  {/*      By clicking the &quot;ignore&quot; link next to a friend&apos;s name, they will be hidden from this page. */}
                  {/*    </AdviceBoxText> */}
                  {/*  </AdviceBox> */}
                  {/* </AdviceBoxWrapper> */}
                  <SkipForNowButtonWrapper>
                    <SkipForNowButtonPanel show>
                      <Button
                        classes={{ root: classes.buttonSimpleLink }}
                        color="primary"
                        id="skipSuperSharingChooseRecipients"
                        onClick={this.submitSkipForNow}
                      >
                        {(recipientEmailsChosen.length > 0) ? 'Cancel selections' : 'Skip for now'}
                      </Button>
                    </SkipForNowButtonPanel>
                  </SkipForNowButtonWrapper>
                  <SkipForNowButtonWrapper>
                    <SkipForNowButtonPanel show>
                      <Button
                        classes={{ root: classes.buttonSimpleLink }}
                        color="primary"
                        id="returnToOtherSharing"
                        onClick={this.returnToOtherSharingOptions}
                      >
                        Return to other sharing options
                      </Button>
                    </SkipForNowButtonPanel>
                  </SkipForNowButtonWrapper>
                  <BottomOfPageSpacer />
                </CampaignSupportSection>
              </CampaignSupportSectionWrapper>
            </ContentInnerWrapperDefault>
          </ContentOuterWrapperDefault>
        </PageWrapperDefault>
        <ButtonFooterWrapper className="u-show-mobile">
          <ButtonPanel>
            {(voterContactEmailListCount > 0) ? (
              <Button
                classes={{ root: classes.buttonDefault }}
                color="primary"
                id="submitChooseRecipientsMobile"
                onClick={this.submitChooseRecipients}
                variant="contained"
              >
                Continue to message
              </Button>
            ) : (
              <Button
                classes={{ root: classes.buttonDefault }}
                color="primary"
                id="onClickAddContactsMobile"
                onClick={this.onClickAddContacts}
                variant="outlined"
              >
                Go back and add contacts
              </Button>
            )}
          </ButtonPanel>
        </ButtonFooterWrapper>
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
SuperSharingChooseRecipients.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  setShowHeaderFooter: PropTypes.func,
};

const styles = (theme) => ({
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
    padding: '0 24px',
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
  doneIcon: {
    fontSize: 28,
    [theme.breakpoints.down('lg')]: {
      fontSize: 28,
    },
    paddingTop: '5px',
  },
});

const BottomOfPageSpacer = styled.div`
  margin-bottom: 150px;
`;

const ButtonFooterWrapper = styled.div`
  position: fixed;
  width: 100%;
  bottom: 0;
  display: block;
`;

const ButtonPanel = styled.div`
  background-color: #fff;
  border-top: 1px solid #ddd;
  padding: 10px;
`;

const ContactDisplayEmail = styled.div`
  font-size: 0.8em;
  text-overflow: ellipsis;
`;

const ContactDisplayName = styled.div`
  text-overflow: ellipsis;
`;

const ContactFilterWrapper = styled.div`
  font-size: 0.8em;
  margin-right: 4px;
`;

const ContactNameWrapper = styled.div`
`;

const ContactOuterWrapper = styled.div`
  align-items: center;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
`;

const ContactSelectCheckWrapper = styled.div`
`;

const ContactSelectWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
`;

const DesktopActionSpacer = styled.div`
  margin-top: 35px;
`;

const LoadMoreItemsManuallyWrapper = styled.div`
  margin-bottom: 0px;
  @media print{
    display: none;
  }
`;

const StepCircle = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  background: ${(props) => (props.inverseColor ? props.theme.colors.brandBlue : 'white')};
  border: 1px solid ${(props) => (props.inverseColor ? props.theme.colors.brandBlue : '#BEBEBE')};
  border-radius: 18px;
  width: 30px;
  height: 30px;
`;

const CheckmarkWrapper = styled.div`
  color: ${(props) => (props.inverseColor ? 'white' : '#E8E8E8')};
  font-size: 16px;
  font-weight: 600;
  margin-top: -2px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 14px;
  }
`;

const StepWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  width: 60px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 50px;
  }
`;

export default withStyles(styles)(SuperSharingChooseRecipients);
