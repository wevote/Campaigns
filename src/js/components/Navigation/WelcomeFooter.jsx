import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';


class WelcomeFooter extends Component {
  render () {
    const { classes } = this.props;
    return (
      <Wrapper>
        <Top>
          <LinksContainer>
            <Column>
              <ColumnTitle>About We Vote</ColumnTitle>
              <Link id="footerLinkAbout" className={classes.link} to="/about">About &amp; Team</Link>
              <Link id="footerLinkCredits" className={classes.link} to="/credits">Credits &amp; Thanks</Link>
              <OpenExternalWebSite
                linkIdAttribute="footerLinkCareers"
                url="https://www.idealist.org/en/nonprofit/f917ce3db61a46cb8ad2b0d4e335f0af-we-vote-oakland#volops"
                target="_blank"
                body={(
                  <span>Careers</span>
                )}
                className={classes.link}
              />
            </Column>
            <Column>
              <ColumnTitle>Community</ColumnTitle>
              <OpenExternalWebSite
                linkIdAttribute="footerLinkBlog"
                url="https://blog.wevote.us/"
                target="_blank"
                body={(
                  <span>Blog</span>
                )}
                className={classes.link}
              />
              <OpenExternalWebSite
                linkIdAttribute="footerLinkMediaInquiries"
                url="https://help.wevote.us/hc/en-us/requests/new"
                target="_blank"
                body={(
                  <span>Media Inquiries</span>
                )}
                className={classes.link}
              />
              <Link id="footerLinkAttributions" className={classes.link} to="/attributions">Attributions</Link>
            </Column>
            <Column>
              <ColumnTitle>Connect</ColumnTitle>
              <OpenExternalWebSite
                linkIdAttribute="footerLinkJoinOurNewsletter"
                url="http://eepurl.com/cx_frP"
                target="_blank"
                body={(
                  <span>Join Our Newsletter</span>
                )}
                className={classes.link}
              />
              <OpenExternalWebSite
                linkIdAttribute="footerLinkFacebook"
                url="https://www.facebook.com/WeVoteUSA/"
                target="_blank"
                body={(
                  <span>Facebook - WeVoteUSA</span>
                )}
                className={classes.link}
              />
              <OpenExternalWebSite
                linkIdAttribute="footerLinkTwitter"
                url="https://twitter.com/WeVote"
                target="_blank"
                body={(
                  <span>Twitter - @WeVote</span>
                )}
                className={classes.link}
              />
              <OpenExternalWebSite
                linkIdAttribute="footerLinkInstagram"
                url="https://instagram.com/WeVote"
                target="_blank"
                body={(
                  <span>Instagram - @WeVote</span>
                )}
                className={classes.link}
              />
            </Column>
            <Column>
              <ColumnTitle>How it Works</ColumnTitle>
              <Link id="footerLinkForVoters" className={classes.link} to="/how/for-voters">For Voters</Link>
              <Link id="footerLinkForOrganizations" className={classes.link} to="/how/for-organizations">For Organizations</Link>
              <Link id="footerLinkForCampaigns" className={classes.link} to="/how/for-campaigns">For Campaigns</Link>
              <Link id="footerLinkForPricing" className={classes.link} to="/pricing">Pricing</Link>
            </Column>
            <Column>
              <ColumnTitle>Products</ColumnTitle>
              <Link id="footerLinkFreeOnlineTools" className={classes.link} to="/settings/tools">Free Online Tools</Link>
              <Link id="footerLinkPremiumOnlineTools" className={classes.link} to="/settings/tools">Premium Online Tools</Link>
            </Column>
            <Column>
              <ColumnTitle>Support</ColumnTitle>
              <Link id="footerLinkFaq" className={classes.link} to="/faq">Frequent Questions</Link>
              <OpenExternalWebSite
                linkIdAttribute="footerLinkWeVoteHelp"
                url="https://help.wevote.us/hc/en-us"
                target="_blank"
                body={(
                  <span>We Vote Help</span>
                )}
                className={classes.link}
              />
              <Link id="footerLinkPrivacy" className={classes.link} to="/privacy">Privacy</Link>
              <Link id="footerLinkTermsOfUse" className={classes.link} to="/terms">Terms of Use</Link>
            </Column>
          </LinksContainer>
        </Top>
        <Bottom>
          <Text>WeVote.US is brought to you by a partnership between two registered nonprofit organizations, one 501(c)(3) and one 501(c)(4). We do not support or oppose any political candidate or party.</Text>
          <Text>
            The software that powers We Vote is
            {' '}
            <OpenExternalWebSite
              linkIdAttribute="footerLinkOpenSource"
              url="https://github.com/WeVote"
              target="_blank"
              body={(
                <span>open source</span>
              )}
              className={classes.bottomLink}
            />
          </Text>
        </Bottom>
      </Wrapper>
    );
  }
}
WelcomeFooter.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  buttonOutlined: {
    height: 50,
    borderRadius: 32,
    // color: 'white',
    // border: '3px solid white',
    color: 'black',
    border: '3px solid black',
    marginBottom: '1em',
    fontWeight: 'bold',
    [theme.breakpoints.down('md')]: {
      padding: '8px 0',
      // border: '1.5px solid white',
      border: '1.5px solid black',
      height: 40,
    },
    [theme.breakpoints.down('sm')]: {
      width: '47%',
      fontSize: 12,
      // border: '1px solid white',
      border: '1px solid black',
    },
  },
  badgeIcon: {
    width: 200,
    height: 60,
    marginRight: '.5em',
    cursor: 'pointer',
    [theme.breakpoints.down('md')]: {
      width: 175,
      height: 53,
    },
    [theme.breakpoints.down('xs')]: {
      width: 150,
      height: 45,
      marginRight: '.2em',
    },
  },
  appleBadgeIcon: {
    width: 179,
    marginLeft: '.5em',
    cursor: 'pointer',
    [theme.breakpoints.down('md')]: {
      width: 160,
    },
    [theme.breakpoints.down('xs')]: {
      width: 135,
      marginLeft: '.2em',
    },
  },
  link: {
    // color: 'rgb(255, 255, 255, .6)',
    color: 'black',
    fontSize: 13,
    marginBottom: '1em',
    '&:hover': {
      // color: 'white',
      color: 'black',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 16,
    },
  },
  bottomLink: {
    // color: 'white',
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
    '&:hover': {
      // color: 'white',
      color: 'black',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 16,
    },
  },
});

const Wrapper = styled.div`
  color: black;
  background-color: white;
  border-top: 1px solid darkgrey;
  padding: 1em 1em 0 1em;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: 2em;
  }
`;

const Top = styled.div`
  width: 960px;
  max-width: 90vw;
  display: flex;
  flex-flow: row;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-flow: column-reverse;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  flex-flow: row;
  width: 75%;
  justify-content: space-between;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-flow: column;
    width: 100%;
  }
`;

const Column = styled.div`
  width: 150px;
  display: flex;
  flex-flow: column nowrap;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
  }
`;

const ColumnTitle = styled.h3`
  font-size: 18px;
  color: black;
  font-weight: bold;
  margin: .8em 0;
`;

const Bottom = styled.div`
  display: flex;
  flex-flow: column;
  text-align: left;
  border-top: 1px solid lightgray;
`;

const Text = styled.p`
  font-size: 12px;
  margin-right: 0.5em;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 16px;
  }
`;

export default withStyles(styles)(WelcomeFooter);
