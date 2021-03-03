import React from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Tab, Tabs, Toolbar } from '@material-ui/core';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import startsWith from '../../utils/startsWith';


const useStyles = makeStyles((theme) => ({
  appBarRoot: {
    borderBottom: 0,
    boxShadow: 'none',
  },
  hideUnderline: {
    borderBottom: 0,
    boxShadow: 'none',
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down('sm')]: {
      display: 'none !important',
    },
  },
  tabRoot: {
    minHeight: 0,
    minWidth: 125,
    padding: '0 6px',
    '&:hover': {
      color: '#4371cc',
    },
  },
  tabRootMembership: {
    minHeight: 0,
    minWidth: 100,
    padding: '0 6px',
    '&:hover': {
      color: '#4371cc',
    },
  },
  tabRootSearch: {
    minHeight: 0,
    minWidth: 60,
    padding: '0 6px',
    '&:hover': {
      color: '#4371cc',
    },
  },
  tabsRoot: {
    minHeight: 0,
  },
  toolbarRoot: {
    minHeight: 0,
  },
}));


export default function TopNavigationDesktop () {
  const [value, setValue] = React.useState(0);
  const classes = useStyles();
  const history = useHistory();

  const theme = createMuiTheme({
    typography: {
      button: {
        textTransform: 'none',
      },
    },
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { location: { pathname } } = window;
  // Change the tab value
  if (startsWith('/start-a-campaign', pathname) && value !== 0) {
    // console.log('Render TopNavigationDesktop, initial value set to 0');
    setValue(0);
  } else if (startsWith('/profile', pathname) && value !== 1) {
    // console.log('Render TopNavigationDesktop, initial value set to 1');
    setValue(1);
  } else if (startsWith('/membership', pathname) && value !== 2) {
    // console.log('Render TopNavigationDesktop, initial value set to 2');
    setValue(2);
  } else if (startsWith('/search', pathname) && value !== 3) {
    // console.log('Render TopNavigationDesktop, initial value set to 2');
    setValue(3);
  }

  // Show the indicator underline
  const showIndicatorUnderline = false;
  // if (startsWith('/start-a-campaign', pathname)) {
  //   showIndicatorUnderline = true;
  // } else if (startsWith('/profile', pathname)) {
  //   showIndicatorUnderline = true;
  // } else if (startsWith('/membership', pathname)) {
  //   showIndicatorUnderline = true;
  // }

  // console.log('Render TopNavigationDesktop.jsx');
  return (
    <div className={classes.root}>
      <AppBar
        position="relative"
        color="default"
        className={classes.appBarRoot}
      >
        <ThemeProvider theme={theme}>
          <Toolbar className={classes.toolbarRoot} disableGutters>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="Tab menu"
              TabIndicatorProps={showIndicatorUnderline ? (
                {}
              ) : (
                {
                  style: {
                    display: 'none',
                  },
                }
              )}
              className={classes.tabsRoot}
            >
              <Tab className={classes.tabRoot} id="topNav-0" label="Start a campaign" onClick={() => history.push('/start-a-campaign')} />
              <Tab className={classes.tabRoot} id="topNav-1" label="My campaigns" onClick={() => history.push('/profile/started')} />
              <Tab className={classes.tabRootMembership} id="topNav-2" label="Membership" onClick={() => history.push('/membership')} />
              <Tab className={classes.tabRootSearch} id="topNav-3" label="Search" onClick={() => history.push('/search')} />
            </Tabs>
          </Toolbar>
        </ThemeProvider>
      </AppBar>
    </div>
  );
}
