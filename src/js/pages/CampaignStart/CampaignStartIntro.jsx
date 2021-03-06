import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import AppStore from '../../stores/AppStore';
import { historyPush, isCordova } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';


class CampaignStartIntro extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chosenWebsiteName: '',
      inPrivateLabelMode: false,
      siteConfigurationHasBeenRetrieved: false,
    };
  }

  componentDidMount () {
    // console.log('CampaignSupportSteps, componentDidMount');
    this.onAppStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
  }

  onAppStoreChange () {
    const chosenWebsiteName = AppStore.getChosenWebsiteName();
    const inPrivateLabelMode = AppStore.inPrivateLabelMode();
    const siteConfigurationHasBeenRetrieved = AppStore.siteConfigurationHasBeenRetrieved();
    this.setState({
      chosenWebsiteName,
      inPrivateLabelMode,
      siteConfigurationHasBeenRetrieved,
    });
  }

  render () {
    renderLog('CampaignStartIntro');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignStartIntro window.location.href: ${window.location.href}`);
    }
    const { classes } = this.props;
    const { chosenWebsiteName, inPrivateLabelMode, siteConfigurationHasBeenRetrieved } = this.state;
    const mobileButtonClasses = classes.buttonDefault; // isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;
    return (
      <div>
        <Helmet title={`Start a Campaign - ${chosenWebsiteName}`} />
        <PageWrapper cordova={isCordova()}>
          <OuterWrapper>
            {siteConfigurationHasBeenRetrieved && (
              <InnerWrapper>
                <ContentTitle>
                  Get the most out of
                  {' '}
                  {chosenWebsiteName}
                  :
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
                        Your voice is important, and will convince others to vote for the candidate(s) you like. If your first edits aren&apos;t perfect, don&apos;t worry; you can edit your campaign later.
                      </StepText>
                    </ContentRow>

                    <TitleRow>
                      <Dot><StepNumber>2</StepNumber></Dot>
                      <StepTitle>Community support can lead to victory</StepTitle>
                    </TitleRow>
                    <ContentRow>
                      <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                      <StepText>
                        {chosenWebsiteName}
                        {' '}
                        has tools to help you share your campaign directly with friends via text and email, more broadly via social media, or with other
                        {' '}
                        {chosenWebsiteName}
                        {' '}
                        voters.
                      </StepText>
                    </ContentRow>

                    <TitleRow>
                      <Dot><StepNumber>3</StepNumber></Dot>
                      <StepTitle>Person-to-person persuasion is effective</StepTitle>
                    </TitleRow>
                    <ContentRow>
                      <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                      <StepText>
                        You can make a difference by telling your friends why you want a candidate to win. The more of your friends who vote, the more impact you will have on the outcome of the election.
                      </StepText>
                    </ContentRow>

                    {inPrivateLabelMode && (
                      <>
                        <TitleRow>
                          <Dot><StepNumber>4</StepNumber></Dot>
                          <StepTitle>Our Approval Process</StepTitle>
                        </TitleRow>
                        <ContentRow>
                          <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                          <StepText>
                            Your campaign will appear on
                            {' '}
                            {chosenWebsiteName}
                            {' '}
                            as soon as it has been reviewed and approved. In the meantime, you will be able to see your campaign on Campaigns.WeVote.US.
                          </StepText>
                        </ContentRow>
                      </>
                    )}

                    <DesktopButtonWrapper className="u-show-desktop-tablet">
                      <DesktopButtonPanel>
                        <Button
                          classes={{ root: classes.buttonDesktop }}
                          color="primary"
                          id="campaignStartButton"
                          onClick={() => historyPush('/start-a-campaign-add-title')}
                          variant="contained"
                        >
                          Got it! I&apos;m ready to create my campaign
                        </Button>
                      </DesktopButtonPanel>
                    </DesktopButtonWrapper>
                  </CampaignStartSection>
                </CampaignStartSectionWrapper>
              </InnerWrapper>
            )}
          </OuterWrapper>
        </PageWrapper>
        <MobileButtonWrapper className="u-show-mobile">
          <MobileButtonPanel>
            <Button
              classes={{ root: mobileButtonClasses }}
              color="primary"
              id="campaignStartButtonFooter"
              onClick={() => historyPush('/start-a-campaign-add-title')}
              variant="contained"
            >
              Got it! I&apos;m ready to create
            </Button>
          </MobileButtonPanel>
        </MobileButtonWrapper>
      </div>
    );
  }
}
CampaignStartIntro.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  buttonDefault: {
    boxShadow: 'none !important',
    fontSize: '14px',
    height: '45px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
    [theme.breakpoints.up('xs')]: {
      fontSize: '15px',
    },
  },
  buttonDefaultCordova: {
    boxShadow: 'none !important',
    fontSize: '14px',
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

const CampaignStartSection = styled.div`
  margin-bottom: 60px !important;
  max-width: 450px;
`;

const CampaignStartSectionWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const ContentRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
`;

const ContentTitle = styled.h1`
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
  margin: 0;
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

export default withStyles(styles)(CampaignStartIntro);
