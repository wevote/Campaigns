import loadable from '@loadable/component';
import { Launch } from '@mui/icons-material';
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import styled from '@mui/material/styles/styled';
import makeStyles from '@mui/styles/makeStyles';
import React, { Suspense } from 'react';
import DelayedLoad from '../../common/components/Widgets/DelayedLoad';
import OpenExternalWebSite from '../../common/components/Widgets/OpenExternalWebSite';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import AppObservableStore from '../../stores/AppObservableStore';
import initializeAppleSDK from '../../utils/initializeAppleSDK';
import initializeFacebookSDK from '../../utils/initializeFacebookSDK';

const HeaderBarLogo = loadable(() => import('./HeaderBarLogo'));
const SignInButton = loadable(() => import('./SignInButton'));
const SignInModalController = loadable(() => import('../Settings/SignInModalController'));
const TopNavigationDesktopController = loadable(() => import('./TopNavigationDesktopController'));
const VoterNameAndPhoto = loadable(() => import('./VoterNameAndPhoto'));


// TODO: Mar 23, 2022, makeStyles is legacy in MUI 5, replace instance with styled-components or sx if there are issues
const useStyles = makeStyles((theme) => ({
  appBarRoot: {
    boxShadow: 'none',
    paddingBottom: '0',
  },
  ballotLink: {
    color: '#000',
    fontWeight: 400,
    textDecoration: 'none',
    '&:hover': {
      color: '#4371cc',
    },
  },
  innerWrapper: {
    margin: '0 auto',
    maxWidth: '980px', // The WeVote icon extends beyond the visible area, and we want to line up the visible
  },
  launchIcon: {
    height: 14,
  },
  logoLinkRoot: {
    height: 0,
    fontSize: 0,
  },
  menuButton: {
    fontSize: '4px',
    marginLeft: '-4px',
    marginRight: 8,
    padding: '0',
  },
  menuRoot: {
    marginTop: '27px',
  },
  menuItem: {
    textTransform: 'none',
    [theme.breakpoints.down('lg')]: {
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

  const inPrivateLabelMode = AppObservableStore.getHideWeVoteLogo(); // Using this setting temporarily
  const voterCanStartCampaignXForThisPrivateLabelSite = AppObservableStore.voterCanStartCampaignXForThisPrivateLabelSite();
  const showStartACampaign = !(inPrivateLabelMode) || voterCanStartCampaignXForThisPrivateLabelSite;
  const showMembership = !(inPrivateLabelMode);

  renderLog('MainHeaderBar');

  // console.log('MainHeaderBar displayHeader: ', displayHeader);
  return (
    <OuterWrapperHeaderBar displayHeader={displayThis}>
      <div className={classes.innerWrapper}>
        <AppBar className={classes.appBarRoot} position="static" color="default" id="MainheaderBar_AppBar">
          <Toolbar className={classes.toolbarRoot} disableGutters>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              size="large"
            >
              <Suspense fallback={<span>&nbsp;</span>}>
                <HeaderBarLogo />
              </Suspense>
            </IconButton>
            <Suspense fallback={<span>&nbsp;</span>}>
              <TopNavigationDesktopController />
            </Suspense>
            <Typography variant="h6" className={classes.title}>
              &nbsp;
            </Typography>
            <Suspense fallback={<span>&nbsp;</span>}>
              <SignInModalController />
            </Suspense>
            <div className="u-show-desktop-tablet">
              <DelayedLoad waitBeforeShow={500}>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <SignInTopBarWrapper>
                    <SignInButton hideSignOut topNavigationStyles />
                  </SignInTopBarWrapper>
                </Suspense>
              </DelayedLoad>
            </div>
            <div>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                id="openMainHeaderBarDropDown"
                onClick={handleMenu}
                aria-label="menu"
                size="large"
              >
                <Suspense fallback={<span>&nbsp;</span>}>
                  <VoterNameAndPhoto />
                </Suspense>
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
                {!inPrivateLabelMode && (
                  <Typography variant="h6" className={classes.title} style={ourPromise}>
                    Our Promise: We&apos;ll never sell your email.
                  </Typography>
                )}
                <MenuItem className={classes.menuItem} onClick={() => handleClose('/edit-profile')}>Settings</MenuItem>
                {showStartACampaign && <MenuItem className={classes.menuItem} onClick={() => handleClose('/start-a-campaign')}>Start a campaign</MenuItem>}
                <MenuItem className={classes.menuItem} onClick={() => handleClose('/profile/started')}>Your campaigns</MenuItem>
                <MenuItem className={classes.menuItem}>
                  <OpenExternalWebSite
                    linkIdAttribute="weVoteBallot"
                    url="https://wevote.us/ballot"
                    target="_blank"
                    body={(
                      <div style={{ display: 'flex' }}>
                        <div>
                          Your ballot
                        </div>
                        <div style={{ marginTop: '2px' }}>
                          <Launch className={classes.launchIcon} />
                        </div>
                      </div>
                    )}
                    className={classes.ballotLink}
                  />
                </MenuItem>
                {showMembership && <MenuItem className={classes.menuItemMobileOnly} onClick={() => handleClose('/membership')}>Membership</MenuItem>}
                {/* <MenuItem className={classes.menuItem} onClick={() => handleClose('/search')}>Search</MenuItem> */}
                <MenuItem className={classes.menuItem} onClick={() => handleCloseNoDestination()}>
                  <Suspense fallback={<span>&nbsp;</span>}>
                    <SignInButton classes={classes} />
                  </Suspense>
                </MenuItem>
                {!inPrivateLabelMode && <span style={{ lineHeight: '28px' }}>&nbsp;</span>}
                {!inPrivateLabelMode && <MenuItem className={classes.menuExtraItem} onClick={() => handleClose('/faq')}>Frequently asked questions</MenuItem>}
                {!inPrivateLabelMode && <MenuItem className={classes.menuExtraItem} onClick={() => handleClose('/terms')}>Terms of service</MenuItem>}
                {!inPrivateLabelMode && <MenuItem className={classes.menuExtraItem} onClick={() => handleClose('/privacy')}>Privacy Policy</MenuItem>}
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    </OuterWrapperHeaderBar>
  );
}

const OuterWrapperHeaderBar = styled('div', {
  shouldForwardProp: (prop) => !['displayHeader'].includes(prop),
})(({ displayHeader }) => (`
  border-bottom: 1px solid #ddd;
  flex-grow: 1;
  min-height: 36px;
  display: ${displayHeader ? '' : 'none'};
`));

const SignInTopBarWrapper = styled('div')`
  cursor: pointer;
  margin-right: 12px;
`;
