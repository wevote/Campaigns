import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { cordovaDot, isCordova } from '../../utils/cordovaUtils';
import logoLight from '../../../img/global/svg-icons/we-vote-logo-horizontal-color-200x66.svg';
import logoDark from '../../../img/global/svg-icons/we-vote-logo-horizontal-color-dark-141x46.svg';

const HeaderBarLogo = ({ classes, logoURL, light }) => (
  <HeaderBarWrapper>
    {logoURL ? (
      <img
        alt="Logo"
        src={logoURL}
      />
    ) : (
      <WeVoteLogoWrapper>
        <Link className={classes.logoLinkRoot} to={`${isCordova() ? '/' : '/'}`} id="logoHeaderBar">
          <img
            alt="We Vote logo"
            src={light ? cordovaDot(logoLight) : cordovaDot(logoDark)}
          />
        </Link>
      </WeVoteLogoWrapper>
    )}
  </HeaderBarWrapper>
);

HeaderBarLogo.propTypes = {
  classes: PropTypes.object,
  logoURL: PropTypes.string,
  light: PropTypes.bool,
};

const HeaderBarWrapper = styled.div`
  @media print{
  }
`;

const WeVoteLogoWrapper = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
  }
`;

export default HeaderBarLogo;
