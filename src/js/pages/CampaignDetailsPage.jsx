import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import CampaignTopNavigation from '../components/Navigation/CampaignTopNavigation';
import CampaignStore from '../stores/CampaignStore';
import CompleteYourProfileModalController from '../components/Settings/CompleteYourProfileModalController';
import DelayedLoad from '../components/Widgets/DelayedLoad';
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiersIfNeeded } from '../utils/campaignUtils';
import { isCordova } from '../utils/cordovaUtils';
import { renderLog } from '../utils/logging';
import SupportButton from '../components/CampaignSupport/SupportButton';
import SupportButtonFooter from '../components/CampaignSupport/SupportButtonFooter';

const MainFooter = React.lazy(() => import('../components/Navigation/MainFooter'));
const MainHeaderBar = React.lazy(() => import('../components/Navigation/MainHeaderBar'));


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
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = params;
    // console.log('componentDidMount campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
    retrieveCampaignXFromIdentifiersIfNeeded(campaignSEOFriendlyPath, campaignXWeVoteId);
    let pathToUseWhenProfileComplete = '';
    if (campaignSEOFriendlyPath) {
      pathToUseWhenProfileComplete = `/c/${campaignSEOFriendlyPath}/why-do-you-support`;
    } else {
      pathToUseWhenProfileComplete = `/id/${campaignXWeVoteId}/why-do-you-support`;
    }
    this.setState({
      pathToUseWhenProfileComplete,
    });
  }

  componentWillUnmount () {
    this.campaignStoreListener.remove();
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

  render () {
    renderLog('CampaignDetailsPage');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignDetailsPage window.location.href: ${window.location.href}`);
    }
    // const { classes } = this.props;
    const {
      campaignDescription, campaignPhoto, campaignSEOFriendlyPath, campaignTitle, campaignXWeVoteId,
      pathToUseWhenProfileComplete,
    } = this.state;
    if (!campaignTitle) {
      return null;
    }
    // console.log('render campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
    return (
      <div>
        <Helmet title="Campaign Home - We Vote Campaigns" />
        <MainHeaderBarWrapper>
          <Suspense fallback={<span>&nbsp;</span>}>
            <MainHeaderBar />
          </Suspense>
        </MainHeaderBarWrapper>
        <PageWrapper cordova={isCordova()}>
          <CampaignTopNavigation campaignSEOFriendlyPath={campaignSEOFriendlyPath} />
          <DetailsSectionMobile className="u-show-mobile">
            <CampaignImageWrapper>
              <CampaignImage src={campaignPhoto} alt="Campaign" />
            </CampaignImageWrapper>
            <CampaignTitleAndScoreBar>
              <CampaignTitleMobile>{campaignTitle}</CampaignTitleMobile>
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
                <CampaignImageDesktop src={campaignPhoto} alt="Campaign" />
                <CampaignDescriptionDesktopWrapper>
                  <CampaignDescriptionDesktop>
                    {campaignDescription}
                  </CampaignDescriptionDesktop>
                </CampaignDescriptionDesktopWrapper>
              </ColumnTwoThirds>
              <ColumnOneThird>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                <SupportButton pathToUseWhenProfileComplete={pathToUseWhenProfileComplete} />
              </ColumnOneThird>
            </ColumnsWrapper>
          </DetailsSectionDesktopTablet>
        </PageWrapper>
        <SupportButtonFooterWrapper className="u-show-mobile">
          <SupportButtonFooter
            campaignSEOFriendlyPath={campaignSEOFriendlyPath}
            campaignXWeVoteId={campaignXWeVoteId}
            pathToUseWhenProfileComplete={pathToUseWhenProfileComplete}
          />
        </SupportButtonFooterWrapper>
        <DelayedLoad waitBeforeShow={500}>
          <Suspense fallback={<span>&nbsp;</span>}>
            <MainFooter />
          </Suspense>
        </DelayedLoad>
        <CompleteYourProfileModalController
          pathToUseWhenProfileComplete={pathToUseWhenProfileComplete}
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
`;

const CampaignDescriptionDesktop = styled.div`
  font-size: 15px;
  text-align: left;
`;

const CampaignDescriptionWrapper = styled.div`
  margin: 10px;
`;

const CampaignDescriptionDesktopWrapper = styled.div`
  margin: 10px 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
  }
`;

const CampaignImageWrapper = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
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
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 24px;
  }
`;

const CampaignTitleMobile = styled.h1`
  font-size: 18px;
  text-align: left;
  margin: 0;
`;

const ColumnOneThird = styled.div`
  flex: 1;
  flex-direction: column;
  flex-basis: 33%;
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
  flex-basis: 66%;
`;

const DetailsSectionDesktopTablet = styled.div`
  display: flex;
  flex-flow: column;
`;

const DetailsSectionMobile = styled.div`
  display: flex;
  flex-flow: column;
`;

const MainHeaderBarWrapper = styled.div`
  border-bottom: 1px solid #ddd;
  height: 42px;
`;

const PageWrapper = styled.div`
  margin: 0 auto;
  max-width: 960px;
`;

const SupportButtonFooterWrapper = styled.div`
`;

export default withStyles(styles)(CampaignDetailsPage);
