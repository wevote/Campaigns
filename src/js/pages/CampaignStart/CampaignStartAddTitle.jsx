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
import CampaignTitleInputField from '../../components/CampaignStart/CampaignTitleInputField';
import historyPush from '../../utils/historyPush';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../common/utils/logging';


class CampaignStartAddTitle extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('CampaignStartAddTitle, componentDidMount');
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

  submitCampaignTitle = () => {
    const campaignTitleQueuedToSave = CampaignStartStore.getCampaignTitleQueuedToSave();
    const campaignTitleQueuedToSaveSet = CampaignStartStore.getCampaignTitleQueuedToSaveSet();
    if (campaignTitleQueuedToSaveSet) {
      // console.log('CampaignStartAddTitle, campaignTitleQueuedToSave:', campaignTitleQueuedToSave);
      const campaignWeVoteId = '';
      CampaignStartActions.campaignTitleSave(campaignWeVoteId, campaignTitleQueuedToSave);
      CampaignStartActions.campaignTitleQueuedToSave('');
    }
    historyPush('/who-do-you-want-to-see-elected');
  }

  render () {
    renderLog('CampaignStartAddTitle');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { chosenWebsiteName } = this.state;
    const mobileButtonClasses = classes.buttonDefault; // isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;
    return (
      <div>
        <Helmet title={`Add Campaign Title - ${chosenWebsiteName}`} />
        <PageWrapper>
          <OuterWrapper>
            <InnerWrapper>
              <CampaignStartSteps atStepNumber1 />
              <CampaignProcessStepTitle>
                Write your campaign title
              </CampaignProcessStepTitle>
              <CampaignProcessStepIntroductionText>
                This is the first thing people will see about your campaign. Get their attention with a short title that focuses on what the candidate(s) you support will do to improve people&apos;s lives.
              </CampaignProcessStepIntroductionText>
              <CampaignStartSectionWrapper>
                <CampaignStartSection>
                  <CampaignTitleInputField />
                  <CampaignStartDesktopButtonWrapper className="u-show-desktop-tablet">
                    <CampaignStartDesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="saveCampaignTitle"
                        onClick={this.submitCampaignTitle}
                        variant="contained"
                      >
                        Continue
                      </Button>
                    </CampaignStartDesktopButtonPanel>
                  </CampaignStartDesktopButtonWrapper>
                  <AdviceBoxWrapper>
                    <AdviceBox>
                      <AdviceBoxTitle>
                        Keep it short and to the point
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Example: &quot;Sam Davis for Oakland School Board&quot;
                      </AdviceBoxText>
                      <AdviceBoxText>
                        Not: &quot;If you want to have your kids be more engaged at school, vote for Sam Davis for Oakland School Board&quot;
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
              id="saveCampaignTitleFooter"
              onClick={this.submitCampaignTitle}
              variant="contained"
            >
              Continue
            </Button>
          </CampaignStartMobileButtonPanel>
        </CampaignStartMobileButtonWrapper>
      </div>
    );
  }
}
CampaignStartAddTitle.propTypes = {
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

export default withStyles(styles)(CampaignStartAddTitle);
