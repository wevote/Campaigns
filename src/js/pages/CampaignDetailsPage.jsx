import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import CampaignTopNavigation from '../components/Navigation/CampaignTopNavigation';
import CampaignStore from '../stores/CampaignStore';
import CampaignSupportActions from '../actions/CampaignSupportActions';
import CampaignSupportStore from '../stores/CampaignSupportStore';
import CompleteYourProfileModalController from '../components/Settings/CompleteYourProfileModalController';
import DelayedLoad from '../components/Widgets/DelayedLoad';
import { getCampaignXValuesFromIdentifiers } from '../utils/campaignUtils';
import { historyPush, isCordova } from '../utils/cordovaUtils';
import initializejQuery from '../utils/initializejQuery';
import { renderLog } from '../utils/logging';
import SupportButtonFooter from '../components/CampaignSupport/SupportButtonFooter';

const CampaignSupportThermometer = React.lazy(() => import('../components/CampaignSupport/CampaignSupportThermometer'));
const CompleteYourProfileOnCampaignDetails = React.lazy(() => import('../components/CampaignSupport/CompleteYourProfileOnCampaignDetails'));
const FirstCampaignController = React.lazy(() => import('../components/Campaign/FirstCampaignController'));


class CampaignDetailsPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignPhoto: '',
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXWeVoteId: '',
      pathToUseWhenProfileComplete: '',
    };
  }

  componentDidMount () {
    // console.log('CampaignDetailsPage componentDidMount');
    this.onCampaignStoreChange();
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = params;
    // console.log('componentDidMount campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    // retrieveCampaignXFromIdentifiersIfNeeded(campaignSEOFriendlyPath, campaignXWeVoteId);
    let pathToUseWhenProfileComplete = '';
    if (campaignSEOFriendlyPath) {
      pathToUseWhenProfileComplete = `/c/${campaignSEOFriendlyPath}/why-do-you-support`;
    } else {
      pathToUseWhenProfileComplete = `/id/${campaignXWeVoteId}/why-do-you-support`;
    }
    this.setState({
      campaignSEOFriendlyPath,
      campaignXWeVoteId,
      pathToUseWhenProfileComplete,
    });
  }

  componentWillUnmount () {
    this.campaignStoreListener.remove();
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  onCampaignStoreChange () {
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams, campaignXWeVoteId: campaignXWeVoteIdFromParams } = params;
    // console.log('onCampaignStoreChange campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    const {
      campaignDescription,
      campaignPhoto,
      campaignSEOFriendlyPath,
      campaignTitle,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    let pathToUseWhenProfileComplete = '';
    if (campaignSEOFriendlyPath) {
      pathToUseWhenProfileComplete = `/c/${campaignSEOFriendlyPath}/why-do-you-support`;
    } else {
      pathToUseWhenProfileComplete = `/id/${campaignXWeVoteId}/why-do-you-support`;
    }
    this.setState({
      campaignDescription,
      campaignPhoto,
      campaignSEOFriendlyPath,
      campaignTitle,
      campaignXWeVoteId,
      pathToUseWhenProfileComplete,
    });
  }

  goToNextPage = () => {
    const { pathToUseWhenProfileComplete } = this.state;
    this.timer = setTimeout(() => {
      historyPush(pathToUseWhenProfileComplete);
    }, 500);
  }

  functionToUseWhenProfileComplete = () => {
    const { campaignXWeVoteId } = this.state;
    const campaignSupported = true;
    const campaignSupportedChanged = true;
    // From this page we always send value for 'visibleToPublic'
    const visibleToPublicChanged = CampaignSupportStore.getVisibleToPublicQueuedToSaveSet();
    let visibleToPublic = CampaignSupportStore.getVisibleToPublic();
    if (visibleToPublicChanged) {
      // If it has changed, use new value
      visibleToPublic = CampaignSupportStore.getVisibleToPublicQueuedToSave();
    }
    console.log('functionToUseWhenProfileComplete, visibleToPublic:', visibleToPublic, ', visibleToPublicChanged:', visibleToPublicChanged);
    initializejQuery(() => {
      CampaignSupportActions.supportCampaignSave(campaignXWeVoteId, campaignSupported, campaignSupportedChanged, visibleToPublic, visibleToPublicChanged);
    }, this.goToNextPage());
  }

  render () {
    renderLog('CampaignDetailsPage');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignDetailsPage window.location.href: ${window.location.href}`);
    }
    // const { classes } = this.props;
    const {
      campaignDescription, campaignPhoto, campaignSEOFriendlyPath, campaignTitle, campaignXWeVoteId,
    } = this.state;
    // console.log('render campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
    const htmlTitle = `${campaignTitle} - We Vote Campaigns`;
    return (
      <div>
        <Suspense fallback={<span>&nbsp;</span>}>
          <FirstCampaignController campaignSEOFriendlyPath={campaignSEOFriendlyPath} campaignXWeVoteId={campaignXWeVoteId} />
        </Suspense>
        <Helmet title={htmlTitle} />
        <PageWrapper cordova={isCordova()}>
          <CampaignTopNavigation campaignSEOFriendlyPath={campaignSEOFriendlyPath} />
          <DetailsSectionMobile className="u-show-mobile">
            <CampaignImageWrapper>
              {campaignPhoto ? (
                <CampaignImage src={campaignPhoto} alt="Campaign" />
              ) : (
                <DelayedLoad waitBeforeShow={1000}>
                  <CampaignImagePlaceholder>
                    <CampaignImagePlaceholderText>
                      No image provided
                    </CampaignImagePlaceholderText>
                  </CampaignImagePlaceholder>
                </DelayedLoad>
              )}
            </CampaignImageWrapper>
            <CampaignTitleAndScoreBar>
              <CampaignTitleMobile>{campaignTitle}</CampaignTitleMobile>
              <Suspense fallback={<span>&nbsp;</span>}>
                <CampaignSupportThermometer />
              </Suspense>
            </CampaignTitleAndScoreBar>
            <CampaignDescriptionWrapper>
              <CampaignDescription>
                {campaignDescription}
              </CampaignDescription>
            </CampaignDescriptionWrapper>
          </DetailsSectionMobile>
          <DetailsSectionDesktopTablet className="u-show-desktop-tablet">
            <CampaignTitleDesktop>{campaignTitle}</CampaignTitleDesktop>
            <ColumnsWrapper>
              <ColumnTwoThirds>
                <CampaignImageDesktopWrapper>
                  {campaignPhoto ? (
                    <CampaignImageDesktop src={campaignPhoto} alt="Campaign" />
                  ) : (
                    <DelayedLoad waitBeforeShow={1000}>
                      <CampaignImagePlaceholder>
                        <CampaignImagePlaceholderText>
                          No image provided
                        </CampaignImagePlaceholderText>
                      </CampaignImagePlaceholder>
                    </DelayedLoad>
                  )}
                </CampaignImageDesktopWrapper>
                <CampaignDescriptionDesktopWrapper>
                  <CampaignDescriptionDesktop>
                    {campaignDescription}
                  </CampaignDescriptionDesktop>
                </CampaignDescriptionDesktopWrapper>
              </ColumnTwoThirds>
              <ColumnOneThird>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CampaignSupportThermometer />
                </Suspense>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CompleteYourProfileOnCampaignDetails
                    campaignSEOFriendlyPath={campaignSEOFriendlyPath}
                    campaignXWeVoteId={campaignXWeVoteId}
                    functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
                  />
                </Suspense>
              </ColumnOneThird>
            </ColumnsWrapper>
          </DetailsSectionDesktopTablet>
        </PageWrapper>
        <SupportButtonFooterWrapper className="u-show-mobile">
          <SupportButtonFooter
            campaignSEOFriendlyPath={campaignSEOFriendlyPath}
            campaignXWeVoteId={campaignXWeVoteId}
            functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
          />
        </SupportButtonFooterWrapper>
        <CompleteYourProfileModalController
          functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
          supportCampaign
        />
      </div>
    );
  }
}
CampaignDetailsPage.propTypes = {
  // classes: PropTypes.object,
  match: PropTypes.object,
};

const styles = () => ({
  buttonRoot: {
    width: 250,
  },
});

const CampaignDescription = styled.div`
  font-size: 15px;
  text-align: left;
  white-space: pre-wrap;
`;

const CampaignDescriptionDesktop = styled.div`
  font-size: 15px;
  text-align: left;
  white-space: pre-wrap;
`;

const CampaignDescriptionWrapper = styled.div`
  margin: 10px;
`;

const CampaignDescriptionDesktopWrapper = styled.div`
  margin-bottom: 10px;
  margin-top: 2px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
  }
`;

const CampaignImagePlaceholder = styled.div`
  background-color: #eee;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 170px;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 235px;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    min-height: 300px;
  }
`;

const CampaignImagePlaceholderText = styled.div`
  color: #ccc;
`;

const CampaignImageDesktopWrapper = styled.div`
  margin-bottom: 10px;
  min-height: 170px;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 235px;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    min-height: 300px;
  }
`;

const CampaignImageWrapper = styled.div`
  min-height: 173px;
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    min-height: 152px;
  }
`;

const CampaignImage = styled.img`
  width: 100%;
`;

const CampaignImageDesktop = styled.img`
  border-radius: 5px;
  width: 100%;
`;

const CampaignTitleAndScoreBar = styled.div`
  margin: 10px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
  }
`;

const CampaignTitleDesktop = styled.h1`
  font-size: 28px;
  text-align: center;
  margin: 30px 20px 40px 20px;
  min-height: 29px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 24px;
  }
`;

const CampaignTitleMobile = styled.h1`
  font-size: 22px;
  text-align: left;
  margin: 0;
  margin-bottom: 10px;
`;

const ColumnOneThird = styled.div`
  flex: 1;
  flex-direction: column;
  flex-basis: 40%;
  margin: 0 0 0 25px;
`;

const ColumnsWrapper = styled.div`
  display: flex;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

const ColumnTwoThirds = styled.div`
  flex: 2;
  flex-direction: column;
  flex-basis: 60%;
`;

const DetailsSectionDesktopTablet = styled.div`
  display: flex;
  flex-flow: column;
`;

const DetailsSectionMobile = styled.div`
  display: flex;
  flex-flow: column;
`;

const PageWrapper = styled.div`
  margin: 0 auto;
  max-width: 960px;
`;

const SupportButtonFooterWrapper = styled.div`
`;

export default withStyles(styles)(CampaignDetailsPage);
