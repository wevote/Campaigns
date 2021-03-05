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
import CampaignSupportActions from '../../actions/CampaignSupportActions';
import CampaignSupportSteps from '../../components/Navigation/CampaignSupportSteps';
import CampaignSupportStore from '../../stores/CampaignSupportStore';
import { historyPush, isCordova } from '../../utils/cordovaUtils';
import initializejQuery from '../../utils/initializejQuery';
import { ContentInnerWrapperDefault, ContentOuterWrapperDefault, PageWrapperDefault } from '../../components/Style/PageWrapperStyles';
import { renderLog } from '../../utils/logging';

const VoterFirstRetrieveController = loadable(() => import('../../components/Settings/VoterFirstRetrieveController'));


class CampaignSupportPayToPromote extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('CampaignSupportPayToPromote componentDidMount');
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = params;
    // console.log('componentDidMount campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
    retrieveCampaignXFromIdentifiersIfNeeded(campaignSEOFriendlyPath, campaignXWeVoteId);
  }

  componentWillUnmount () {
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
      campaignSEOFriendlyPath,
      campaignXWeVoteId,
    });
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
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.state;
    const payToPromoteStepTurnedOn = true;
    let pathToUseWhenProfileComplete = '';
    if (payToPromoteStepTurnedOn) {
      if (campaignSEOFriendlyPath) {
        pathToUseWhenProfileComplete = `/c/${campaignSEOFriendlyPath}/pay-to-promote`;
      } else {
        pathToUseWhenProfileComplete = `/id/${campaignXWeVoteId}/pay-to-promote`;
      }
    } else if (campaignSEOFriendlyPath) {
      pathToUseWhenProfileComplete = `/c/${campaignSEOFriendlyPath}/sharing-options`;
    } else {
      pathToUseWhenProfileComplete = `/id/${campaignXWeVoteId}/sharing-options`;
    }

    historyPush(pathToUseWhenProfileComplete);
  }

  submitSkipForNow = () => {
    this.goToNextStep();
  }

  submitSupportEndorsement = () => {
    const { campaignXWeVoteId } = this.state;
    const supportEndorsementQueuedToSave = CampaignSupportStore.getSupportEndorsementQueuedToSave();
    const supportEndorsementQueuedToSaveSet = CampaignSupportStore.getSupportEndorsementQueuedToSaveSet();
    if (supportEndorsementQueuedToSaveSet && campaignXWeVoteId) {
      // console.log('CampaignSupportPayToPromote, supportEndorsementQueuedToSave:', supportEndorsementQueuedToSave);
      initializejQuery(() => {
        CampaignSupportActions.supportEndorsementSave(campaignXWeVoteId, supportEndorsementQueuedToSave);
        CampaignSupportActions.supportEndorsementQueuedToSave(undefined);
      });
    }
    this.goToNextStep();
  }

  render () {
    renderLog('CampaignSupportPayToPromote');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignSupportPayToPromote window.location.href: ${window.location.href}`);
    }
    const { classes } = this.props;
    const { campaignPhoto } = this.state;
    return (
      <div>
        <Helmet title="Why Do You Support? - We Vote Campaigns" />
        <PageWrapperDefault cordova={isCordova()}>
          <ContentOuterWrapperDefault>
            <ContentInnerWrapperDefault>
              <CampaignSupportSteps atPayToPromoteStep campaignBasePath={this.getCampaignBasePath()} />
              <CampaignImage src={campaignPhoto} alt="Campaign" />
              <CampaignProcessStepTitle>
                Can you chip in $3 to get this campaign in front of more people?
              </CampaignProcessStepTitle>
              <CampaignProcessStepIntroductionText>
                People are more likely to support your campaign if it’s clear why you care. Explain how this candidate winning will impact you, your family, or your community.
              </CampaignProcessStepIntroductionText>
              <CampaignSupportSectionWrapper>
                <CampaignSupportSection>
                  <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                    <CampaignSupportDesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="saveSupportEndorsement"
                        onClick={this.submitSupportEndorsement}
                        variant="contained"
                      >
                        Yes, I&apos;ll chip in $3 to boost this campaign
                      </Button>
                    </CampaignSupportDesktopButtonPanel>
                  </CampaignSupportDesktopButtonWrapper>
                  <CampaignSupportMobileButtonWrapper className="u-show-mobile">
                    <CampaignSupportMobileButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDefault }}
                        color="primary"
                        id="saveSupportEndorsementMobile"
                        onClick={this.submitCampaignDescription}
                        variant="contained"
                      >
                        Yes, I&apos;ll chip in $3
                      </Button>
                    </CampaignSupportMobileButtonPanel>
                  </CampaignSupportMobileButtonWrapper>
                  <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                    <CampaignSupportDesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="saveSupportEndorsement"
                        onClick={this.submitSkipForNow}
                        variant="outlined"
                      >
                        No, I&apos;ll share instead
                      </Button>
                    </CampaignSupportDesktopButtonPanel>
                  </CampaignSupportDesktopButtonWrapper>
                  <CampaignSupportMobileButtonWrapper className="u-show-mobile">
                    <CampaignSupportMobileButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDefault }}
                        color="primary"
                        id="saveSupportEndorsementMobile"
                        onClick={this.submitSkipForNow}
                        variant="outlined"
                      >
                        No, I&apos;ll share instead
                      </Button>
                    </CampaignSupportMobileButtonPanel>
                  </CampaignSupportMobileButtonWrapper>
                  <SkipForNowButtonWrapper>
                    <SkipForNowButtonPanel>
                      <Button
                        classes={{ root: classes.buttonSimpleLink }}
                        color="primary"
                        id="saveSupportEndorsementMobile"
                        onClick={this.submitSkipForNow}
                      >
                        Sorry, I can&apos;t do anything right now
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
CampaignSupportPayToPromote.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
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
    minWidth: 250,
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

export default withStyles(styles)(CampaignSupportPayToPromote);
