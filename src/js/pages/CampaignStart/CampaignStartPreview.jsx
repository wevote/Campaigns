import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import AppActions from '../../actions/AppActions';
import CampaignStartActions from '../../actions/CampaignStartActions';
import CampaignStartCompleteYourProfileController from '../../components/CampaignStart/CampaignStartCompleteYourProfileController';
import CampaignStartStore from '../../stores/CampaignStartStore';
import { historyPush, isCordova } from '../../utils/cordovaUtils';
import MainFooter from '../../components/Navigation/MainFooter';
import MainHeaderBar from '../../components/Navigation/MainHeaderBar';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';


class CampaignStartPreview extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('CampaignStartPreview, componentDidMount');
    this.onCampaignStartStoreChange();
    this.onVoterStoreChange();
    this.campaignStartStoreListener = CampaignStartStore.addListener(this.onCampaignStartStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    import('jquery').then(({ default: jquery }) => {
      window.jQuery = jquery;
      window.$ = jquery;
      CampaignStartActions.campaignRetrieveAsOwner('');
    }).catch((error) => console.error('An error occurred while loading jQuery', error));
  }

  componentWillUnmount () {
    this.campaignStartStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onCampaignStartStoreChange () {
    const campaignDescription = CampaignStartStore.getCampaignDescription();
    const campaignPhotoLargeUrl = CampaignStartStore.getCampaignPhotoLargeUrl();
    const campaignTitle = CampaignStartStore.getCampaignTitle();
    const step1Completed = CampaignStartStore.campaignTitleExists();
    const step2Completed = CampaignStartStore.campaignPoliticianListExists();
    const step3Completed = CampaignStartStore.campaignDescriptionExists();
    const readyToPublish = step1Completed && step2Completed && step3Completed;
    const voterSignedInWithEmail = CampaignStartStore.getVoterSignedInWithEmail();
    this.setState({
      campaignDescription,
      campaignPhotoLargeUrl,
      campaignTitle,
      readyToPublish,
      voterSignedInWithEmail,
    });
  }

  onVoterStoreChange () {
    const voterFirstName = VoterStore.getFirstName();
    const voterLastName = VoterStore.getLastName();
    const voterSignedInWithEmail = VoterStore.getVoterIsSignedInWithEmail();
    this.setState({
      voterFirstName,
      voterLastName,
      voterSignedInWithEmail,
    });
  }

  campaignEditAll = () => {
    historyPush('/start-a-campaign-edit-all');
  }

  submitPublishNowDesktop = () => {
    const { voterFirstName, voterLastName, voterSignedInWithEmail } = this.state;
    if (!voterFirstName || !voterLastName || !voterSignedInWithEmail) {
      // Open complete your profile modal
      AppActions.setShowCampaignStartCompleteYourProfileModal(true);
    } else {
      // Mark the campaign as published
      const campaignWeVoteId = '';
      CampaignStartActions.inDraftModeSave(campaignWeVoteId, false);
      historyPush('/profile/started');
    }
  }

  submitPublishNowMobile = () => {
    const { voterFirstName, voterLastName, voterSignedInWithEmail } = this.state;
    if (!voterFirstName || !voterLastName || !voterSignedInWithEmail) {
      // Navigate to the mobile complete your profile page
      historyPush('/start-a-campaign-complete-your-profile');
    } else {
      // Mark the campaign as published
      const campaignWeVoteId = '';
      CampaignStartActions.inDraftModeSave(campaignWeVoteId, false);
      historyPush('/profile/started');
    }
  }

  render () {
    renderLog('CampaignStartPreview');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignStartPreview window.location.href: ${window.location.href}`);
    }
    const { classes } = this.props;
    const {
      campaignDescription, campaignPhotoLargeUrl, campaignTitle, readyToPublish,
      // voterFirstName, voterLastName, voterSignedInWithEmail,
    } = this.state;
    return (
      <div>
        <Helmet title="Preview Your Campaign - We Vote Campaigns" />
        <MainHeaderBar />
        <SaveCancelOuterWrapper>
          <SaveCancelInnerWrapper>
            <SaveCancelButtonsWrapper>
              <Button
                classes={{ root: classes.buttonEdit }}
                color="primary"
                id="campaignEditAll"
                onClick={this.campaignEditAll}
                variant="outlined"
              >
                Edit
              </Button>
              <div className="u-show-mobile-tablet">
                <Button
                  classes={{ root: classes.buttonSave }}
                  color="primary"
                  disabled={!readyToPublish}
                  id="saveCampaignPublishNowMobile"
                  onClick={this.submitPublishNowMobile}
                  variant="contained"
                >
                  Publish now
                </Button>
              </div>
              <div className="u-show-desktop">
                <Button
                  classes={{ root: classes.buttonSave }}
                  color="primary"
                  disabled={!readyToPublish}
                  id="saveCampaignPublishNowDesktop"
                  onClick={this.submitPublishNowDesktop}
                  variant="contained"
                >
                  Publish now
                </Button>
              </div>
            </SaveCancelButtonsWrapper>
          </SaveCancelInnerWrapper>
        </SaveCancelOuterWrapper>
        <PageWrapper cordova={isCordova()}>
          <OuterWrapper>
            <InnerWrapper>
              <CampaignStartSectionWrapper>
                <CampaignStartSection>
                  <DesktopDisplayWrapper className="u-show-desktop-tablet">
                    <CampaignTitleDesktop>{campaignTitle || <CampaignTitleMissing>Title Required</CampaignTitleMissing>}</CampaignTitleDesktop>
                  </DesktopDisplayWrapper>
                  <MobileDisplayWrapper className="u-show-mobile">
                    <CampaignTitleMobile>{campaignTitle || <CampaignTitleMissing>Title Required</CampaignTitleMissing>}</CampaignTitleMobile>
                  </MobileDisplayWrapper>
                  Candidate Name
                  <br />
                  {campaignPhotoLargeUrl ? (
                    <CampaignImage src={campaignPhotoLargeUrl} alt="Campaign" />
                  ) : (
                    <CampaignImageMissing>Photo Missing</CampaignImageMissing>
                  )}
                  {campaignDescription ? (
                    <CampaignDescription>{campaignDescription}</CampaignDescription>
                  ) : (
                    <CampaignDescriptionMissing>Description Required</CampaignDescriptionMissing>
                  )}
                </CampaignStartSection>
              </CampaignStartSectionWrapper>
            </InnerWrapper>
          </OuterWrapper>
        </PageWrapper>
        <CampaignStartCompleteYourProfileController />
        <MainFooter />
      </div>
    );
  }
}
CampaignStartPreview.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  buttonEdit: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 30px',
    textTransform: 'none',
    width: 100,
  },
  buttonSave: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    marginLeft: 10,
    textTransform: 'none',
    width: 200,
    [theme.breakpoints.down('sm')]: {
      width: 150,
    },
  },
  buttonRoot: {
    width: 250,
  },
});

const CampaignDescription = styled.div`
  font-size: 15px;
  margin: 10px 0;
`;

const CampaignDescriptionMissing = styled.div`
  color: red;
  font-size: 18px;
  margin: 10px 0;
`;

const CampaignImage = styled.img`
  width: 100%;
`;

const CampaignImageMissing = styled.div`
  color: red;
  font-size: 18px;
  font-weight: 600;
`;

const CampaignStartSection = styled.div`
  margin-bottom: 60px !important;
  max-width: 620px;
  width: 100%;
`;

const CampaignStartSectionWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const CampaignTitleDesktop = styled.h2`
  font-size: 28px;
  text-align: center;
  margin: 30px 20px 40px 20px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 24px;
  }
`;

const CampaignTitleMissing = styled.div`
  color: red;
`;

const CampaignTitleMobile = styled.h2`
  font-size: 18px;
  text-align: left;
  margin: 0;
`;

const DesktopDisplayWrapper = styled.div`
`;

const InnerWrapper = styled.div`
  width: 100%;
`;

const MobileDisplayWrapper = styled.div`
`;

const OuterWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 15px 0;
`;

const PageWrapper = styled.div`
  margin: 0 auto;
  max-width: 960px;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

const SaveCancelButtonsWrapper = styled.div`
  display: flex;
`;

const SaveCancelInnerWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  margin: 0 auto;
  max-width: 960px;
  padding: 8px 0;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

const SaveCancelOuterWrapper = styled.div`
  background-color: #f6f4f6;
  border-bottom: 1px solid #ddd;
  // margin: 10px 0;
  width: 100%;
`;

export default withStyles(styles)(CampaignStartPreview);
