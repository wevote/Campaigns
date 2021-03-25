import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import CampaignTopNavigation from '../components/Navigation/CampaignTopNavigation';
import CampaignStore from '../stores/CampaignStore';
import CampaignSupporterStore from '../stores/CampaignSupporterStore';
import { getCampaignXValuesFromIdentifiers } from '../utils/campaignUtils';
import { isCordova } from '../utils/cordovaUtils';
import { renderLog } from '../utils/logging';

const CampaignCommentsList = React.lazy(() => import('../components/Campaign/CampaignCommentsList'));
const CampaignRetrieveController = React.lazy(() => import('../components/Campaign/CampaignRetrieveController'));


class CampaignCommentsPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXWeVoteId: '',
      pathToUseWhenProfileComplete: '',
      payToPromoteStepCompleted: false,
      payToPromoteStepTurnedOn: false,
      sharingStepCompleted: false,
      step2Completed: false,
    };
  }

  componentDidMount () {
    // console.log('CampaignCommentsPage componentDidMount');
    this.onCampaignStoreChange();
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = params;
    // console.log('componentDidMount campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.campaignSupportStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    // retrieveCampaignXFromIdentifiersIfNeeded(campaignSEOFriendlyPath, campaignXWeVoteId);
    let pathToUseWhenProfileComplete;
    if (campaignSEOFriendlyPath) {
      this.setState({
        campaignSEOFriendlyPath,
      });
      pathToUseWhenProfileComplete = `/c/${campaignSEOFriendlyPath}/why-do-you-support`;
    } else {
      this.setState({
        campaignXWeVoteId,
      });
      pathToUseWhenProfileComplete = `/id/${campaignXWeVoteId}/why-do-you-support`;
    }
    this.setState({
      pathToUseWhenProfileComplete,
    });
  }

  componentWillUnmount () {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.campaignStoreListener.remove();
    this.campaignSupportStoreListener.remove();
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
    let pathToUseWhenProfileComplete;
    if (campaignSEOFriendlyPath) {
      pathToUseWhenProfileComplete = `/c/${campaignSEOFriendlyPath}/why-do-you-support`;
      this.setState({
        campaignSEOFriendlyPath,
        pathToUseWhenProfileComplete,
      });
    } else if (campaignXWeVoteId) {
      pathToUseWhenProfileComplete = `/id/${campaignXWeVoteId}/why-do-you-support`;
    }
    if (campaignXWeVoteId) {
      this.setState({
        campaignXWeVoteId,
      });
    }
    this.setState({
      campaignDescription,
      campaignPhoto,
      campaignTitle,
    });
  }

  onCampaignSupporterStoreChange () {
    const { campaignXWeVoteId } = this.state;
    const step2Completed = CampaignSupporterStore.supporterEndorsementExists(campaignXWeVoteId);
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

  render () {
    renderLog('CampaignCommentsPage');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignCommentsPage window.location.href: ${window.location.href}`);
    }
    // const { classes } = this.props;
    const {
      campaignSEOFriendlyPath, campaignTitle, campaignXWeVoteId,
    } = this.state;
    // console.log('render campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
    const htmlTitle = `Supporter Comments, ${campaignTitle} - We Vote Campaigns`;
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
          <CampaignTopNavigation campaignSEOFriendlyPath={campaignSEOFriendlyPath} campaignXWeVoteId={campaignXWeVoteId} />
          <CommentsSectionOuterWrapper>
            <CommentsSectionInnerWrapper>
              <PageStatement>
                Reasons for supporting
              </PageStatement>
              <PageSubStatement>
                See why others support this campaign and why it is important to them.
              </PageSubStatement>
              <CommentsListWrapper>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CampaignCommentsList />
                </Suspense>
              </CommentsListWrapper>
            </CommentsSectionInnerWrapper>
          </CommentsSectionOuterWrapper>
        </PageWrapper>
      </div>
    );
  }
}
CampaignCommentsPage.propTypes = {
  // classes: PropTypes.object,
  match: PropTypes.object,
};

const styles = () => ({
  buttonRoot: {
    width: 250,
  },
});

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

const PageSubStatement = styled.div`
  margin-top: 10px;
`;

const PageStatement = styled.h2`
  font-size: 22px;
  margin-top: 30px;
  text-align: left;
`;

const PageWrapper = styled.div`
  margin: 0 auto;
  max-width: 960px;
`;

export default withStyles(styles)(CampaignCommentsPage);
