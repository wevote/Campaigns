import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { historyPush, isCordova } from '../utils/cordovaUtils';
import MainHeaderBar from '../components/Navigation/MainHeaderBar';
import { renderLog } from '../utils/logging';


class CampaignStartIntro extends Component {
  render () {
    renderLog('CampaignStartIntro');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignStartIntro window.location.href: ${window.location.href}`);
    }
    const { classes } = this.props;
    const mobileButtonClasses = classes.buttonDefault; // isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;
    return (
      <div>
        <Helmet title="Start a Campaign - We Vote Campaigns" />
        <Wrapper cordova={isCordova()}>
          <MainHeaderBar />
          <OuterWrapper>
            <InnerWrapper>
              <ContentTitle>
                Here&apos;s how WeVote.US campaigns work:
              </ContentTitle>
              <CampaignStartSectionWrapper>
                <CampaignStartSection>
                  <TitleRow>
                    <Dot><StepNumber>1</StepNumber></Dot>
                    <StepTitle>Create your campaign</StepTitle>
                  </TitleRow>
                  <ContentRow>
                    <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                    <StepText>
                      Your campaign doesn&apos;t need to be perfect yet! You can edit your campaign later.
                    </StepText>
                  </ContentRow>

                  <TitleRow>
                    <Dot><StepNumber>2</StepNumber></Dot>
                    <StepTitle>Build support</StepTitle>
                  </TitleRow>
                  <ContentRow>
                    <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                    <StepText>
                      WeVote.US has tools to help you share your campaign directly with friends via text and email, more broadly via social media, or with other WeVote.US voters.
                    </StepText>
                  </ContentRow>

                  <TitleRow>
                    <Dot><StepNumber>3</StepNumber></Dot>
                    <StepTitle>Be ready for election day</StepTitle>
                  </TitleRow>
                  <ContentRow>
                    <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                    <StepText>
                      Help your community make sense of their voting decisions, so they can vote their values. The more of your friends who vote, the more impact you will have on the outcome of the election.
                    </StepText>
                  </ContentRow>
                  <DesktopButtonWrapper className="u-show-desktop-tablet">
                    <DesktopButtonPanel>
                      <Button
                        classes={{ root: mobileButtonClasses }}
                        color="primary"
                        id="campaignStartButton"
                        onClick={() => historyPush('/start-a-campaign-title')}
                        variant="contained"
                      >
                        Got it! I&apos;m ready to create my campaign
                      </Button>
                    </DesktopButtonPanel>
                  </DesktopButtonWrapper>
                </CampaignStartSection>
              </CampaignStartSectionWrapper>
            </InnerWrapper>
          </OuterWrapper>
          <MobileButtonWrapper className="u-show-mobile">
            <MobileButtonPanel>
              <Button
                classes={{ root: mobileButtonClasses }}
                color="primary"
                id="campaignStartButtonFooter"
                onClick={() => historyPush('/start-a-campaign-title')}
                variant="contained"
              >
                Got it! I&apos;m ready to create my campaign
              </Button>
            </MobileButtonPanel>
          </MobileButtonWrapper>
        </Wrapper>
      </div>
    );
  }
}
CampaignStartIntro.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  buttonDefault: {
    padding: '0 12px',
    width: '100%',
    boxShadow: 'none !important',
    height: '45px !important',
  },
  buttonDefaultCordova: {
    padding: '0 12px',
    width: '100%',
    boxShadow: 'none !important',
    height: '35px !important',
  },
  buttonRoot: {
    width: 250,
  },
});

const ContentTitle = styled.div`
  font-size: 22px;
  font-weight: 600;
  margin: 20px 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 20px;
  }
`;

const DesktopButtonPanel = styled.div`
  background-color: #fff;
  padding: 10px 0;
`;

const DesktopButtonWrapper = styled.div`
  width: 100%;
  display: block;
  margin: 30px 0;
`;

const Dot = styled.div`
  padding-top: 2px;
  text-align: center;
  align-self: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: 3px;
  }
`;

const InnerWrapper = styled.div`
`;

const MobileButtonPanel = styled.div`
  background-color: #fff;
  border-top: 1px solid #ddd;
  padding: 10px;
`;

const MobileButtonWrapper = styled.div`
  position: fixed;
  width: 100%;
  bottom: 0;
  display: block;
`;

const OuterWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 15px 15px;
`;

const CampaignStartSection = styled.div`
  margin-bottom: 100px !important;
  max-width: 450px;
`;

const ContentRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
`;

const CampaignStartSectionWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const StepNumber = styled.div`
  background: white;
  border: 2px solid ${(props) => props.theme.colors.brandBlue};
  border-radius: 4px;
  color: ${(props) => props.theme.colors.brandBlue};
  font-size: 16px;
  font-weight: 600;
  width: 22px;
  height: 22px;
  padding-top: 1px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 14px;
    min-width: 20px;
    width: 20px;
    height: 20px;
  }
`;

const StepNumberPlaceholder = styled.div`
  width: 27px;
  height: 22px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 20px;
    height: 20px;
    min-width: 20px;
  }
`;

const StepText = styled.div`
  color: #555;
  font-size: 16px;
  padding: 0 8px;
  text-align: left;
  vertical-align: top;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 16px;
    padding: 0 12px;
  }
`;

const StepTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  padding: 0 8px;
  text-align: left;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 17px;
  }
`;

const TitleRow = styled.div`
  align-content: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  padding-top: 14px;
`;

const Wrapper = styled.div`
`;

export default withStyles(styles)(CampaignStartIntro);
