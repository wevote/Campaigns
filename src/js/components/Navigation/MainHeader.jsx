import React from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
// import AppStore from '../../stores/AppStore';
import { renderLog } from '../../utils/logging';
import { cordovaDot, isCordova } from '../../utils/cordovaUtils';
import logoLight from '../../../img/global/svg-icons/we-vote-logo-horizontal-color-200x66.svg';
import logoDark from '../../../img/global/svg-icons/we-vote-logo-horizontal-color-dark-141x46.svg';


const useStyles = makeStyles((theme) => ({
  appBarRoot: {
    borderBottom: '1px solid #ddd',
    boxShadow: 'none',
    paddingBottom: '0',
    paddingTop: '4px',
  },
  logoLinkRoot: {
  },
  menuButton: {
    fontSize: '4px',
    marginRight: theme.spacing(2),
    padding: '0',
  },
  menuRoot: {
    marginTop: '34px',
  },
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  toolbarRoot: {
    minHeight: '0 !important',
  },
}));

export default function MainHeader () {
  const classes = useStyles();
  // const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // const handleChange = (event) => {
  //   setAuth(event.target.checked);
  // };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const extraItems = {
    fontSize: 12,
    paddingTop: 'unset',
    paddingBottom: 6,
    lineHeight: 'unset',
    opacity: '60%',
  };

  const ourPromise = {
    fontSize: 14,
    padding: '10px 15px 24px',
    lineHeight: 'unset',
    opacity: '40%',
  };

  renderLog('MainHeader');

  const chosenSiteLogoUrl = '';  // {AppStore.getChosenSiteLogoUrl()}
  const light = false;
  return (
    <div className={classes.root}>
      <AppBar className={classes.appBarRoot} position="static" color="default">
        <Toolbar className={classes.toolbarRoot} disableGutters>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <HeaderBarWrapper>
              {chosenSiteLogoUrl ? (
                <img
                  alt="Logo"
                  src={chosenSiteLogoUrl}
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
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            &nbsp;
          </Typography>
          <div>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              onClick={handleMenu}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              className={classes.menuRoot}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <Typography variant="h6" className={classes.title} style={ourPromise}>
                Our Promise: We&apos;ll never sell your email.
              </Typography>
              <MenuItem onClick={handleClose}>Your campaigns</MenuItem>
              <MenuItem onClick={handleClose}>Your ballot</MenuItem>
              <MenuItem onClick={handleClose}>Settings</MenuItem>
              <MenuItem onClick={handleClose}>Start a campaign</MenuItem>
              <MenuItem onClick={handleClose}>Membership</MenuItem>
              <MenuItem onClick={handleClose}>Search</MenuItem>
              <span style={{ lineHeight: '28px' }}>&nbsp;</span>
              <MenuItem style={extraItems} onClick={handleClose}>Frequently asked questions</MenuItem>
              <MenuItem style={extraItems} onClick={handleClose}>Terms of service</MenuItem>
              <MenuItem style={extraItems} onClick={handleClose}>Privacy Policy</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

const HeaderBarWrapper = styled.div`
  @media print{
  }
`;

const WeVoteLogoWrapper = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
  }
`;
