import React, { Component, Suspense } from 'react';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
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
import CampaignSupporterActions from '../../actions/CampaignSupporterActions';
import CampaignSupportSteps from '../../components/Navigation/CampaignSupportSteps';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import CampaignEndorsementInputField from '../../components/CampaignSupport/CampaignEndorsementInputField';
import { historyPush, isCordova } from '../../utils/cordovaUtils';
import initializejQuery from '../../utils/initializejQuery';
import politicianListToSentenceString from '../../utils/politicianListToSentenceString';
import { ContentInnerWrapperDefault, ContentOuterWrapperDefault, PageWrapperDefault } from '../../components/Style/PageWrapperStyles';
import { renderLog } from '../../utils/logging';

const CampaignRetrieveController = React.lazy(() => import('../../components/Campaign/CampaignRetrieveController'));
const VisibleToPublicCheckbox = React.lazy(() => import('../../components/CampaignSupport/VisibleToPublicCheckbox'));
const VoterFirstRetrieveController = loadable(() => import('../../components/Settings/VoterFirstRetrieveController'));


class CampaignSupportEndorsement extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignPhoto: '',
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXWeVoteId: '',
      payToPromoteStepTurnedOn: true,
    };
  }

  componentDidMount () {
    // console.log('CampaignSupportEndorsement componentDidMount');
    this.props.setShowHeaderFooter(false);
    this.onAppStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams, campaignXWeVoteId: campaignXWeVoteIdFromParams } = params;
    // console.log('componentDidMount campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    const {
      campaignPhoto,
      campaignSEOFriendlyPath,
      campaignXPoliticianList,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignPhoto,
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
  }

  componentWillUnmount () {
    this.props.setShowHeaderFooter(true);
    this.appStoreListener.remove();
    this.campaignStoreListener.remove();
  }

  onAppStoreChange () {
    const chosenSiteLogoUrl = AppStore.getChosenSiteLogoUrl();
    // For now, we assume that paid sites with chosenSiteLogoUrl will turn off "Chip in"
    const payToPromoteStepTurnedOn = !chosenSiteLogoUrl;
    this.setState({
      payToPromoteStepTurnedOn,
    });
  }

  onCampaignStoreChange () {
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams, campaignXWeVoteId: campaignXWeVoteIdFromParams } = params;
    // console.log('onCampaignStoreChange campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    const {
      campaignPhoto,
      campaignSEOFriendlyPath,
      campaignTitle,
      campaignXPoliticianList,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignPhoto,
      campaignTitle,
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

  goToNextStep = () => {
    const { payToPromoteStepTurnedOn } = this.state;
    if (payToPromoteStepTurnedOn) {
      historyPush(`${this.getCampaignBasePath()}/pay-to-promote`);
    } else {
      historyPush(`${this.getCampaignBasePath()}/share-campaign`);
    }
  }

  submitSkipForNow = () => {
    initializejQuery(() => {
      CampaignSupporterActions.supporterEndorsementQueuedToSave(undefined);
    });
    this.goToNextStep();
  }

  submitSupporterEndorsement = () => {
    const { campaignXWeVoteId } = this.state;
    if (campaignXWeVoteId) {
      const supporterEndorsementQueuedToSave = CampaignSupporterStore.getSupporterEndorsementQueuedToSave();
      const supporterEndorsementQueuedToSaveSet = CampaignSupporterStore.getSupporterEndorsementQueuedToSaveSet();
      let visibleToPublic = CampaignSupporterStore.getVisibleToPublic();
      const visibleToPublicChanged = CampaignSupporterStore.getVisibleToPublicQueuedToSaveSet();
      if (visibleToPublicChanged) {
        // If it has changed, use new value
        visibleToPublic = CampaignSupporterStore.getVisibleToPublicQueuedToSave();
      }
      if (supporterEndorsementQueuedToSaveSet || visibleToPublicChanged) {
        // console.log('CampaignSupportEndorsement, supporterEndorsementQueuedToSave:', supporterEndorsementQueuedToSave);
        const saveVisibleToPublic = true;
        initializejQuery(() => {
          CampaignSupporterActions.supporterEndorsementSave(campaignXWeVoteId, supporterEndorsementQueuedToSave, visibleToPublic, saveVisibleToPublic);
          CampaignSupporterActions.supporterEndorsementQueuedToSave(undefined);
        });
      }
      this.goToNextStep();
    }
  }

  render () {
    renderLog('CampaignSupportEndorsement');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignSupportEndorsement window.location.href: ${window.location.href}`);
    }
    const { classes } = this.props;
    const {
      campaignPhoto, campaignSEOFriendlyPath, campaignTitle,
      campaignXPoliticianList, campaignXWeVoteId,
    } = this.state;
    let numberOfPoliticians = 0;
    if (campaignXPoliticianList && campaignXPoliticianList.length) {
      numberOfPoliticians = campaignXPoliticianList.length;
    }
    const politicianListSentenceString = politicianListToSentenceString(campaignXPoliticianList);
    return (
      <div>
        <Helmet title="Why Do You Support? - We Vote Campaigns" />
        <PageWrapperDefault cordova={isCordova()}>
          <ContentOuterWrapperDefault>
            <ContentInnerWrapperDefault>
              <CampaignSupportSteps
                atStepNumber2
                campaignBasePath={this.getCampaignBasePath()}
                campaignXWeVoteId={campaignXWeVoteId}
              />
              <CampaignSupportImageWrapper>
                {campaignPhoto ? (
                  <CampaignImage src={campaignPhoto} alt="Campaign" />
                ) : (
                  <CampaignSupportImageWrapperText>
                    {campaignTitle}
                  </CampaignSupportImageWrapperText>
                )}
              </CampaignSupportImageWrapper>
              <CampaignProcessStepTitle>
                Why do you support
                {' '}
                {numberOfPoliticians > 1 ? (
                  <>these candidates?</>
                ) : (
                  <>this candidate?</>
                )}
              </CampaignProcessStepTitle>
              <CampaignProcessStepIntroductionText>
                People are more likely to support your campaign if it’s clear why you care. Explain how
                {' '}
                {politicianListSentenceString}
                {' '}
                winning will impact you, your family, or your community.
              </CampaignProcessStepIntroductionText>
              <CampaignSupportSectionWrapper>
                <CampaignSupportSection>
                  <CampaignEndorsementInputField campaignXWeVoteId={campaignXWeVoteId} />
                  <VisibleToPublicCheckboxWrapper>
                    <Suspense fallback={<span>&nbsp;</span>}>
                      <VisibleToPublicCheckbox campaignXWeVoteId={campaignXWeVoteId} />
                    </Suspense>
                  </VisibleToPublicCheckboxWrapper>
                  <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                    <CampaignSupportDesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="saveSupporterEndorsement"
                        onClick={this.submitSupporterEndorsement}
                        variant="contained"
                      >
                        Save and continue
                      </Button>
                    </CampaignSupportDesktopButtonPanel>
                  </CampaignSupportDesktopButtonWrapper>
                  <CampaignSupportMobileButtonWrapper className="u-show-mobile">
                    <CampaignSupportMobileButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDefault }}
                        color="primary"
                        id="saveSupporterEndorsementMobile"
                        onClick={this.submitSupporterEndorsement}
                        variant="contained"
                      >
                        Save and continue
                      </Button>
                    </CampaignSupportMobileButtonPanel>
                  </CampaignSupportMobileButtonWrapper>
                  <AdviceBoxWrapper>
                    <AdviceBox>
                      <AdviceBoxTitle>
                        Describe the people who will be affected if this candidate loses
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        People are most likely to vote when they understand the consequences of this candidate not being elected, described in terms of the people impacted.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Describe the benefits of this candidate winning
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Explain why this candidate or candidates winning will bring positive change.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Make it personal
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Voters are more likely to sign and support your campaign if it’s clear why you care.
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
                    <SkipForNowButtonPanel>
                      <Button
                        classes={{ root: classes.buttonSimpleLink }}
                        color="primary"
                        id="skipSupporterEndorsementMobile"
                        onClick={this.submitSkipForNow}
                      >
                        Skip for now
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
CampaignSupportEndorsement.propTypes = {
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

const VisibleToPublicCheckboxWrapper = styled.div`
  min-height: 25px;
`;

export default withStyles(styles)(CampaignSupportEndorsement);
