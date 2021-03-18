import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import CampaignStore from '../../stores/CampaignStore';
import { renderLog } from '../../utils/logging';
import { numberWithCommas } from '../../utils/textFormat';

class CampaignSupportThermometer extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      numberOfSupportersGoal: 10000,
      supportersCount: 0,
    };
  }

  componentDidMount () {
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
  }

  componentDidUpdate (prevProps, prevState) {
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    const {
      supportersCount: supportersCountPrevious,
    } = prevState;
    // console.log('CampaignSupportThermometer componentDidUpdate campaignXWeVoteId:', campaignXWeVoteId);
    if (campaignXWeVoteId) {
      const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
      const {
        supporters_count: supportersCount,
        campaignx_we_vote_id: campaignXWeVoteIdFromDict,
      } = campaignX;
      let supportersCountChanged = false;
      if (campaignXWeVoteIdFromDict) {
        supportersCountChanged = supportersCount !== supportersCountPrevious;
      }
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious || supportersCountChanged) {
        this.onCampaignStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.campaignStoreListener.remove();
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    // console.log('CampaignSupportThermometer onCampaignStoreChange campaignXWeVoteId:', campaignXWeVoteId);
    if (campaignXWeVoteId) {
      const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
      // console.log('CampaignSupportThermometer onCampaignStoreChange campaignX:', campaignX);
      const {
        supporters_count: supportersCount,
        campaignx_we_vote_id: campaignXWeVoteIdFromDict,
      } = campaignX;
      if (campaignXWeVoteIdFromDict) {
        this.setState({
          supportersCount,
        });
      }
    }
  }

  render () {
    renderLog('CampaignSupportThermometer');  // Set LOG_RENDER_EVENTS to log all renders
    const { numberOfSupportersGoal, supportersCount } = this.state;
    const calculatedPercentage = (supportersCount / numberOfSupportersGoal) * 100;
    const minimumPercentageForDisplay = 5;
    const percentageForDisplay = (calculatedPercentage < minimumPercentageForDisplay) ? minimumPercentageForDisplay : calculatedPercentage;

    return (
      <Wrapper>
        <TextWrapper>
          <SupportersText>
            {numberWithCommas(supportersCount)}
            {' '}
            {supportersCount === 1 ? 'supporter.' : 'have supported.'}
          </SupportersText>
          {' '}
          <GoalText>
            Let&apos;s get to
            {' '}
            {numberWithCommas(numberOfSupportersGoal)}
            !
          </GoalText>
        </TextWrapper>
        <ProgressBarWrapper>
          <ProgressBar percentage={percentageForDisplay}>
            <span id="progress-bar" />
            <span id="right-arrow" />
          </ProgressBar>
        </ProgressBarWrapper>
      </Wrapper>
    );
  }
}
CampaignSupportThermometer.propTypes = {
  campaignXWeVoteId: PropTypes.string,
};

const styles = () => ({
  label: {
    fontSize: 12,
    marginTop: 2,
  },
  checkbox: {
    marginTop: '-9px !important',
  },
  button: {
    marginBottom: 12,
  },
});

const GoalText = styled.span`
  font-size: 18px;
`;

const ProgressBar = styled.div`
  background: #ccc;
  border-radius: 6px;
  display: flex;
  width: 100%;
  height: 12px;
  margin: 0px 0 12px;
  span#progress-bar {
    width: ${(props) => props.percentage}%;
    display: block;
    height: 12px;
    border-radius: 6px 0 0 6px;
    background: linear-gradient(
      to right,
      #a7194b,
      #fe2712
    );
  };
  span#right-arrow {
    top: -6px;
    border-bottom: 6px solid transparent;
    border-left: 6px solid #fe2712;
    border-top: 6px solid transparent;
  };
`;

const ProgressBarWrapper = styled.div`
  margin-top: 10px;
`;

const SupportersText = styled.span`
  font-size: 18px;
  color: black !important;
  font-weight: 800;
`;

const TextWrapper = styled.div`
`;

const Wrapper = styled.div`
`;

export default withStyles(styles)(CampaignSupportThermometer);
