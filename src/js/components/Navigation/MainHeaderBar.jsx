import React, { Suspense } from 'react';
import loadable from '@loadable/component';
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import styled from 'styled-components';
import { historyPush } from '../../utils/cordovaUtils';
import initializeFacebookSDK from '../../utils/initializeFacebookSDK';
import initializeAppleSDK from '../../utils/initializeAppleSDK';
import { renderLog } from '../../utils/logging';
import HeaderBarLogo from './HeaderBarLogo';

const SignInButton = loadable(() => import('./SignInButton'));
const SignInModalController = loadable(() => import('../Settings/SignInModalController'));
const TopNavigationDesktop = loadable(() => import('./TopNavigationDesktop'));
const VoterNameAndPhoto = loadable(() => import('./VoterNameAndPhoto'));


const useStyles = makeStyles((theme) => ({
  appBarRoot: {
    boxShadow: 'none',
    paddingBottom: '0',
  },
  innerWrapper: {
    marginLeft: 'calc((100vw -960px)/4)',
    maxWidth: '960px',
  },
  logoLinkRoot: {
    height: 0,
    fontSize: 0,
  },
  menuButton: {
    fontSize: '4px',
    marginLeft: 0,
    marginRight: theme.spacing(2),
    padding: '0',
  },
  menuIconRoot: {
    color: '#999',
  },
  menuRoot: {
    marginTop: '27px',
  },
  menuItem: {
    [theme.breakpoints.down('md')]: {
      minHeight: 'unset',
    },
    '&:hover': {
      color: '#4371cc',
    },
  },
  menuExtraItem: {
    fontSize: 12,
    paddingTop: 'unset',
    paddingBottom: 6,
    lineHeight: 'unset',
    opacity: '60%',
    [theme.breakpoints.down('md')]: {
      minHeight: 'unset',
    },
    '&:hover': {
      color: '#4371cc',
    },
  },
  menuItemMobileOnly: {
    [theme.breakpoints.up('md')]: {
      display: 'none !important',
    },
    [theme.breakpoints.down('md')]: {
      minHeight: 'unset',
    },
    '&:hover': {
      color: '#4371cc',
    },
  },
  title: {
    flexGrow: 1,
  },
  toolbarRoot: {
    minHeight: '0 !important',
  },
  headerButtonRoot: {
    maxHeight: 42,
  },
}));

export default function MainHeaderBar (displayHeader) {
  const classes = useStyles();
  // const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl) && anchorEl != null;
  const displayThis = displayHeader.displayHeader;

  const handleMenu = (event) => {
    // console.log('MainHeaderBar handleMenu event:', event);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (destination) => {
    // console.log('MainHeaderBar handleClose');
    setAnchorEl(null);
    historyPush(destination);
  };

  const handleCloseNoDestination = () => {
    // console.log('MainHeaderBar handleCloseNoDestination');
    setAnchorEl(null);
  };

  const ourPromise = {
    fontSize: 14,
    padding: '10px 15px 24px',
    lineHeight: 'unset',
    opacity: '40%',
  };

  const { FB, AppleID } = window;
  if (!FB) {
    initializeFacebookSDK();
  }
  if (!AppleID) {
    initializeAppleSDK();
  }


  renderLog('MainHeaderBar');

  const chosenSiteLogoUrl = '';  // {AppStore.getChosenSiteLogoUrl()}
  const light = false;
  // console.log('MainHeaderBar displayHeader: ', displayHeader);
  return (
    <OuterWrapper displayHeader={displayThis}>
      <div className={classes.innerWrapper}>
        <AppBar className={classes.appBarRoot} position="static" color="default">
          <Toolbar className={classes.toolbarRoot} disableGutters>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <HeaderBarLogo classes={classes} light={light} logUrl={chosenSiteLogoUrl} />
            </IconButton>
            <Suspense fallback={<span>&nbsp;</span>}>
              <TopNavigationDesktop />
            </Suspense>
            <Typography variant="h6" className={classes.title}>
              &nbsp;
            </Typography>
            <Suspense fallback={<span>&nbsp;</span>}>
              <SignInModalController />
            </Suspense>
            <div>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                id="openMainHeaderBarDropDown"
                onClick={handleMenu}
                aria-label="menu"
              >
                <Suspense fallback={<span>&nbsp;</span>}>
                  <VoterNameAndPhoto />
                </Suspense>
                <MenuIcon id="mainHeaderBarDropDownMenuIcon" classes={{ root: classes.menuIconRoot }} />
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
                {/* The next 6 lines have a test url of '/', not for production! */}
                <MenuItem className={classes.menuItemMobileOnly} onClick={() => handleClose('/profile/started')}>Your campaigns</MenuItem>
                <MenuItem className={classes.menuItem} onClick={() => handleClose('/')}>Your ballot</MenuItem>
                <MenuItem className={classes.menuItem} onClick={() => handleClose('/edit-profile')}>Settings</MenuItem>
                <MenuItem className={classes.menuItemMobileOnly} onClick={() => handleClose('/start-a-campaign')}>Start a campaign</MenuItem>
                <MenuItem className={classes.menuItemMobileOnly} onClick={() => handleClose('/membership')}>Membership</MenuItem>
                <MenuItem className={classes.menuItemMobileOnly} onClick={() => handleClose('/')}>Search</MenuItem>
                <MenuItem className={classes.menuItem} onClick={() => handleCloseNoDestination()}>
                  <Suspense fallback={<span>&nbsp;</span>}>
                    <SignInButton classes={classes} />
                  </Suspense>
                </MenuItem>
                <span style={{ lineHeight: '28px' }}>&nbsp;</span>
                <MenuItem className={classes.menuExtraItem} onClick={() => handleClose('/faq')}>Frequently asked questions</MenuItem>
                <MenuItem className={classes.menuExtraItem} onClick={() => handleClose('/terms')}>Terms of service</MenuItem>
                <MenuItem className={classes.menuExtraItem} onClick={() => handleClose('/privacy')}>Privacy Policy</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    </OuterWrapper>
  );
}
const OuterWrapper = styled.div`
  border-bottom: 1px solid #ddd;
  flex-grow: 1;
  min-height: 36px;
  display: ${({ displayHeader }) => ((displayHeader) ? '' : 'none')};
`;
