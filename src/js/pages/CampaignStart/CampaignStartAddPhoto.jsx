import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import { AdviceBox, AdviceBoxText, AdviceBoxTitle, AdviceBoxWrapper } from '../../components/Style/AdviceBoxStyles';
import {
  CampaignProcessStepIntroductionText, CampaignProcessStepTitle,
} from '../../components/Style/CampaignProcessStyles';
import {
  CampaignStartDesktopButtonPanel, CampaignStartDesktopButtonWrapper,
  CampaignStartMobileButtonPanel, CampaignStartMobileButtonWrapper,
  CampaignStartSection, CampaignStartSectionWrapper,
} from '../../components/Style/CampaignStartStyles';
import CampaignStartActions from '../../actions/CampaignStartActions';
import CampaignStartSteps from '../../components/Navigation/CampaignStartSteps';
import CampaignStartStore from '../../stores/CampaignStartStore';
import CampaignPhotoUpload from '../../components/CampaignStart/CampaignPhotoUpload';
import historyPush from '../../common/utils/historyPush';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../common/utils/logging';


class CampaignStartAddPhoto extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('CampaignStartAddPhoto, componentDidMount');
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    initializejQuery(() => {
      CampaignStartActions.campaignRetrieveAsOwner('');
    });
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
  }

  onAppObservableStoreChange () {
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
    this.setState({
      chosenWebsiteName,
    });
  }

  submitCampaignPhoto = () => {
    const campaignPhotoQueuedToSave = CampaignStartStore.getCampaignPhotoQueuedToSave();
    const campaignPhotoQueuedToSaveSet = CampaignStartStore.getCampaignPhotoQueuedToSaveSet();
    if (campaignPhotoQueuedToSaveSet) {
      // console.log('CampaignStartAddPhoto, campaignPhotoQueuedToSave:', campaignPhotoQueuedToSave);
      const campaignWeVoteId = '';
      CampaignStartActions.campaignPhotoSave(campaignWeVoteId, campaignPhotoQueuedToSave);
      CampaignStartActions.campaignPhotoQueuedToSave(undefined);
    }
    historyPush('/start-a-campaign-preview');
  }

  render () {
    renderLog('CampaignStartAddPhoto');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { chosenWebsiteName } = this.state;
    const mobileButtonClasses = classes.buttonDefault; // isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;
    return (
      <div>
        <Helmet title={`Add a Photo - ${chosenWebsiteName}`} />
        <PageWrapper>
          <OuterWrapper>
            <InnerWrapper>
              <CampaignStartSteps atStepNumber4 />
              <CampaignProcessStepTitle>
                Add a photo
              </CampaignProcessStepTitle>
              <CampaignProcessStepIntroductionText>
                Campaigns with a photo receive six times more supporters than those without. Include one that captures the emotion of your story.
              </CampaignProcessStepIntroductionText>
              <CampaignStartSectionWrapper>
                <CampaignStartSection>
                  <CampaignPhotoUpload />
                  <CampaignStartDesktopButtonWrapper className="u-show-desktop-tablet">
                    <CampaignStartDesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="saveCampaignPhoto"
                        onClick={this.submitCampaignPhoto}
                        variant="contained"
                      >
                        Save and preview
                      </Button>
                    </CampaignStartDesktopButtonPanel>
                  </CampaignStartDesktopButtonWrapper>
                  <AdviceBoxWrapper>
                    <AdviceBox>
                      <AdviceBoxTitle>
                        Choose a photo that captures the emotion of your campaign
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        A photo of people with your candidate(s) works well.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Try to upload a photo that is 1200 x 628 pixels or larger
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        A large photo will look good on all screen sizes. We can accept one photo up to 5 megabytes in size.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Keep it friendly for all audiences
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Make sure your photo doesn&apos;t include graphic violence or sexual content.
                      </AdviceBoxText>
                    </AdviceBox>
                  </AdviceBoxWrapper>
                </CampaignStartSection>
              </CampaignStartSectionWrapper>
            </InnerWrapper>
          </OuterWrapper>
        </PageWrapper>
        <CampaignStartMobileButtonWrapper className="u-show-mobile">
          <CampaignStartMobileButtonPanel>
            <Button
              classes={{ root: mobileButtonClasses }}
              color="primary"
              id="saveCampaignPhotoFooter"
              onClick={this.submitCampaignPhoto}
              variant="contained"
            >
              Save and preview
            </Button>
          </CampaignStartMobileButtonPanel>
        </CampaignStartMobileButtonWrapper>
      </div>
    );
  }
}
CampaignStartAddPhoto.propTypes = {
  classes: PropTypes.object,
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
    width: '100%',
  },
  buttonRoot: {
    width: 250,
  },
});

const InnerWrapper = styled.div`
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

export default withStyles(styles)(CampaignStartAddPhoto);
