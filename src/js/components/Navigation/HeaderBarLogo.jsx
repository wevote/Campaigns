import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logoLight from '../../../img/global/svg-icons/we-vote-logo-horizontal-color-200x66.svg';
import logoDark from '../../../img/global/svg-icons/we-vote-logo-horizontal-color-dark-141x46.svg';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';


class HeaderBarLogo extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chosenSiteLogoUrl: '',
      siteConfigurationHasBeenRetrieved: false,
    };
  }

  componentDidMount () {
    // console.log('HeaderBarLogo componentDidMount');
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
  }

  onAppObservableStoreChange () {
    const chosenSiteLogoUrl = AppObservableStore.getChosenSiteLogoUrl();
    const siteConfigurationHasBeenRetrieved = AppObservableStore.siteConfigurationHasBeenRetrieved();
    this.setState({
      chosenSiteLogoUrl,
      siteConfigurationHasBeenRetrieved,
    });
  }

  render () {
    const { classes } = this.props;
    const { chosenSiteLogoUrl, siteConfigurationHasBeenRetrieved } = this.state;
    // console.log('chosenSiteLogoUrl:', chosenSiteLogoUrl, ', siteConfigurationHasBeenRetrieved:', siteConfigurationHasBeenRetrieved)
    const light = false;
    return (
      <HeaderBarWrapper>
        {siteConfigurationHasBeenRetrieved && (
          <div>
            {chosenSiteLogoUrl ? (
              <ChosenSiteLogoWrapper>
                <Link
                  className={classes.logoLinkRoot}
                  to="/"
                  id="logoHeaderBar"
                >
                  <ChosenSiteLogoImage
                    alt="Logo"
                    src={chosenSiteLogoUrl}
                  />
                </Link>
              </ChosenSiteLogoWrapper>
            ) : (
              <WeVoteLogoWrapper>
                <Link
                  className={classes.logoLinkRoot}
                  to="/"
                  id="logoHeaderBar"
                >
                  <img
                    width="141"
                    height="44"
                    alt="We Vote logo"
                    src={light ? normalizedImagePath(logoLight) : normalizedImagePath(logoDark)}
                  />
                  <CampaignsSubtitleOuter>
                    <CampaignsSubtitleInner>
                      campaigns
                    </CampaignsSubtitleInner>
                  </CampaignsSubtitleOuter>
                </Link>
              </WeVoteLogoWrapper>
            )}
          </div>
        )}
      </HeaderBarWrapper>
    );
  }
}
HeaderBarLogo.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  logoLinkRoot: {
    height: 0,
    fontSize: 0,
  },
});

const CampaignsSubtitleInner = styled('span')`
  position: absolute;
  font-size: 10px;
  right: 16px;
  top: -15px;
  color: #2e3c5d;
`;

const CampaignsSubtitleOuter = styled('span')`
  position: relative;
`;

const ChosenSiteLogoImage = styled('img')`
  height: 38px;
  margin: 2px;
`;

const ChosenSiteLogoWrapper = styled('div')(({ theme }) => (`
  min-width: 180px;
  ${theme.breakpoints.down('xl')} {
    margin-left: 10px;
  }
`));

const HeaderBarWrapper = styled('div')`
  height: 42px;
`;

const WeVoteLogoWrapper = styled('div')`
  height: 42px;
  min-width: 141px;
`;

export default withStyles(styles)(HeaderBarLogo);
