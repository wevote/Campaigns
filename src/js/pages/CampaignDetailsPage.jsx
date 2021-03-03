import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import CampaignActions from '../actions/CampaignActions';
import CampaignTopNavigation from '../components/Navigation/CampaignTopNavigation';
import CampaignStore from '../stores/CampaignStore';
import { isCordova } from '../utils/cordovaUtils';
import initializejQuery from '../utils/initializejQuery';
import MainFooter from '../components/Navigation/MainFooter';
import MainHeaderBar from '../components/Navigation/MainHeaderBar';
import { renderLog } from '../utils/logging';
import SupportButton from '../components/Campaign/SupportButton';
import SupportButtonFooter from '../components/Campaign/SupportButtonFooter';


class CampaignDetailsPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignPhoto: '',
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXWeVoteId: '',
    };
  }

  componentDidMount () {
    // console.log('CampaignDetailsPage componentDidMount');
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = params;
    // console.log('componentDidMount campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
    let campaignX = {};
    let mustRetrieveCampaign = false;
    if (campaignSEOFriendlyPath) {
      campaignX = CampaignStore.getCampaignXBySEOFriendlyPath(campaignSEOFriendlyPath);
      // console.log('componentDidMount campaignX:', campaignX);
      if (campaignX.constructor === Object) {
        if (!campaignX.campaignx_we_vote_id) {
          mustRetrieveCampaign = true;
        }
      } else {
        mustRetrieveCampaign = true;
      }
      if (mustRetrieveCampaign) {
        initializejQuery(() => {
          CampaignActions.campaignRetrieveBySEOFriendlyPath(campaignSEOFriendlyPath);
        });
      }
    } else if (campaignXWeVoteId) {
      campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
      if (campaignX.constructor === Object) {
        if (!campaignX.campaignx_we_vote_id) {
          mustRetrieveCampaign = true;
        }
      } else {
        mustRetrieveCampaign = true;
      }
      if (mustRetrieveCampaign) {
        initializejQuery(() => {
          CampaignActions.campaignRetrieve(campaignXWeVoteId);
        });
      }
    }
  }

  componentWillUnmount () {
    this.campaignStoreListener.remove();
  }

  onCampaignStoreChange () {
    const { match: { params } } = this.props;
    let { campaignSEOFriendlyPath } = params;
    const { campaignXWeVoteId } = params;
    // console.log('onCampaignStoreChange campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
    let campaignX = {};
    if (campaignSEOFriendlyPath) {
      campaignX = CampaignStore.getCampaignXBySEOFriendlyPath(campaignSEOFriendlyPath);
      this.setState({
        campaignSEOFriendlyPath,
      });
    } else if (campaignXWeVoteId) {
      campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
      ({ seo_friendly_path: campaignSEOFriendlyPath } = campaignX);
      this.setState({
        campaignSEOFriendlyPath,
      });
    }
    if (campaignX.constructor === Object && campaignX.campaignx_we_vote_id) {
      const {
        campaign_description: campaignDescription,
        campaign_title: campaignTitle,
        campaignx_we_vote_id: campaignXWeVoteIdFromObject,
        we_vote_hosted_campaign_photo_large_url: campaignPhoto,
      } = campaignX;
      this.setState({
        campaignDescription,
        campaignPhoto,
        campaignTitle,
        campaignXWeVoteId: campaignXWeVoteIdFromObject,
      });
    }
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
    if (!campaignTitle) {
      return null;
    }
    // console.log('render campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
    return (
      <div>
        <Helmet title="Campaign Home - We Vote Campaigns" />
        <MainHeaderBar />
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
                <SupportButton />
              </ColumnOneThird>
            </ColumnsWrapper>
          </DetailsSectionDesktopTablet>
        </PageWrapper>
        <SupportButtonFooterWrapper className="u-show-mobile">
          <SupportButtonFooter campaignSEOFriendlyPath={campaignSEOFriendlyPath} campaignXWeVoteId={campaignXWeVoteId} />
        </SupportButtonFooterWrapper>
        <MainFooter />
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
  width: 100%;
`;

const CampaignTitleAndScoreBar = styled.div`
  margin: 10px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
  }
`;

const CampaignTitleDesktop = styled.h2`
  font-size: 28px;
  text-align: center;
  margin: 30px 20px 40px 20px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 24px;
  }
`;

const CampaignTitleMobile = styled.h2`
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

const PageWrapper = styled.div`
  margin: 0 auto;
  max-width: 960px;
`;

const SupportButtonFooterWrapper = styled.div`
`;

export default withStyles(styles)(CampaignDetailsPage);
