import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import CampaignStore from '../../stores/CampaignStore';
import { numberWithCommas } from '../../utils/textFormat';

class CampaignSupportThermometer extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      supportersCountNextGoal: 0,
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
        supporters_count_next_goal: supportersCountNextGoal,
        campaignx_we_vote_id: campaignXWeVoteIdFromDict,
      } = campaignX;
      if (campaignXWeVoteIdFromDict) {
        this.setState({
          supportersCount,
          supportersCountNextGoal,
        });
      }
    }
  }

  render () {
    renderLog('CampaignSupportThermometer');  // Set LOG_RENDER_EVENTS to log all renders
    const { inCompressedMode } = this.props;
    const { supportersCount, supportersCountNextGoal } = this.state;
    const calculatedPercentage = (supportersCount / supportersCountNextGoal) * 100;
    const minimumPercentageForDisplay = 5;
    const percentageForDisplay = (calculatedPercentage < minimumPercentageForDisplay) ? minimumPercentageForDisplay : calculatedPercentage;

    return (
      <Wrapper>
        <TextWrapper>
          <SupportersText inCompressedMode={inCompressedMode}>
            {numberWithCommas(supportersCount)}
            {' '}
            {supportersCount === 1 ? 'supporter.' : 'have supported.'}
          </SupportersText>
          {!inCompressedMode && (
            <GoalText>
              {' '}
              Let&apos;s get to
              {' '}
              {numberWithCommas(supportersCountNextGoal)}
              !
            </GoalText>
          )}
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
  inCompressedMode: PropTypes.bool,
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

const GoalText = styled('span')`
  font-size: 18px;
`;

const ProgressBar = styled('div', {
  shouldForwardProp: (prop) => !['percentage'].includes(prop),
})(({ percentage }) => (`
  background: #ccc;
  border-radius: 6px;
  display: flex;
  width: 100%;
  height: 12px;
  margin: 0 0 12px;
  span#progress-bar {
    width: ${percentage}%;
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
`));

const ProgressBarWrapper = styled('div')`
  margin-top: 6px;
`;

const SupportersText = styled('span', {
  shouldForwardProp: (prop) => !['inCompressedMode'].includes(prop),
})(({ inCompressedMode }) => (`
  color: black !important;
  font-size: ${inCompressedMode ? '16px' : '18px'};
  font-weight: ${inCompressedMode ? '400' : '800'};
`));

const TextWrapper = styled('div')`
`;

const Wrapper = styled('div')`
`;

export default withStyles(styles)(CampaignSupportThermometer);
