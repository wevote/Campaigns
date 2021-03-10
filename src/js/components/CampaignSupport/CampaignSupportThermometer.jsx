import React from 'react';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';
import { numberWithCommas } from '../../utils/textFormat';

class CampaignSupportThermometer extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      numberOfSupportersGoal: 10000,
      supportersCount: 7237,
      shareNameAndEmail: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount () {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = null;
    }
    // this.timeInterval = setInterval(() => this.setCommentsToDisplay(), 3000);
  }

  componentWillUnmount () {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = null;
    }
  }

  handleChange () {
    const { shareNameAndEmail } = this.state;
    this.setState({ shareNameAndEmail: !shareNameAndEmail });
  }

  render () {
    renderLog('CampaignSupportThermometer');  // Set LOG_RENDER_EVENTS to log all renders
    const { numberOfSupportersGoal, supportersCount } = this.state;

    return (
      <Wrapper>
        <TextWrapper>
          <SupportersText>
            {numberWithCommas(supportersCount)}
            {' '}
            have supported.
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
          <ProgressBar percentage={(supportersCount / numberOfSupportersGoal) * 100}>
            <span id="progress-bar" />
            <span id="right-arrow" />
          </ProgressBar>
        </ProgressBarWrapper>
      </Wrapper>
    );
  }
}

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
