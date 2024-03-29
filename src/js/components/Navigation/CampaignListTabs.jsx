import { AppBar, Tab, Tabs, Toolbar } from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { renderLog } from '../../common/utils/logging';
import startsWith from '../../common/utils/startsWith';
// import { ThemeProvider } from '@mui/material/styles';
// import { campaignTheme } from '../Style/campaignTheme';


export default function CampaignListTabs () {  // incomingVariables
  const [value, setValue] = React.useState(0);
  const history = useHistory();

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

  // console.log('Render CampaignListTabs.jsx   ---------- value', value, !Number.isNaN(value));
  renderLog('CampaignListTabs functional component');
  return (
    <div>
      {/* <ThemeProvider theme={campaignTheme(false, 33)}> */}
      <AppBar
        position="relative"
        color="default"
      >
        <Toolbar disableGutters>
          <Tabs value={value} onChange={handleChange} aria-label="Tab menu">
            <Tab id="weTarget-0" label="Your Campaigns" onClick={() => history.push('/profile/started')} />
            <Tab id="weTarget-1" label="Supported Campaigns" onClick={() => history.push('/profile/supported')} />
          </Tabs>
        </Toolbar>
      </AppBar>
      {/* </ThemeProvider> */}
    </div>
  );
}
