import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import {
  CampaignSupportSection, CampaignSupportSectionWrapper,
  SkipForNowButtonPanel, SkipForNowButtonWrapper,
} from '../../components/Style/CampaignSupportStyles';
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiersIfNeeded } from '../../utils/campaignUtils';
import historyPush from '../../common/utils/historyPush';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../common/utils/logging';
import ShareActions from '../../common/actions/ShareActions';
import ShareStore from '../../common/stores/ShareStore';
import VoterActions from '../../actions/VoterActions';


class SuperSharingIntro extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('CampaignSupportSteps, componentDidMount');
    const { setShowHeaderFooter } = this.props;
    // const { becomeMember, createNewsItem, startCampaign, supportCampaign } = this.props;
    setShowHeaderFooter(false);
    initializejQuery(() => {
      VoterActions.voterContactListRetrieve();
    });
    // We don't need superShareItemId in this step, but we want to make sure it is stored and retrieved so it is ready for the next step
    const { match: { params } } = this.props;
    const {
      campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams,
      // campaignXNewsItemWeVoteId,
      campaignXWeVoteId: campaignXWeVoteIdFromParams,
    } = params;
    const {
      campaignSEOFriendlyPath,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    let superShareItemId;
    if (campaignXWeVoteId) {
      superShareItemId = ShareStore.getSuperSharedItemDraftIdByWeVoteId(campaignXWeVoteId);
      if (!superShareItemId || superShareItemId === 0) {
        initializejQuery(() => {
          ShareActions.superShareItemRetrieve(campaignXWeVoteId);
        });
      }
    } else if (campaignXWeVoteIdFromParams) {
      superShareItemId = ShareStore.getSuperSharedItemDraftIdByWeVoteId(campaignXWeVoteIdFromParams);
      if (!superShareItemId || superShareItemId === 0) {
        initializejQuery(() => {
          ShareActions.superShareItemRetrieve(campaignXWeVoteIdFromParams);
        });
      }
    }
    // Take the "calculated" identifiers and retrieve if missing
    retrieveCampaignXFromIdentifiersIfNeeded(campaignSEOFriendlyPath, campaignXWeVoteId);
    window.scrollTo(0, 0);
  }

  getCampaignBasePath = () => {
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = params;
    let campaignBasePath;
    if (campaignSEOFriendlyPath) {
      campaignBasePath = `/c/${campaignSEOFriendlyPath}`;
    } else {
      campaignBasePath = `/id/${campaignXWeVoteId}`;
    }
    return campaignBasePath;
  }

  returnToOtherSharingOptions = () => {
    historyPush(`${this.getCampaignBasePath()}/share-campaign`);
  }

  startSuperSharing = () => {
    const { sms } = this.props;
    if (sms) {
      historyPush(`${this.getCampaignBasePath()}/super-sharing-add-sms-contacts`);
    } else {
      historyPush(`${this.getCampaignBasePath()}/super-sharing-add-email-contacts`);
    }
  }

  render () {
    renderLog('SuperSharingIntro');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const mobileButtonClasses = classes.buttonDefault; // isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;
    return (
      <div>
        <Helmet title="Supercharged Sharing" />
        <PageWrapper>
          <OuterWrapper>
            <InnerWrapper>
              <ContentTitle>
                Here&apos;s how supercharged sharing works:
              </ContentTitle>
              <CampaignSupportSectionWrapper>
                <CampaignSupportSection>
                  <TitleRow>
                    <Dot><StepNumber>1</StepNumber></Dot>
                    <StepTitle>Your friendships are precious</StepTitle>
                  </TitleRow>
                  <ContentRow>
                    <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                    <StepText>
                      WeVote.US is a nonpartisan nonprofit and will always protect and keep private your friends&apos; contact information. We will never share or sell their contact information.
                    </StepText>
                  </ContentRow>

                  <TitleRow>
                    <Dot><StepNumber>2</StepNumber></Dot>
                    <StepTitle>You are in control</StepTitle>
                  </TitleRow>
                  <ContentRow>
                    <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                    <StepText>
                      You are the only one who will be able to initiate messages to your friends, until they opt-in.
                    </StepText>
                  </ContentRow>

                  <TitleRow>
                    <Dot><StepNumber>3</StepNumber></Dot>
                    <StepTitle>Delete your friends&apos; info at any time</StepTitle>
                  </TitleRow>
                  <ContentRow>
                    <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                    <StepText>
                      Wipe clean any information you import, any time you would like. We keep the contact info you import in a quarantined data vault, private to you.
                    </StepText>
                  </ContentRow>
                  <DesktopButtonWrapper className="u-show-desktop-tablet">
                    <DesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="startSuperSharingDesktop"
                        onClick={this.startSuperSharing}
                        variant="contained"
                      >
                        Got it! I&apos;m ready to start sharing
                      </Button>
                    </DesktopButtonPanel>
                  </DesktopButtonWrapper>
                </CampaignSupportSection>
              </CampaignSupportSectionWrapper>
              <CampaignSupportSectionWrapper>
                <CampaignSupportSection>
                  <SkipForNowButtonWrapper>
                    <SkipForNowButtonPanel show>
                      <Button
                        classes={{ root: classes.buttonSimpleLink }}
                        color="primary"
                        id="returnToOtherSharing"
                        onClick={this.returnToOtherSharingOptions}
                      >
                        Return to other sharing options
                      </Button>
                    </SkipForNowButtonPanel>
                  </SkipForNowButtonWrapper>
                </CampaignSupportSection>
              </CampaignSupportSectionWrapper>
            </InnerWrapper>
          </OuterWrapper>
        </PageWrapper>
        <MobileButtonWrapper className="u-show-mobile">
          <MobileButtonPanel>
            <Button
              classes={{ root: mobileButtonClasses }}
              color="primary"
              id="startSuperSharingMobile"
              onClick={this.startSuperSharing}
              variant="contained"
            >
              Got it! I&apos;m ready to start sharing
            </Button>
          </MobileButtonPanel>
        </MobileButtonWrapper>
      </div>
    );
  }
}
SuperSharingIntro.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  setShowHeaderFooter: PropTypes.func,
  sms: PropTypes.bool,
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
  buttonSimpleLink: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 12px',
    textDecoration: 'underline',
    textTransform: 'none',
    minWidth: 250,
    '&:hover': {
      color: '#4371cc',
      textDecoration: 'underline',
    },
  },
});

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

export default withStyles(styles)(SuperSharingIntro);
