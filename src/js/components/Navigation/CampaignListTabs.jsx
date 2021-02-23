import React from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Tab, Tabs, Toolbar } from '@material-ui/core';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import startsWith from '../../utils/startsWith';


const useStyles = makeStyles((theme) => ({
  appBarRoot: {
    borderBottom: '1px solid #ddd',
    boxShadow: 'none',
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  toolbarRoot: {
    minHeight: 0,
  },
}));


export default function CampaignListTabs () {  // incomingVariables
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
  if (startsWith('/profile/started', pathname) && value !== 0) {
    // console.log('Render CampaignListTabs, initial value set to 0');
    setValue(0);
  } else if (startsWith('/profile/supported', pathname) && value !== 1) {
    // console.log('Render CampaignListTabs, initial value set to 1');
    setValue(1);
  }

  // console.log('Render CampaignListTabs.jsx');

  return (
    <div className={classes.root}>
      <AppBar
        position="relative"
        color="default"
        className={classes.appBarRoot}
      >
        <ThemeProvider theme={theme}>
          <Toolbar className={classes.toolbarRoot} disableGutters>
            <Tabs value={value} onChange={handleChange} aria-label="Tab menu">
              <Tab id="weTarget-0" label="Started" onClick={() => history.push('/profile/started')} />
              <Tab id="weTarget-1" label="Campaigns Supported" onClick={() => history.push('/profile/supported')} />
            </Tabs>
          </Toolbar>
        </ThemeProvider>
      </AppBar>
    </div>
  );
}
