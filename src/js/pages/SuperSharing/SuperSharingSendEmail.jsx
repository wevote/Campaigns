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
  CampaignSupportSection, CampaignSupportSectionWrapper,
  SkipForNowButtonPanel, SkipForNowButtonWrapper,
} from '../../components/Style/CampaignSupportStyles';
import CampaignStore from '../../stores/CampaignStore';
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiersIfNeeded } from '../../utils/campaignUtils';
import SuperSharingSteps from '../../components/Navigation/SuperSharingSteps';
import { historyPush, isCordova } from '../../utils/cordovaUtils';
// import initializejQuery from '../../utils/initializejQuery';
import { onStep1ClickPath, onStep2ClickPath, onStep3ClickPath } from '../../utils/superSharingStepPaths';
import { ContentInnerWrapperDefault, ContentOuterWrapperDefault, PageWrapperDefault } from '../../components/Style/PageWrapperStyles';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';

const CampaignRetrieveController = React.lazy(() => import('../../components/Campaign/CampaignRetrieveController'));
const VoterFirstRetrieveController = loadable(() => import('../../components/Settings/VoterFirstRetrieveController'));


class SuperSharingSendEmail extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignPhotoLargeUrl: '',
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXNewsItemWeVoteId: '',
      campaignXWeVoteId: '',
      chosenWebsiteName: '',
    };
  }

  componentDidMount () {
    // console.log('SuperSharingSendEmail componentDidMount');
    this.props.setShowHeaderFooter(false);
    this.onAppStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
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
  }

  componentWillUnmount () {
    this.props.setShowHeaderFooter(true);
    this.appStoreListener.remove();
    this.campaignStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppStoreChange () {
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

  onVoterStoreChange () {
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

  onStep1Click = () => {
    const { campaignXNewsItemWeVoteId } = this.state;
    const sms = false;
    const step1ClickPath = onStep1ClickPath(this.getCampaignBasePath(), campaignXNewsItemWeVoteId, sms);
    if (step1ClickPath) {
      historyPush(step1ClickPath);
    }
  }

  onStep2Click = () => {
    const { campaignXNewsItemWeVoteId } = this.state;
    const sms = false;
    const step2ClickPath = onStep2ClickPath(this.getCampaignBasePath(), campaignXNewsItemWeVoteId, sms);
    if (step2ClickPath) {
      historyPush(step2ClickPath);
    }
  }

  onStep3Click = () => {
    const { campaignXNewsItemWeVoteId } = this.state;
    const sms = false;
    const step3ClickPath = onStep3ClickPath(this.getCampaignBasePath(), campaignXNewsItemWeVoteId, sms);
    if (step3ClickPath) {
      historyPush(step3ClickPath);
    }
  }

  returnToOtherSharingOptions = () => {
    historyPush(`${this.getCampaignBasePath()}/share-campaign`);
  }

  submitSendEmail = () => {
    const { campaignXWeVoteId } = this.state;
    if (campaignXWeVoteId) {
      historyPush(`${this.getCampaignBasePath()}/recommended-campaigns`);
    }
  }

  render () {
    renderLog('SuperSharingSendEmail');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`SuperSharingSendEmail window.location.href: ${window.location.href}`);
    }
    const { classes } = this.props;
    const {
      campaignPhotoLargeUrl, campaignSEOFriendlyPath, campaignTitle,
      campaignXNewsItemWeVoteId,
      campaignXWeVoteId, chosenWebsiteName,
    } = this.state;
    const htmlTitle = `Why do you support ${campaignTitle}? - ${chosenWebsiteName}`;
    // let numberOfPoliticians = 0;
    // if (campaignXPoliticianList && campaignXPoliticianList.length) {
    //   numberOfPoliticians = campaignXPoliticianList.length;
    // }
    // const politicianListSentenceString = politicianListToSentenceString(campaignXPoliticianList);
    return (
      <div>
        <Helmet title={htmlTitle} />
        <PageWrapperDefault cordova={isCordova()}>
          <ContentOuterWrapperDefault>
            <ContentInnerWrapperDefault>
              <SuperSharingSteps
                atStepNumber4
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
                Review and send email
              </CampaignProcessStepTitle>
              <CampaignProcessStepIntroductionText>
                If everything looks good, click &apos;Send email&apos; below.
              </CampaignProcessStepIntroductionText>
              <CampaignSupportSectionWrapper>
                <CampaignSupportSection>
                  <StepOuterWrapper>
                    <StepInnerLeftWrapper
                      className="u-cursor--pointer"
                      onClick={this.onStep1Click}
                    >
                      <StepRow>
                        <StepCircle>
                          <StepNumber>1</StepNumber>
                        </StepCircle>
                        <div>
                          <StepNumberTitle>
                            Import your address book
                          </StepNumberTitle>
                          <StepPreviewText>
                            Contacts Imported: 45
                          </StepPreviewText>
                        </div>
                      </StepRow>
                    </StepInnerLeftWrapper>
                    <StepInnerRightWrapper>
                      <Button
                        classes={{ root: classes.buttonMini }}
                        color="primary"
                        id="addNewContacts"
                        onClick={this.onStep1Click}
                        variant="outlined"
                      >
                        Import
                      </Button>
                    </StepInnerRightWrapper>
                  </StepOuterWrapper>
                  <StepOuterWrapper>
                    <StepInnerLeftWrapper
                      className="u-cursor--pointer"
                      onClick={this.onStep2Click}
                    >
                      <StepRow>
                        <StepCircle>
                          <StepNumber>2</StepNumber>
                        </StepCircle>
                        <div>
                          <StepNumberTitle>
                            Choose recipients
                          </StepNumberTitle>
                          <StepPreviewText>
                            Emails to be sent: 30
                          </StepPreviewText>
                        </div>
                      </StepRow>
                    </StepInnerLeftWrapper>
                    <StepInnerRightWrapper>
                      <Button
                        classes={{ root: classes.buttonMini }}
                        color="primary"
                        id="addNewContacts"
                        onClick={this.onStep2Click}
                        variant="outlined"
                      >
                        Select
                      </Button>
                    </StepInnerRightWrapper>
                  </StepOuterWrapper>
                  <StepOuterWrapper>
                    <StepInnerLeftWrapper
                      className="u-cursor--pointer"
                      onClick={this.onStep3Click}
                    >
                      <StepRow>
                        <StepCircle>
                          <StepNumber>3</StepNumber>
                        </StepCircle>
                        <div>
                          <StepNumberTitle>
                            Personalize message
                          </StepNumberTitle>
                          <StepPreviewText>
                            &quot;Hello, I&apos;m preparing for the next election, and I added my support to this...&quot;
                          </StepPreviewText>
                        </div>
                      </StepRow>
                    </StepInnerLeftWrapper>
                    <StepInnerRightWrapper>
                      <Button
                        classes={{ root: classes.buttonMini }}
                        color="primary"
                        id="addNewContacts"
                        onClick={this.onStep3Click}
                        variant="outlined"
                      >
                        Edit
                      </Button>
                    </StepInnerRightWrapper>
                  </StepOuterWrapper>
                  <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                    <CampaignSupportDesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="saveSupporterEndorsement"
                        onClick={this.submitSendEmail}
                        variant="contained"
                      >
                        Send email
                      </Button>
                    </CampaignSupportDesktopButtonPanel>
                  </CampaignSupportDesktopButtonWrapper>
                  <SkipForNowButtonWrapper>
                    <SkipForNowButtonPanel>
                      <Button
                        classes={{ root: classes.buttonSimpleLink }}
                        color="primary"
                        id="returnToOtherSharing"
                        onClick={this.returnToOtherSharingOptions}
                      >
                        Cancel
                      </Button>
                    </SkipForNowButtonPanel>
                    <BottomOfPageSpacer />
                  </SkipForNowButtonWrapper>
                </CampaignSupportSection>
              </CampaignSupportSectionWrapper>
            </ContentInnerWrapperDefault>
          </ContentOuterWrapperDefault>
        </PageWrapperDefault>
        <ButtonFooterWrapper className="u-show-mobile">
          <ButtonPanel>
            <Button
              classes={{ root: classes.buttonDefault }}
              color="primary"
              id="saveSupporterEndorsementMobile"
              onClick={this.submitSendEmail}
              variant="contained"
            >
              Send email
            </Button>
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
SuperSharingSendEmail.propTypes = {
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
    padding: '0 12px',
    textTransform: 'none',
    minWidth: 300,
  },
  buttonMini: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    minWidth: '150px',
    padding: '0 24px',
    textTransform: 'none',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      fontSize: '14px',
      height: '35px !important',
      minWidth: '70px',
      padding: '0 12px',
    },
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

const StepCircle = styled.div`
  align-items: center;
  background: ${(props) => (props.inverseColor ? props.theme.colors.brandBlue : 'white')};
  border: 2px solid ${(props) => props.theme.colors.brandBlue};
  border-radius: 18px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  margin-right: 12px;
  min-width: 30px;
  width: 30px;
  height: 30px;
`;

const StepInnerLeftWrapper = styled.div`
  width: 100%;
`;

const StepInnerRightWrapper = styled.div`
`;

const StepNumber = styled.div`
  color: ${(props) => (props.inverseColor ? 'white' : props.theme.colors.brandBlue)};
  font-size: 16px;
  font-weight: 600;
  margin-top: -2px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 14px;
  }
`;

const StepNumberTitle = styled.div`
  color: ${(props) => (props.inverseColor ? 'white' : props.theme.colors.brandBlue)};
  font-weight: 600;
`;

const StepOuterWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin-bottom: 40px;
  width: 100%;
`;

const StepPreviewText = styled.div`
  font-size: 14px;
  margin-top: 4px;
  padding-right: 6px;
`;

const StepRow = styled.div`
  align-items: flex-start;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
`;

export default withStyles(styles)(SuperSharingSendEmail);
