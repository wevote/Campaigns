import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { AdviceBox, AdviceBoxText, AdviceBoxTitle, AdviceBoxWrapper } from '../../components/Style/AdviceBoxStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
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
import CampaignDescriptionInputField from '../../components/CampaignStart/CampaignDescriptionInputField';
import historyPush from '../../common/utils/historyPush';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../common/utils/logging';


class CampaignStartAddDescription extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('CampaignStartAddDescription, componentDidMount');
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

  submitCampaignDescription = () => {
    const campaignDescriptionQueuedToSave = CampaignStartStore.getCampaignDescriptionQueuedToSave();
    const campaignDescriptionQueuedToSaveSet = CampaignStartStore.getCampaignDescriptionQueuedToSaveSet();
    if (campaignDescriptionQueuedToSaveSet) {
      // console.log('CampaignStartAddDescription, campaignDescriptionQueuedToSave:', campaignDescriptionQueuedToSave);
      const campaignWeVoteId = '';
      CampaignStartActions.campaignDescriptionSave(campaignWeVoteId, campaignDescriptionQueuedToSave);
      CampaignStartActions.campaignDescriptionQueuedToSave(undefined);
    }
    historyPush('/start-a-campaign-add-photo');
  }

  render () {
    renderLog('CampaignStartAddDescription');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { chosenWebsiteName } = this.state;
    const mobileButtonClasses = classes.buttonDefault; // isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;
    return (
      <div>
        <Helmet title={`Add Description - ${chosenWebsiteName}`} />
        <PageWrapper>
          <OuterWrapper>
            <InnerWrapper>
              <CampaignStartSteps atStepNumber3 />
              <CampaignProcessStepTitle>
                Explain why winning matters
              </CampaignProcessStepTitle>
              <CampaignProcessStepIntroductionText>
                People are more likely to support your campaign if it’s clear why you care. Explain how this candidate winning will impact you, your family, or your community.
              </CampaignProcessStepIntroductionText>
              <CampaignStartSectionWrapper>
                <CampaignStartSection>
                  <CampaignDescriptionInputField />
                  <CampaignStartDesktopButtonWrapper className="u-show-desktop-tablet">
                    <CampaignStartDesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="saveCampaignDescription"
                        onClick={this.submitCampaignDescription}
                        variant="contained"
                      >
                        Continue
                      </Button>
                    </CampaignStartDesktopButtonPanel>
                  </CampaignStartDesktopButtonWrapper>
                  <AdviceBoxWrapper>
                    <AdviceBox>
                      <AdviceBoxTitle>
                        Describe the people who will be affected if this candidate loses
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        People are most likely to vote when they understand the consequences of this candidate not being elected, described in terms of the people impacted.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Describe the benefits of this candidate winning
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Explain why this candidate or candidates winning will bring positive change.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Make it personal
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Voters are more likely to sign and support your campaign if it’s clear why you care.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Respect others
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Don’t bully, use hate speech, threaten violence or make things up.
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
              id="saveCampaignDescriptionFooter"
              onClick={this.submitCampaignDescription}
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
CampaignStartAddDescription.propTypes = {
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

export default withStyles(styles)(CampaignStartAddDescription);
