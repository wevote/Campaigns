import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import AppStore from '../stores/AppStore';
import {
  BlockedReason,
} from '../components/Style/CampaignIndicatorStyles';
import CampaignTopNavigation from '../components/Navigation/CampaignTopNavigation';
import CampaignStore from '../stores/CampaignStore';
import CampaignNewsStore from '../stores/CampaignNewsItemStore';
import { getCampaignXValuesFromIdentifiers } from '../utils/campaignUtils';
import { isCordova } from '../utils/cordovaUtils';
import OpenExternalWebSite from '../components/Widgets/OpenExternalWebSite';
import { renderLog } from '../utils/logging';

const CampaignNewsItemList = React.lazy(() => import('../components/Campaign/CampaignNewsItemList'));
const CampaignRetrieveController = React.lazy(() => import('../components/Campaign/CampaignRetrieveController'));
const CampaignNewsItemCreateButton = React.lazy(() => import('../components/CampaignNewsItemPublish/CampaignNewsItemCreateButton'));

class CampaignNewsPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXWeVoteId: '',
      chosenWebsiteName: '',
    };
  }

  componentDidMount () {
    // console.log('CampaignNewsPage componentDidMount');
    this.onCampaignStoreChange();
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = params;
    // console.log('componentDidMount campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
    this.onAppStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.campaignNewsStoreListener = CampaignNewsStore.addListener(this.onCampaignNewsStoreChange.bind(this));
    if (campaignSEOFriendlyPath) {
      this.setState({
        campaignSEOFriendlyPath,
      });
    } else {
      this.setState({
        campaignXWeVoteId,
      });
    }
  }

  componentWillUnmount () {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.appStoreListener.remove();
    this.campaignStoreListener.remove();
    this.campaignNewsStoreListener.remove();
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
    // console.log('onCampaignStoreChange campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    const {
      campaignSEOFriendlyPath,
      campaignTitle,
      campaignXWeVoteId,
      isBlockedByWeVote,
      isBlockedByWeVoteReason,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    if (campaignSEOFriendlyPath) {
      this.setState({
        campaignSEOFriendlyPath,
      });
    }
    if (campaignXWeVoteId) {
      const voterCanEditThisCampaign = CampaignStore.getVoterCanEditThisCampaign(campaignXWeVoteId);
      this.setState({
        campaignXWeVoteId,
        voterCanEditThisCampaign,
      });
    }
    this.setState({
      campaignTitle,
      isBlockedByWeVote,
      isBlockedByWeVoteReason,
    });
  }

  onCampaignNewsStoreChange () {
  }

  render () {
    renderLog('CampaignNewsPage');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignNewsPage window.location.href: ${window.location.href}`);
    }
    // const { classes } = this.props;
    const {
      campaignSEOFriendlyPath, campaignTitle, campaignXWeVoteId, chosenWebsiteName,
      isBlockedByWeVote, isBlockedByWeVoteReason, voterCanEditThisCampaign,
    } = this.state;
    // console.log('render campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
    const htmlTitle = `Updates, ${campaignTitle} - ${chosenWebsiteName}`;
    if (isBlockedByWeVote && !voterCanEditThisCampaign) {
      return (
        <PageWrapper cordova={isCordova()}>
          <Helmet>
            <title>{htmlTitle}</title>
          </Helmet>
          <CampaignTitleWrapper>
            <CampaignTitleText>{campaignTitle}</CampaignTitleText>
          </CampaignTitleWrapper>
          <BlockedReason>
            This campaign has been blocked by moderators from We Vote because it is currently violating our terms of service. It is only visible campaign owners. If you have any questions,
            {' '}
            <OpenExternalWebSite
              linkIdAttribute="weVoteSupport"
              url="https://help.wevote.us/hc/en-us/requests/new"
              target="_blank"
              body={<span>please contact We Vote support.</span>}
            />
            {isBlockedByWeVoteReason && (
              <>
                <br />
                <hr />
                &quot;
                {isBlockedByWeVoteReason}
                &quot;
              </>
            )}
          </BlockedReason>
        </PageWrapper>
      );
    }
    return (
      <div>
        <Suspense fallback={<span>&nbsp;</span>}>
          <CampaignRetrieveController campaignSEOFriendlyPath={campaignSEOFriendlyPath} campaignXWeVoteId={campaignXWeVoteId} />
        </Suspense>
        <Helmet title={htmlTitle} />
        <PageWrapper cordova={isCordova()}>
          <CampaignTitleWrapper>
            <CampaignTitleText>{campaignTitle}</CampaignTitleText>
          </CampaignTitleWrapper>
          {isBlockedByWeVote && (
            <BlockedReason>
              Your campaign has been blocked by moderators from We Vote. Please make any requested modifications so you are in compliance with our terms of service and
              {' '}
              <OpenExternalWebSite
                linkIdAttribute="weVoteSupport"
                url="https://help.wevote.us/hc/en-us/requests/new"
                target="_blank"
                body={<span>contact We Vote support for help.</span>}
              />
              {isBlockedByWeVoteReason && (
                <>
                  <br />
                  <hr />
                  &quot;
                  {isBlockedByWeVoteReason}
                  &quot;
                </>
              )}
            </BlockedReason>
          )}
          <CampaignTopNavigation campaignSEOFriendlyPath={campaignSEOFriendlyPath} campaignXWeVoteId={campaignXWeVoteId} />
          <CommentsSectionOuterWrapper>
            <CommentsSectionInnerWrapper>
              <PageStatementWrapper>
                <PageStatement>
                  Recent Updates
                </PageStatement>
                {voterCanEditThisCampaign && (
                  <CampaignNewsButtonDesktopWrapper className="u-show-desktop-tablet">
                    <Suspense fallback={<span>&nbsp;</span>}>
                      <CampaignNewsItemCreateButton
                        campaignSEOFriendlyPath={campaignSEOFriendlyPath}
                        campaignXWeVoteId={campaignXWeVoteId}
                      />
                    </Suspense>
                  </CampaignNewsButtonDesktopWrapper>
                )}
              </PageStatementWrapper>
              <CommentsListWrapper>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CampaignNewsItemList campaignXWeVoteId={campaignXWeVoteId} />
                </Suspense>
              </CommentsListWrapper>
            </CommentsSectionInnerWrapper>
          </CommentsSectionOuterWrapper>
        </PageWrapper>
        {voterCanEditThisCampaign && (
          <CampaignNewsButtonFooterWrapper className="u-show-mobile">
            <SupportButtonPanel>
              <Suspense fallback={<span>&nbsp;</span>}>
                <CampaignNewsItemCreateButton
                  campaignSEOFriendlyPath={campaignSEOFriendlyPath}
                  campaignXWeVoteId={campaignXWeVoteId}
                />
              </Suspense>
            </SupportButtonPanel>
          </CampaignNewsButtonFooterWrapper>
        )}
      </div>
    );
  }
}
CampaignNewsPage.propTypes = {
  // classes: PropTypes.object,
  match: PropTypes.object,
};

const styles = () => ({
  buttonRoot: {
    width: 250,
  },
});

// const BlockedReason = styled.div`
//   background-color: #efc2c2;
//   border-radius: 4px;
//   color: #2e3c5d;
//   font-size: 18px;
//   margin: 10px;
//   padding: 5px 12px;
// `;

const CampaignNewsButtonDesktopWrapper = styled.div`
`;

const CampaignNewsButtonFooterWrapper = styled.div`
  position: fixed;
  width: 100%;
  bottom: 0;
  display: block;
`;

const SupportButtonPanel = styled.div`
  background-color: #fff;
  border-top: 1px solid #ddd;
  padding: 10px;
`;

const CampaignTitleWrapper = styled.div`
  margin: 10px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
  }
`;

const CampaignTitleText = styled.h1`
  font-size: 22px;
  margin: 0;
  margin-bottom: 10px;
  min-height: 27px;
  text-align: left;
`;

const CommentsListWrapper = styled.div`
  margin: 0 0 25px 0;
`;

const CommentsSectionInnerWrapper = styled.div`
  margin: 0 15px;
  max-width: 680px;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

const CommentsSectionOuterWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const PageStatement = styled.h2`
  font-size: 22px;
  text-align: left;
`;

const PageStatementWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  @media (min-width: 576px) {
    min-width: 500px;
  }
`;

const PageWrapper = styled.div`
  margin: 0 auto;
  max-width: 960px;
`;

export default withStyles(styles)(CampaignNewsPage);
