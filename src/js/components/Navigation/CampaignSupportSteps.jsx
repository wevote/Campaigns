import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Done } from '@material-ui/icons';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';


class CampaignSupportSteps extends Component {
  constructor (props) {
    super(props);
    this.state = {
      step1Completed: true,
      step2Completed: false,
      payToPromoteStepCompleted: false,
      payToPromoteStepTurnedOn: false,
      sharingStepCompleted: false,
      siteConfigurationHasBeenRetrieved: false,
    };
  }

  componentDidMount () {
    // console.log('CampaignSupportSteps, componentDidMount');
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.onCampaignSupporterStoreChange();
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    const step1Completed = true;
    this.setState({
      step1Completed,
    });
  }

  componentDidUpdate (prevProps) {
    // console.log('CampaignSupportSteps componentDidUpdate');
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignSupporterStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.campaignSupporterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    const inPrivateLabelMode = AppObservableStore.inPrivateLabelMode();
    const siteConfigurationHasBeenRetrieved = AppObservableStore.siteConfigurationHasBeenRetrieved();
    // For now, we assume that paid sites with chosenSiteLogoUrl will turn off "Chip in"
    const payToPromoteStepTurnedOn = !inPrivateLabelMode;
    this.setState({
      payToPromoteStepTurnedOn,
      siteConfigurationHasBeenRetrieved,
    });
  }

  onCampaignSupporterStoreChange () {
    const { atPayToPromoteStep, atSharingStep, campaignXWeVoteId } = this.props;
    const step2Completed = atPayToPromoteStep || atSharingStep || CampaignSupporterStore.voterSupporterEndorsementExists(campaignXWeVoteId);
    const payToPromoteStepCompleted = atSharingStep;
    const sharingStepCompleted = false;
    // console.log('onCampaignSupporterStoreChange step1Completed: ', step1Completed, ', step2Completed: ', step2Completed, ', payToPromoteStepCompleted:', payToPromoteStepCompleted);
    this.setState({
      step2Completed,
      payToPromoteStepCompleted,
      sharingStepCompleted,
    });
  }

  render () {
    renderLog('CampaignSupportSteps');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      atStepNumber1, atStepNumber2, atPayToPromoteStep, atSharingStep,
      campaignBasePath, classes,
    } = this.props;
    const {
      step1Completed, step2Completed, payToPromoteStepCompleted,
      payToPromoteStepTurnedOn, sharingStepCompleted, siteConfigurationHasBeenRetrieved,
    } = this.state;
    return (
      <div>
        <OuterWrapperPageTitle>
          <InnerWrapper>
            <PageTitle>
              Complete Your Support
            </PageTitle>
          </InnerWrapper>
        </OuterWrapperPageTitle>
        <OuterWrapperSteps>
          {siteConfigurationHasBeenRetrieved && (
            <InnerWrapper>
              <StepWrapper>
                {step1Completed ? (
                  <StepCircle
                    className="u-cursor--pointer"
                    onClick={() => historyPush(`${campaignBasePath}`)}
                  >
                    <StepNumber>
                      <Done classes={{ root: classes.doneIcon }} />
                    </StepNumber>
                  </StepCircle>
                ) : (
                  <StepCircle
                    className="u-cursor--pointer"
                    inverseColor={atStepNumber1}
                    onClick={() => historyPush(`${campaignBasePath}`)}
                  >
                    <StepNumber inverseColor={atStepNumber1}>1</StepNumber>
                  </StepCircle>
                )}
              </StepWrapper>
              <StepWrapper>
                {step2Completed ? (
                  <StepCircle
                    className="u-cursor--pointer"
                    inverseColor={atStepNumber2}
                    onClick={() => historyPush(`${campaignBasePath}/why-do-you-support`)}
                  >
                    <StepNumber inverseColor={atStepNumber2}>
                      <Done classes={{ root: classes.doneIcon }} />
                    </StepNumber>
                  </StepCircle>
                ) : (
                  <StepCircle
                    className="u-cursor--pointer"
                    inverseColor={atStepNumber2}
                    onClick={() => historyPush(`${campaignBasePath}/why-do-you-support`)}
                  >
                    <StepNumber inverseColor={atStepNumber2}>2</StepNumber>
                  </StepCircle>
                )}
              </StepWrapper>
              {payToPromoteStepTurnedOn && (
                <StepWrapper>
                  {payToPromoteStepCompleted ? (
                    <StepCircle
                      className="u-cursor--pointer"
                      inverseColor={atPayToPromoteStep}
                      onClick={() => historyPush(`${campaignBasePath}/pay-to-promote`)}
                    >
                      <StepNumber inverseColor={atPayToPromoteStep}>
                        <Done classes={{ root: classes.doneIcon }} />
                      </StepNumber>
                    </StepCircle>
                  ) : (
                    <StepCircle
                      className="u-cursor--pointer"
                      inverseColor={atPayToPromoteStep}
                      onClick={() => historyPush(`${campaignBasePath}/pay-to-promote`)}
                    >
                      <StepNumber inverseColor={atPayToPromoteStep}>3</StepNumber>
                    </StepCircle>
                  )}
                </StepWrapper>
              )}
              <StepWrapper>
                {sharingStepCompleted ? (
                  <StepCircle
                    className="u-cursor--pointer"
                    inverseColor={atSharingStep}
                    onClick={() => historyPush(`${campaignBasePath}/share-campaign`)}
                  >
                    <StepNumber inverseColor={atSharingStep}>
                      <Done classes={{ root: classes.doneIcon }} />
                    </StepNumber>
                  </StepCircle>
                ) : (
                  <StepCircle
                    className="u-cursor--pointer"
                    inverseColor={atSharingStep}
                    onClick={() => historyPush(`${campaignBasePath}/share-campaign`)}
                  >
                    <StepNumber inverseColor={atSharingStep}>
                      {payToPromoteStepTurnedOn ? '4' : '3'}
                    </StepNumber>
                  </StepCircle>
                )}
              </StepWrapper>
            </InnerWrapper>
          )}
        </OuterWrapperSteps>
      </div>
    );
  }
}
CampaignSupportSteps.propTypes = {
  classes: PropTypes.object,
  atStepNumber1: PropTypes.bool,
  atStepNumber2: PropTypes.bool,
  atPayToPromoteStep: PropTypes.bool,
  atSharingStep: PropTypes.bool,
  campaignBasePath: PropTypes.string,
  campaignXWeVoteId: PropTypes.string,
};

const styles = (theme) => ({
  doneIcon: {
    fontSize: 28,
    [theme.breakpoints.down('lg')]: {
      fontSize: 28,
    },
    paddingTop: '5px',
  },
});

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
`;

const OuterWrapperPageTitle = styled.div`
  display: flex;
  justify-content: center;
  margin: 15px 0 0 0;
`;

const OuterWrapperSteps = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0 35px;
  min-height: 34px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-bottom: 25px;
  }
`;

const PageTitle = styled.div`
  color: #808080;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
`;

const StepCircle = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  background: ${(props) => (props.inverseColor ? props.theme.colors.brandBlue : 'white')};
  border: 2px solid ${(props) => props.theme.colors.brandBlue};
  border-radius: 18px;
  width: 30px;
  height: 30px;
`;

const StepNumber = styled.div`
  color: ${(props) => (props.inverseColor ? 'white' : props.theme.colors.brandBlue)};
  font-size: 16px;
  font-weight: 600;
  margin-top: -2px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 14px;
  }
`;

const StepWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  width: 90px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 70px;
  }
`;

export default withStyles(styles)(CampaignSupportSteps);
