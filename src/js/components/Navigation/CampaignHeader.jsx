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


export default function CampaignHeader (incomingVariables) {
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

  const { campaignIdentifier } = incomingVariables;
  // console.log('incomingVariables:', incomingVariables);
  // console.log('campaignIdentifier:', campaignIdentifier);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { location: { pathname } } = window;
  if (startsWith('/c/', pathname) && value !== 0) {
    // console.log('Render CampaignHeader, initial value set to 0');
    setValue(0);
  } else if (startsWith('/comments', pathname) && value !== 1) {
    // console.log('Render CampaignHeader, initial value set to 1');
    setValue(1);
  } else if (startsWith('/updates', pathname) && value !== 2) {
    // console.log('Render CampaignHeader, initial value set to 2');
    setValue(2);
  }

  // console.log('Render CampaignHeader.jsx');

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
              <Tab id="weTarget-0" label="Campaign details" onClick={() => history.push(`/c/${campaignIdentifier}`)} />
              <Tab id="weTarget-1" label="Comments" onClick={() => history.push(`/c/${campaignIdentifier}/comments`)} />
              <Tab id="weTarget-2" label="Updates" onClick={() => history.push(`/c/${campaignIdentifier}/updates`)} />
            </Tabs>
          </Toolbar>
        </ThemeProvider>
      </AppBar>
    </div>
  );
}
