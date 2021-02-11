import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Done } from '@material-ui/icons';
import { historyPush, isCordova } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';


class CampaignStartSteps extends Component {
  render () {
    renderLog('CampaignStartSteps');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignStartSteps window.location.href: ${window.location.href}`);
    }
    const {
      classes,
      step1CheckMarkOn, step1NumberOn,
      step2CheckMarkOn, step2NumberOn,
      step3CheckMarkOn, step3NumberOn,
    } = this.props;
    return (
      <div>
        <OuterWrapper>
          <InnerWrapper>
            <StepWrapper>
              {step1CheckMarkOn ? (
                <StepCircle inverseColor>
                  <StepNumber inverseColor>
                    <Done classes={{ root: classes.doneIcon }} />
                  </StepNumber>
                </StepCircle>
              ) : (
                <StepCircle inverseColor={step1NumberOn}>
                  <StepNumber inverseColor={step1NumberOn}>1</StepNumber>
                </StepCircle>
              )}
            </StepWrapper>
            <StepWrapper>
              {step2CheckMarkOn ? (
                <StepCircle inverseColor>
                  <StepNumber inverseColor>
                    <Done classes={{ root: classes.doneIcon }} />
                  </StepNumber>
                </StepCircle>
              ) : (
                <StepCircle inverseColor={step2NumberOn}>
                  <StepNumber inverseColor={step2NumberOn}>2</StepNumber>
                </StepCircle>
              )}
            </StepWrapper>
            <StepWrapper>
              {step3CheckMarkOn ? (
                <StepCircle inverseColor>
                  <StepNumber inverseColor>
                    <Done classes={{ root: classes.doneIcon }} />
                  </StepNumber>
                </StepCircle>
              ) : (
                <StepCircle inverseColor={step3NumberOn}>
                  <StepNumber inverseColor={step3NumberOn}>3</StepNumber>
                </StepCircle>
              )}
            </StepWrapper>
          </InnerWrapper>
        </OuterWrapper>
      </div>
    );
  }
}
CampaignStartSteps.propTypes = {
  classes: PropTypes.object,
  step1CheckMarkOn: PropTypes.bool,
  step1NumberOn: PropTypes.bool,
  step2CheckMarkOn: PropTypes.bool,
  step2NumberOn: PropTypes.bool,
  step3CheckMarkOn: PropTypes.bool,
  step3NumberOn: PropTypes.bool,
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

const OuterWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 15px 0 35px;
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

export default withStyles(styles)(CampaignStartSteps);
