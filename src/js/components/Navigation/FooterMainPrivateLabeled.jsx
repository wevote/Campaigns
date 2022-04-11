import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import OpenExternalWebSite from '../../common/components/Widgets/OpenExternalWebSite';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';


class FooterMainPrivateLabeled extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chosenAboutOrganizationExternalUrl: false,
    };
  }

  componentDidMount () {
    // console.log('FooterMainPrivateLabeled componentDidMount');
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
  }

  onAppObservableStoreChange () {
    const chosenAboutOrganizationExternalUrl = AppObservableStore.getChosenAboutOrganizationExternalUrl();
    this.setState({
      chosenAboutOrganizationExternalUrl,
    });
  }

  render () {
    const { classes } = this.props;
    const { chosenAboutOrganizationExternalUrl } = this.state;

    return (
      <Wrapper>
        <TopSectionOuterWrapper>
          <TopSectionInnerWrapper>
            <Column>
              <OpenExternalWebSite
                linkIdAttribute="footerLinkAbout"
                url={chosenAboutOrganizationExternalUrl || 'https://wevote.us/more/about'}
                target="_blank"
                body={(
                  <span>About Us</span>
                )}
                className={classes.link}
              />
            </Column>
            <Column>
              <OpenExternalWebSite
                linkIdAttribute="footerLinkWeVoteHelp"
                url="https://help.wevote.us/hc/en-us"
                target="_blank"
                body={(
                  <span>Help</span>
                )}
                className={classes.link}
              />
            </Column>
            <Column>
              <Link id="footerLinkPrivacy" className={classes.link} to="/privacy">Privacy Policy</Link>
            </Column>
            <Column>
              <Link id="footerLinkTermsOfUse" className={classes.link} to="/terms">Terms of Service</Link>
            </Column>
          </TopSectionInnerWrapper>
        </TopSectionOuterWrapper>
      </Wrapper>
    );
  }
}
FooterMainPrivateLabeled.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  link: {
    color: '#333',
    fontSize: 14,
    marginBottom: '1em',
    '&:hover': {
      color: '#4371cc',
    },
    textDecoration: 'none',
    [theme.breakpoints.down('md')]: {
      fontSize: 14,
    },
  },
  bottomLink: {
    color: '#333',
    textDecoration: 'none',
    '&:hover': {
      color: '#4371cc',
    },
  },
});

const Column = styled('div')(({ theme }) => (`
  display: flex;
  flex-flow: column nowrap;
  width: 150px;
  ${theme.breakpoints.down('md')} {
    width: 50%;
  }
  ${theme.breakpoints.down('xs')} {
    width: 100%;
  }
`));

const TopSectionInnerWrapper = styled('div')(({ theme }) => (`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  justify-content: space-between;
  ${theme.breakpoints.down('md')} {
    flex-wrap: wrap;
  }
`));

const TopSectionOuterWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Wrapper = styled('div')`
`;

export default withStyles(styles)(FooterMainPrivateLabeled);
