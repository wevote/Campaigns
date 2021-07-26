import React, { Component, Suspense } from 'react';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import TruncateMarkup from 'react-truncate-markup';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';
import AppStore from '../../stores/AppStore';
import {
  CampaignSupportImageWrapper, CampaignSupportImageWrapperText,
  CampaignSupportSection, CampaignSupportSectionWrapper,
  SkipForNowButtonPanel, SkipForNowButtonWrapper,
} from '../../components/Style/CampaignSupportStyles';
import CampaignStore from '../../stores/CampaignStore';
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiers } from '../../utils/campaignUtils';
import CampaignSupportSteps from '../../components/Navigation/CampaignSupportSteps';
import { historyPush, isCordova } from '../../utils/cordovaUtils';
import { ContentInnerWrapperDefault, ContentOuterWrapperDefault, PageWrapperDefault } from '../../components/Style/PageWrapperStyles';
import arrayContains from '../../utils/arrayContains';
import { renderLog } from '../../utils/logging';
import SupportButtonSingleClick from '../../components/CampaignSupport/SupportButtonSingleClick';
import VoterStore from '../../stores/VoterStore';

const CampaignRetrieveController = React.lazy(() => import('../../components/Campaign/CampaignRetrieveController'));
const CampaignSupportThermometer = React.lazy(() => import('../../components/CampaignSupport/CampaignSupportThermometer'));
const RecommendedCampaignListRetrieveController = React.lazy(() => import('../../components/Campaign/RecommendedCampaignListRetrieveController'));
const VoterFirstRetrieveController = loadable(() => import('../../components/Settings/VoterFirstRetrieveController'));


class CampaignRecommendedCampaigns extends Component {
  constructor (props) {
    super(props);
    this.state = {
      allRecommendedCampaignOptionsReviewed: false,
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXWeVoteId: '',
      chosenWebsiteName: '',
      maximumNumberOfCampaignsToSupport: 5,
      numberOfCampaignsLeftToSupport: 5,
      recommendedCampaignDescription: '',
      recommendedCampaignTitle: '',
      recommendedCampaignXWeVoteId: '',
      recommendedCampaignPhotoLargeUrl: '',
      recommendedCampaignXList: [],
      skippedCampaignXWeVoteIdList: [],
      supportedCampaignXWeVoteIdList: [],
    };
  }

  componentDidMount () {
    // console.log('CampaignRecommendedCampaigns componentDidMount');
    this.props.setShowHeaderFooter(false);
    this.onAppStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams, campaignXWeVoteId: campaignXWeVoteIdFromParams } = params;
    // console.log('componentDidMount campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    const {
      campaignSEOFriendlyPath,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
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

  componentWillUnmount () {
    this.props.setShowHeaderFooter(true);
    this.appStoreListener.remove();
    this.campaignStoreListener.remove();
    this.voterStoreListener.remove();
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
    let { maximumNumberOfCampaignsToSupport, numberOfCampaignsLeftToSupport } = this.state;
    // console.log('onCampaignStoreChange campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    let recommendedCampaignXList = [];
    let recommendedCampaignXListHasBeenRetrieved = false;
    const {
      campaignSEOFriendlyPath,
      campaignTitle,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
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
      recommendedCampaignXList = CampaignStore.getRecommendedCampaignXList(campaignXWeVoteId);
      recommendedCampaignXListHasBeenRetrieved = CampaignStore.getRecommendedCampaignXListHasBeenRetrieved(campaignXWeVoteId);
      this.setState({
        campaignXNewsItemsExist: CampaignStore.getCampaignXNewsItemsExist(campaignXWeVoteId),
        campaignXWeVoteId,
      });
    } else if (campaignXWeVoteIdFromParams) {
      recommendedCampaignXList = CampaignStore.getRecommendedCampaignXList(campaignXWeVoteIdFromParams);
      recommendedCampaignXListHasBeenRetrieved = CampaignStore.getRecommendedCampaignXListHasBeenRetrieved(campaignXWeVoteIdFromParams);
      this.setState({
        campaignXNewsItemsExist: CampaignStore.getCampaignXNewsItemsExist(campaignXWeVoteIdFromParams),
        campaignXWeVoteId: campaignXWeVoteIdFromParams,
      });
    }
    // We will need to start filtering and sorting
    // console.log('recommendedCampaignXListHasBeenRetrieved:', recommendedCampaignXListHasBeenRetrieved);
    const recommendedCampaignXListLength = recommendedCampaignXList.length || 0;
    if (recommendedCampaignXListHasBeenRetrieved) {
      if (maximumNumberOfCampaignsToSupport > recommendedCampaignXListLength) {
        maximumNumberOfCampaignsToSupport = recommendedCampaignXListLength;
      }
      if (numberOfCampaignsLeftToSupport > recommendedCampaignXListLength) {
        numberOfCampaignsLeftToSupport = recommendedCampaignXListLength;
      }
    }
    // After we know campaignXWeVoteId is in the state
    const { campaignXWeVoteId: campaignXWeVoteIdStored } = this.state;
    if (campaignXWeVoteIdStored) {
      this.setState({
        maximumNumberOfCampaignsToSupport,
        numberOfCampaignsLeftToSupport,
        recommendedCampaignXList,
        recommendedCampaignXListHasBeenRetrieved,
      }, () => this.setNextRecommendedCampaignX());
    } else {
      this.setState({
        maximumNumberOfCampaignsToSupport,
        numberOfCampaignsLeftToSupport,
      });
    }
  }

  onVoterStoreChange () {
    const voterFirstRetrieveCompleted = VoterStore.voterFirstRetrieveCompleted();
    const voterSignedInWithEmail = VoterStore.getVoterIsSignedInWithEmail();
    if (voterFirstRetrieveCompleted && !voterSignedInWithEmail) {
      // Leave this component and go to news page if not signed in
      historyPush(`${this.getCampaignBasePath()}/updates`);
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

  goToDetailsPage = () => {
    historyPush(`${this.getCampaignBasePath()}`);
  }

  goToUpdatesPage = () => {
    historyPush(`${this.getCampaignBasePath()}/updates`);
  }

  oneClickSupportActionComplete = (campaignXWeVoteId) => {
    // console.log('oneClickSupportActionComplete campaignXWeVoteId:', campaignXWeVoteId);
    const { supportedCampaignXWeVoteIdList } = this.state;
    let { numberOfCampaignsLeftToSupport } = this.state;
    if (!campaignXWeVoteId) {
      return null;
    }
    if (!arrayContains(campaignXWeVoteId, supportedCampaignXWeVoteIdList)) {
      supportedCampaignXWeVoteIdList.push(campaignXWeVoteId);
    }
    numberOfCampaignsLeftToSupport -= 1;
    this.setState({
      numberOfCampaignsLeftToSupport,
      supportedCampaignXWeVoteIdList,
    }, () => this.setNextRecommendedCampaignX());
    return null;
  }

  skipRecommendedCampaign = (campaignXWeVoteId) => {
    // console.log('skipRecommendedCampaign campaignXWeVoteId:', campaignXWeVoteId);
    const { skippedCampaignXWeVoteIdList } = this.state;
    if (!campaignXWeVoteId) {
      return null;
    }
    if (!arrayContains(campaignXWeVoteId, skippedCampaignXWeVoteIdList)) {
      skippedCampaignXWeVoteIdList.push(campaignXWeVoteId);
      this.setState({
        skippedCampaignXWeVoteIdList,
      }, () => this.setNextRecommendedCampaignX());
    }
    return null;
  }

  setDescriptionUnfurled = () => {
    this.setState({
      descriptionUnfurledMode: true,
    });
  }

  setNextRecommendedCampaignX = () => {
    const {
      recommendedCampaignXList,
      recommendedCampaignXListHasBeenRetrieved,
      skippedCampaignXWeVoteIdList,
      supportedCampaignXWeVoteIdList,
    } = this.state;
    let { maximumNumberOfCampaignsToSupport, numberOfCampaignsLeftToSupport } = this.state;
    // console.log('setNextRecommendedCampaignX recommendedCampaignXList:', recommendedCampaignXList, ', recommendedCampaignXListHasBeenRetrieved:', recommendedCampaignXListHasBeenRetrieved);
    if (!recommendedCampaignXListHasBeenRetrieved) {
      // Don't proceed until we know we have a campaignXWeVoteID stored in state
      return null;
    }
    let index = 0;
    const recommendedCampaignXListLength = recommendedCampaignXList.length || 0;
    let keepLooking = true;
    let nextCampaignX = {};
    let safetyValve = 0;
    while (keepLooking && index <= recommendedCampaignXListLength && safetyValve < 25) {
      // console.log('setNextRecommendedCampaignX index:', index, ', recommendedCampaignXListLength:', recommendedCampaignXListLength);
      // console.log('skippedCampaignXWeVoteIdList:', skippedCampaignXWeVoteIdList, ', supportedCampaignXWeVoteIdList:', supportedCampaignXWeVoteIdList);
      if (numberOfCampaignsLeftToSupport <= 0) {
        keepLooking = false;
      } else if (index >= recommendedCampaignXListLength) {
        nextCampaignX = null;
        this.setState({
          allRecommendedCampaignOptionsReviewed: true,
        }, () => this.showHeaderFooter());
      } else {
        nextCampaignX = recommendedCampaignXList[index] || {};
      }
      if (!keepLooking || !nextCampaignX || !nextCampaignX.campaignx_we_vote_id) {
        // Skip
      } else if (
        !arrayContains(nextCampaignX.campaignx_we_vote_id, skippedCampaignXWeVoteIdList) &&
        !arrayContains(nextCampaignX.campaignx_we_vote_id, supportedCampaignXWeVoteIdList)) {
        nextCampaignX = recommendedCampaignXList[index] || {};
        if (!nextCampaignX || !nextCampaignX.campaignx_we_vote_id) {
          keepLooking = true;
        } else {
          const {
            campaign_description: recommendedCampaignDescription,
            campaign_title: recommendedCampaignTitle,
            campaignx_we_vote_id: recommendedCampaignXWeVoteId,
            // seo_friendly_path: recommendedCampaignSEOFriendlyPath,
            we_vote_hosted_campaign_photo_large_url: recommendedCampaignPhotoLargeUrl,
          } = nextCampaignX;
          this.setState({
            recommendedCampaignDescription,
            // recommendedCampaignSEOFriendlyPath,
            recommendedCampaignTitle,
            recommendedCampaignXWeVoteId,
            recommendedCampaignPhotoLargeUrl,
          });
          keepLooking = false;
        }
      }
      index += 1;
      safetyValve += 1;
    }
    // console.log('recommendedCampaignXListLength:', recommendedCampaignXListLength, ', maximumNumberOfCampaignsToSupport:', maximumNumberOfCampaignsToSupport, ', numberOfCampaignsLeftToSupport:', numberOfCampaignsLeftToSupport);
    if (recommendedCampaignXListHasBeenRetrieved) {
      if (maximumNumberOfCampaignsToSupport > recommendedCampaignXListLength) {
        maximumNumberOfCampaignsToSupport = recommendedCampaignXListLength;
      }
      if (numberOfCampaignsLeftToSupport > recommendedCampaignXListLength) {
        numberOfCampaignsLeftToSupport = recommendedCampaignXListLength;
      }
      this.setState({
        maximumNumberOfCampaignsToSupport,
        numberOfCampaignsLeftToSupport,
      });
    }
    this.setState({
      descriptionUnfurledMode: false,
    });
    return null;
  }

  showHeaderFooter = () => {
    const { setShowHeaderFooter } = this.props;
    setShowHeaderFooter(true);
  }

  render () {
    renderLog('CampaignRecommendedCampaigns');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignRecommendOthers window.location.href: ${window.location.href}`);
    }
    const { classes } = this.props;
    const {
      allRecommendedCampaignOptionsReviewed, campaignSEOFriendlyPath, campaignTitle,
      campaignXNewsItemsExist, campaignXWeVoteId, chosenWebsiteName,
      descriptionUnfurledMode, numberOfCampaignsLeftToSupport,
      recommendedCampaignDescription, recommendedCampaignTitle, recommendedCampaignXListHasBeenRetrieved,
      recommendedCampaignXWeVoteId, recommendedCampaignPhotoLargeUrl,
    } = this.state;
    const htmlTitle = `${campaignTitle} - ${chosenWebsiteName}`;
    const supportButtonClasses = classes.buttonDefault; // isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;

    if (allRecommendedCampaignOptionsReviewed || numberOfCampaignsLeftToSupport <= 0) {
      return (
        <div>
          <Helmet>
            <title>{htmlTitle}</title>
          </Helmet>
          <PageWrapperDefault cordova={isCordova()}>
            <ContentOuterWrapperDefault>
              <ContentInnerWrapperDefault>
                <CampaignSupportSteps
                  atSharingStep
                  campaignBasePath={this.getCampaignBasePath()}
                  campaignXWeVoteId={campaignXWeVoteId}
                />
                <CampaignTitle>{campaignTitle}</CampaignTitle>
                <RecommendedCampaignsIntroText>
                  Thank you for helping to strengthen American democracy!
                </RecommendedCampaignsIntroText>
                <CampaignSupportSectionWrapper>
                  <CampaignSupportSection>
                    <SkipForNowButtonWrapper>
                      <SkipForNowButtonPanel>
                        {campaignXNewsItemsExist ? (
                          <Button
                            classes={{ root: classes.buttonSimpleLink }}
                            color="primary"
                            id="goToUpdatesPage"
                            onClick={this.goToUpdatesPage}
                          >
                            See news about the campaign you supported
                          </Button>
                        ) : (
                          <Button
                            classes={{ root: classes.buttonSimpleLink }}
                            color="primary"
                            id="goToCampaignDetails"
                            onClick={this.goToDetailsPage}
                          >
                            Return to the campaign you supported
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

    return (
      <div>
        <Helmet>
          <title>{htmlTitle}</title>
        </Helmet>
        <PageWrapperDefault cordova={isCordova()}>
          <ContentOuterWrapperDefault>
            <ContentInnerWrapperDefault>
              <CampaignSupportSteps
                atSharingStep
                campaignBasePath={this.getCampaignBasePath()}
                campaignXWeVoteId={campaignXWeVoteId}
              />
              <RecommendedCampaignsIntroText>
                Support
                {' '}
                {recommendedCampaignXListHasBeenRetrieved ? (
                  <strong>
                    {numberOfCampaignsLeftToSupport}
                    {' '}
                    more
                  </strong>
                ) : (
                  <span>more</span>
                )}
                {' '}
                recommended campaigns. Build&nbsp;momentum&nbsp;to&nbsp;victory!
              </RecommendedCampaignsIntroText>
              <RecommendedCampaignWrapper>
                <CampaignSupportImageWrapper borderRadiusOnTop="10px">
                  {recommendedCampaignPhotoLargeUrl ? (
                    <CampaignImage src={recommendedCampaignPhotoLargeUrl} alt="Campaign" noBorderRadius />
                  ) : (
                    <CampaignSupportImageWrapperText>
                      {recommendedCampaignTitle}
                    </CampaignSupportImageWrapperText>
                  )}
                </CampaignSupportImageWrapper>
                <RecommendedCampaignDetailsWrapper>
                  <CampaignTitle>{recommendedCampaignTitle}</CampaignTitle>
                  <Suspense fallback={<span>&nbsp;</span>}>
                    <CampaignSupportThermometer campaignXWeVoteId={recommendedCampaignXWeVoteId} inCompressedMode />
                  </Suspense>
                  <CampaignDescription>
                    {descriptionUnfurledMode ? (
                      <TextField
                        classes={{ root: classes.textField }}
                        id="recommendedCampaignDescriptionTextArea"
                        name="campaignDescription"
                        margin="dense"
                        multiline
                        rows={8}
                        variant="outlined"
                        value={recommendedCampaignDescription}
                      />
                    ) : (
                      <TruncateMarkup
                        lines={3}
                        ellipsis={(
                          <span id="setDescriptionUnfurled" onClick={this.setDescriptionUnfurled}>
                            <span className="u-text-fade-at-end">&nbsp;</span>
                            <span className="u-link-color u-link-underline">Read more</span>
                          </span>
                        )}
                      >
                        <div>
                          {recommendedCampaignDescription}
                        </div>
                      </TruncateMarkup>
                    )}
                  </CampaignDescription>
                  <SkipOrSupportFooter>
                    <SkipButtonWrapper>
                      <Button
                        classes={{ root: supportButtonClasses }}
                        color="primary"
                        id="skipRecommended"
                        onClick={() => this.skipRecommendedCampaign(recommendedCampaignXWeVoteId)}
                        variant="outlined"
                      >
                        Skip
                      </Button>
                    </SkipButtonWrapper>
                    <SupportButtonWrapper>
                      <SupportButtonSingleClick
                        campaignXWeVoteId={recommendedCampaignXWeVoteId}
                        functionToUseWhenActionComplete={this.oneClickSupportActionComplete}
                      />
                    </SupportButtonWrapper>
                  </SkipOrSupportFooter>
                </RecommendedCampaignDetailsWrapper>
              </RecommendedCampaignWrapper>
              {/* See news... */}
              <CampaignSupportSectionWrapper>
                <CampaignSupportSection>
                  <SkipForNowButtonWrapper>
                    <SkipForNowButtonPanel>
                      {campaignXNewsItemsExist ? (
                        <Button
                          classes={{ root: classes.buttonSimpleLink }}
                          color="primary"
                          id="goToUpdatesPage"
                          onClick={this.goToUpdatesPage}
                        >
                          See news about the campaign you supported
                        </Button>
                      ) : (
                        <Button
                          classes={{ root: classes.buttonSimpleLink }}
                          color="primary"
                          id="goToCampaignDetails"
                          onClick={this.goToDetailsPage}
                        >
                          Return to the campaign you supported
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
CampaignRecommendedCampaigns.propTypes = {
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
  textField: {
    border: 0,
    color: '#fff',
    margin: '0 !important',
    padding: '0 !important',
    width: '100%',
  },
});

const CampaignDescription = styled.div`
  font-size: 17px;
  margin: 4px 0;
  min-height: 50px;
`;

const CampaignImage = styled.img`
  border-radius: 8px 8px 0 0;
  max-width: 620px;
  min-height: 117px;
  width: 100%;
`;

const CampaignTitle = styled.h1`
  font-size: 20px;
  margin: 0;
  margin-bottom: 10px;
  margin-top: 10px;
  min-height: 27px;
  text-align: left;
`;

const RecommendedCampaignsIntroText = styled.div`
  font-size: 20px;
  font-weight: 400;
  margin: 18px 0 20px 0;
  max-width: 620px;
  text-align: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

const RecommendedCampaignWrapper = styled.div`
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 20px 40px -25px #999;
  max-width: 620px;
`;

const RecommendedCampaignDetailsWrapper = styled.div`
  margin: 0;
  padding: 0 15px 15px 15px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 8px 8px 8px;
  }
`;

const SkipButtonWrapper = styled.div`
  width: 40%;
`;

const SupportButtonWrapper = styled.div`
  width: 58%;
`;

const SkipOrSupportFooter = styled.div`
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 25px;
  width: 100%;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-top: 20px;
  }
`;

export default withStyles(styles)(CampaignRecommendedCampaigns);
