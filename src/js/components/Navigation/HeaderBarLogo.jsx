import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppStore from '../../stores/AppStore';
import { cordovaDot, isCordova } from '../../utils/cordovaUtils';
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
    this.onAppStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
  }

  onAppStoreChange () {
    const chosenSiteLogoUrl = AppStore.getChosenSiteLogoUrl();
    const siteConfigurationHasBeenRetrieved = AppStore.siteConfigurationHasBeenRetrieved();
    this.setState({
      chosenSiteLogoUrl,
      siteConfigurationHasBeenRetrieved,
    });
  }

  render () {
    const { classes } = this.props;
    const { chosenSiteLogoUrl, siteConfigurationHasBeenRetrieved } = this.state;

    const light = false;
    return (
      <HeaderBarWrapper>
        {siteConfigurationHasBeenRetrieved && (
          <div>
            {chosenSiteLogoUrl ? (
              <ChosenSiteLogoWrapper>
                <Link
                  className={classes.logoLinkRoot}
                  to={`${isCordova() ? '/' : '/'}`}
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
                  to={`${isCordova() ? '/' : '/'}`}
                  id="logoHeaderBar"
                >
                  <img
                    width="141"
                    height="44"
                    alt="We Vote logo"
                    src={light ? cordovaDot(logoLight) : cordovaDot(logoDark)}
                  />
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
