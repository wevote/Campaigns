import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import CampaignStartActions from '../../actions/CampaignStartActions';
import { AdviceBox, AdviceBoxText, AdviceBoxTitle, AdviceBoxWrapper } from '../../common/components/Style/adviceBoxStyles';
import commonMuiStyles from '../../common/components/Style/commonMuiStyles';
import { OuterWrapper, PageWrapper } from '../../common/components/Style/stepDisplayStyles';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import AddCandidateInputField from '../../components/CampaignStart/AddPoliticianInputField';
import EditPoliticianList from '../../components/CampaignStart/EditPoliticianList';
import CampaignStartSteps from '../../components/Navigation/CampaignStartSteps';
import { CampaignProcessStepIntroductionText, CampaignProcessStepTitle } from '../../components/Style/CampaignProcessStyles';
import { CampaignStartDesktopButtonPanel, CampaignStartDesktopButtonWrapper, CampaignStartMobileButtonPanel, CampaignStartMobileButtonWrapper, CampaignStartSection, CampaignStartSectionWrapper } from '../../components/Style/CampaignStartStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignStartStore from '../../stores/CampaignStartStore';
import initializejQuery from '../../utils/initializejQuery';


class CampaignStartAddPolitician extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('CampaignStartAddPolitician, componentDidMount');
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

  submitPoliticianStarterList = () => {
    const campaignPoliticianDeleteList = CampaignStartStore.getCampaignPoliticianDeleteList();
    const campaignPoliticianStarterListQueuedToSave = CampaignStartStore.getCampaignPoliticianStarterListQueuedToSave();
    const campaignPoliticianStarterListQueuedToSaveSet = CampaignStartStore.getCampaignPoliticianStarterListQueuedToSaveSet();
    // Has a change been made that needs to be saved?
    // console.log('CampaignStartAddPolitician, campaignPoliticianStarterListQueuedToSaveSet:', campaignPoliticianStarterListQueuedToSaveSet);
    if (campaignPoliticianStarterListQueuedToSaveSet || campaignPoliticianDeleteList.length > 0) {
      // console.log('CampaignStartAddPolitician, campaignPoliticianStarterListQueuedToSave:', campaignPoliticianStarterListQueuedToSave);
      const campaignWeVoteId = '';
      const campaignPoliticianDeleteListJson = JSON.stringify(campaignPoliticianDeleteList);
      const campaignPoliticianStarterListQueuedToSaveJson = JSON.stringify(campaignPoliticianStarterListQueuedToSave);
      // console.log('CampaignStartAddPolitician, campaignPoliticianStarterListQueuedToSaveJson:', campaignPoliticianStarterListQueuedToSaveJson);
      CampaignStartActions.campaignPoliticianStarterListSave(campaignWeVoteId, campaignPoliticianStarterListQueuedToSaveJson, campaignPoliticianDeleteListJson);
      CampaignStartActions.campaignPoliticianStarterListQueuedToSave('');
    }
    historyPush('/start-a-campaign-why-winning-matters');
  }

  render () {
    renderLog('CampaignStartAddPolitician');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { chosenWebsiteName } = this.state;
    const mobileButtonClasses = classes.buttonDefault; // isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;
    return (
      <div>
        <Helmet title={`Add Candidate - ${chosenWebsiteName}`} />
        <PageWrapper>
          <OuterWrapper>
            <InnerWrapper>
              <CampaignStartSteps atStepNumber2 />
              <CampaignProcessStepTitle>
                Who do you want to win?
              </CampaignProcessStepTitle>
              <CampaignProcessStepIntroductionText>
                Choose the candidate(s) you want to win. These are the politicians who will support your values and the policies you care about.
              </CampaignProcessStepIntroductionText>
              <CampaignStartSectionWrapper>
                <CampaignStartSection>
                  <EditPoliticianList />
                  <AddCandidateInputField />
                  <CampaignStartDesktopButtonWrapper className="u-show-desktop-tablet">
                    <CampaignStartDesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="saveCampaignPoliticianList"
                        onClick={this.submitPoliticianStarterList}
                        variant="contained"
                      >
                        Continue
                      </Button>
                    </CampaignStartDesktopButtonPanel>
                  </CampaignStartDesktopButtonWrapper>
                  <AdviceBoxWrapper>
                    <AdviceBox>
                      <AdviceBoxTitle>
                        Choose the names of politicians your friends can vote for
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Most groups of friends can only vote in a few counties, or one state. Try to focus on candidates your friends will be able to vote for.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Don’t overwhelm your friends
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        You may personally support dozens of politicians all over the country. Focus on a few politicians who will be in the closest races.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Don’t overthink it
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        You can add or change candidate(s) later. For now, just start with one and write the rest of your campaign.
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
              id="saveCampaignPoliticianListFooter"
              onClick={this.submitPoliticianStarterList}
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
CampaignStartAddPolitician.propTypes = {
  classes: PropTypes.object,
};

const InnerWrapper = styled('div')`
`;

export default withStyles(commonMuiStyles)(CampaignStartAddPolitician);
