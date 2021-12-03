import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import logoLight from '../../../img/global/svg-icons/we-vote-logo-horizontal-color-200x66.svg';
import logoDark from '../../../img/global/svg-icons/we-vote-logo-horizontal-color-dark-141x46.svg';


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

const CampaignsSubtitleInner = styled.span`
  position: absolute;
  font-size: 10px;
  right: 16px;
  top: -15px;
  color: #2e3c5d;
`;

const CampaignsSubtitleOuter = styled.span`
  position: relative;
`;

const ChosenSiteLogoImage = styled.img`
  height: 38px;
  margin: 2px;
`;

const ChosenSiteLogoWrapper = styled.div`
  min-width: 180px;
  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    margin-left: 10px;
  }
`;

const HeaderBarWrapper = styled.div`
  height: 42px;
`;

const WeVoteLogoWrapper = styled.div`
  height: 42px;
  min-width: 141px;
`;

export default withStyles(styles)(HeaderBarLogo);
