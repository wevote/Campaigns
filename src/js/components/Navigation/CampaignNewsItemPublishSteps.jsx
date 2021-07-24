import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Done } from '@material-ui/icons';
import AppStore from '../../stores/AppStore';
import CampaignStore from '../../stores/CampaignStore';
import { historyPush, isCordova } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';


class CampaignNewsItemPublishSteps extends Component {
  constructor (props) {
    super(props);
    this.state = {
      step1Completed: false,
      step2Completed: false,
      step3Completed: false,
      step4Completed: false,
      siteConfigurationHasBeenRetrieved: false,
    };
  }

  componentDidMount () {
    // console.log('CampaignNewsItemPublishSteps, componentDidMount');
    this.onAppStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('CampaignNewsItemPublishSteps componentDidUpdate');
    const {
      campaignXNewsItemWeVoteId: campaignXNewsItemWeVoteIdPrevious,
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXNewsItemWeVoteId,
      campaignXWeVoteId,
    } = this.props;
    let updateFromStore = false;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        updateFromStore = true;
      }
    }
    if (campaignXNewsItemWeVoteId) {
      if (campaignXNewsItemWeVoteId !== campaignXNewsItemWeVoteIdPrevious) {
        updateFromStore = true;
      }
    }
    if (updateFromStore) {
      this.onCampaignStoreChange();
    }
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
    this.campaignStoreListener.remove();
  }

  onAppStoreChange () {
    const siteConfigurationHasBeenRetrieved = AppStore.siteConfigurationHasBeenRetrieved();
    this.setState({
      siteConfigurationHasBeenRetrieved,
    });
  }

  onCampaignStoreChange () {
    const { campaignXNewsItemWeVoteId } = this.props;
    // atStepNumber1, atStepNumber1, atStepNumber2, atStepNumber3,
    const step1Completed = CampaignStore.campaignNewsItemTextExists(campaignXNewsItemWeVoteId);
    const step2Completed = false;
    const step3Completed = false;
    const step4Completed = false;
    this.setState({
      step1Completed,
      step2Completed,
      step3Completed,
      step4Completed,
    });
  }

  render () {
    renderLog('CampaignNewsItemPublishSteps');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignNewsItemPublishSteps window.location.href: ${window.location.href}`);
    }
    const {
      atStepNumber1, atStepNumber2, atStepNumber3, atStepNumber4,
      campaignBasePath, classes,
    } = this.props;
    let { campaignXNewsItemWeVoteId } = this.props;
    const {
      step1Completed, step2Completed, step3Completed, step4Completed,
      siteConfigurationHasBeenRetrieved,
    } = this.state;
    campaignXNewsItemWeVoteId = campaignXNewsItemWeVoteId || '';
    return (
      <div>
        <OuterWrapperPageTitle>
          <InnerWrapper>
            <PageTitle>
              Update Supporters
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
                    inverseColor={atStepNumber1}
                    onClick={() => historyPush(`${campaignBasePath}/add-update/${campaignXNewsItemWeVoteId}`)}
                  >
                    <StepNumber inverseColor={atStepNumber1}>
                      <Done classes={{ root: classes.doneIcon }} />
                    </StepNumber>
                  </StepCircle>
                ) : (
                  <StepCircle
                    className="u-cursor--pointer"
                    inverseColor={atStepNumber1}
                    onClick={() => historyPush(`${campaignBasePath}/add-update/${campaignXNewsItemWeVoteId}`)}
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
                    onClick={() => historyPush(`${campaignBasePath}/add-update/${campaignXNewsItemWeVoteId}`)}
                  >
                    <StepNumber inverseColor={atStepNumber2}>
                      <Done classes={{ root: classes.doneIcon }} />
                    </StepNumber>
                  </StepCircle>
                ) : (
                  <StepCircle
                    className="u-cursor--pointer"
                    inverseColor={atStepNumber2}
                    onClick={() => historyPush(`${campaignBasePath}/add-update/${campaignXNewsItemWeVoteId}`)}
                  >
                    <StepNumber inverseColor={atStepNumber2}>2</StepNumber>
                  </StepCircle>
                )}
              </StepWrapper>
              <StepWrapper>
                {step3Completed ? (
                  <StepCircle
                    className="u-cursor--pointer"
                    inverseColor={atStepNumber3}
                    onClick={() => historyPush(`${campaignBasePath}/add-update/${campaignXNewsItemWeVoteId}`)}
                  >
                    <StepNumber inverseColor={atStepNumber3}>
                      <Done classes={{ root: classes.doneIcon }} />
                    </StepNumber>
                  </StepCircle>
                ) : (
                  <StepCircle
                    className="u-cursor--pointer"
                    inverseColor={atStepNumber3}
                    onClick={() => historyPush(`${campaignBasePath}/add-update/${campaignXNewsItemWeVoteId}`)}
                  >
                    <StepNumber inverseColor={atStepNumber3}>3</StepNumber>
                  </StepCircle>
                )}
              </StepWrapper>
              <StepWrapper>
                {step4Completed ? (
                  <StepCircle
                    className="u-cursor--pointer"
                    inverseColor={atStepNumber4}
                    onClick={() => historyPush(`${campaignBasePath}/add-update/${campaignXNewsItemWeVoteId}`)}
                  >
                    <StepNumber inverseColor={atStepNumber4}>
                      <Done classes={{ root: classes.doneIcon }} />
                    </StepNumber>
                  </StepCircle>
                ) : (
                  <StepCircle
                    className="u-cursor--pointer"
                    inverseColor={atStepNumber4}
                    onClick={() => historyPush(`${campaignBasePath}/add-update/${campaignXNewsItemWeVoteId}`)}
                  >
                    <StepNumber inverseColor={atStepNumber4}>4</StepNumber>
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
CampaignNewsItemPublishSteps.propTypes = {
  classes: PropTypes.object,
  atStepNumber1: PropTypes.bool,
  atStepNumber2: PropTypes.bool,
  atStepNumber3: PropTypes.bool,
  atStepNumber4: PropTypes.bool,
  campaignBasePath: PropTypes.string,
  campaignXNewsItemWeVoteId: PropTypes.string,
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

export default withStyles(styles)(CampaignNewsItemPublishSteps);
