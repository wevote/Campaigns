import { AppBar, Tab, Tabs, Toolbar } from '@mui/material';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import startsWith from '../../common/utils/startsWith';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
// import { ThemeProvider } from '@mui/material/styles';
// import { campaignTheme } from '../Style/campaignTheme';


export default function TopNavigationAppBar () {
  const inPrivateLabelMode = AppObservableStore.getHideWeVoteLogo(); // Using this setting temporarily
  const getInitialValue = () => {
    const { location: { pathname } } = window;
    // Change the tab value
    if (inPrivateLabelMode) {
      // If using a private-labeled version, show fewer options
      if (startsWith('/profile', pathname)) {
        // console.log('getInitialValue private labeled, initial value set to 0');
        return 0;
      } else if (startsWith('/search', pathname)) {
        // console.log('getInitialValue private labeled, initial value set to 1');
        return 1;
      }
    } else if (startsWith('/start-a-campaign', pathname)) {
      // console.log('getInitialValue, initial value set to 0');
      return 0;
    } else if (startsWith('/profile', pathname)) {
      // console.log('getInitialValue, initial value set to 1');
      return 1;
    } else if (startsWith('/membership', pathname)) {
      // console.log('getInitialValue, initial value set to 2');
      return 2;
    } else if (startsWith('/search', pathname)) {
      // console.log('getInitialValue, initial value set to 3');
      return 3;
    }
    return 0;
  };

  const [value, setValue] = React.useState(getInitialValue());
  const [configRetrieved, setConfigRetrieved] = React.useState(AppObservableStore.siteConfigurationHasBeenRetrieved());

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onAppObservableStoreChange = () => {
    if (AppObservableStore.siteConfigurationHasBeenRetrieved()) {
      setConfigRetrieved(true);
    }
  };

  useEffect(() => {
    // subscribe event
    const listener = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    return () => {
      // unsubscribe event
      listener.unsubscribe();
    };
  }, []);

  const showIndicatorUnderline = false;
  const history = useHistory();

  // console.log('Render TopNavigationAppBar.jsx   ---------- value', value, !Number.isNaN(value));
  renderLog('TopNavigationAppBar functional component');
  return (
    <div>
      {/* <ThemeProvider theme={campaignTheme(true, 30)}> */}
      <AppBarStyled
        position="relative"
        color="default"
      >
        <ToolbarStyled disableGutters>
          { configRetrieved && !inPrivateLabelMode && (
            <TopNavigationTabs
              value={value}
              onChange={handleChange}
              aria-label="Tab menu"
              TabIndicatorProps={!showIndicatorUnderline ? { style: { display: 'none' } } : {}}
            >
              <Tab id="topNav-0" label="Start a campaign" style={{ minWidth: 125 }} onClick={() => history.push('/start-a-campaign')} />
              <Tab id="topNav-1" label="Your campaigns" style={{ minWidth: 125 }} onClick={() => history.push('/profile/started')} />
              <Tab id="topNav-2" label="Membership" style={{ minWidth: 100 }} onClick={() => history.push('/membership')} />
              {/* {showSearch && <Tab id="topNav-3" index={3} label="Search" style={{ minWidth: 60 }} onClick={() => history.push('/search')} />} */}
            </TopNavigationTabs>
          )}
        </ToolbarStyled>
      </AppBarStyled>
      {/* </ThemeProvider > */}
    </div>
  );
}

const AppBarStyled = styled(AppBar)`
  box-shadow: none;
  padding-bottom: 0;
`;

const ToolbarStyled = styled(Toolbar)`
  min-height: unset !important;
`;

const TopNavigationTabs = styled(Tabs)(({ theme }) => (`
  ${theme.breakpoints.down('md')} {
    display: none;
   },
`));


